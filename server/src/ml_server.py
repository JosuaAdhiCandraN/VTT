from fastapi import FastAPI, UploadFile, File, HTTPException 
import requests
import torch
import torchaudio
import tempfile
import shutil
import os
import pickle
import numpy as np
import subprocess
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = FastAPI()
EP = "http://localhost:5000/api/transcription/save"
# Load Whisper model
whisper_model_name = "openai/whisper-small"
processor = WhisperProcessor.from_pretrained(whisper_model_name)
whisper_model = WhisperForConditionalGeneration.from_pretrained(whisper_model_name)
device = "cuda" if torch.cuda.is_available() else "cpu"
whisper_model.to(device)

# Load model klasifikasi
classification_model = load_model("text_classification_nn.h5")

# Load tokenizer & label encoder
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)
with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

FFMPEG_PATH = "D:/ffmpeg-7.1-essentials_build/bin/ffmpeg.exe"

def convert_mp3_to_wav(mp3_path):
    """Konversi MP3 ke WAV menggunakan FFmpeg"""
    if not os.path.exists(mp3_path):
        raise FileNotFoundError(f"File MP3 tidak ditemukan: {mp3_path}")

    wav_path = mp3_path.replace(".mp3", ".wav")
    command = [FFMPEG_PATH, "-i", mp3_path, "-ar", "16000", "-ac", "1", wav_path, "-y"]
    
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg error: {result.stderr}")

    if not os.path.exists(wav_path):
        raise FileNotFoundError(f"File WAV tidak ditemukan setelah konversi: {wav_path}")

    return wav_path

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Menerima file audio, melakukan transkripsi, lalu mengirim hasil ke Express.js."""
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="File tidak valid.")

    # Simpan nama file asli
    original_filename = file.filename
    print(f"📂 Received file: {original_filename}, Type: {file.content_type}")

    wav_path = None

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_audio_path = temp_audio.name

    try:
        # Konversi MP3 ke WAV
        print("Converting MP3 to WAV...")
        wav_path = convert_mp3_to_wav(temp_audio_path)

        # Load audio
        print("Loading audio with torchaudio...")
        waveform, sample_rate = torchaudio.load(wav_path)

        # Pastikan sample rate 16kHz
        print(f"Original Sample Rate: {sample_rate}, Converting to 16kHz...")
        transform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = transform(waveform)
        audio = waveform.numpy().flatten()

        # Transkripsi dengan Whisper
        print("Transcribing with Whisper...")
        input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features.to(device)
        
        with torch.no_grad():
            forced_decoder_ids = processor.get_decoder_prompt_ids(language="id", task="transcribe")
            predicted_ids = whisper_model.generate(input_features, forced_decoder_ids=forced_decoder_ids, max_length=600)

        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

        if not transcription.strip():
            raise HTTPException(status_code=500, detail="Gagal melakukan transkripsi (hasil kosong).")

        # Klasifikasi teks
        print("Classifying text...")
        label = classify_text(transcription)

        print(f"Transcription: {transcription}, Label: {label}")

        # 🔴 **Tambahkan request ke Express.js untuk menyimpan ke MongoDB**
        payload = {"transcription": transcription, "label": label}

        try:
            response = requests.post(EP, json=payload, timeout=5)
            print(f"✅ Data sent to Express.js: {response.json()}")
        except Exception as e:
            print(f"❌ Failed to send data to Express.js: {e}")

        # Kembalikan respons untuk frontend
        return {
            "original_filename": original_filename,
            "fileName": original_filename,
            "transcription": transcription, 
            "label": label
        }

    except Exception as e:
        print(f"ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)

def classify_text(transcription):
    """Klasifikasikan teks menggunakan model TensorFlow/Keras."""
    print(f"📜 Received transcription for classification: {transcription}")

    sequence = tokenizer.texts_to_sequences([transcription])
    if not sequence or len(sequence[0]) == 0:
        print("❌ Tokenization failed: Empty sequence")
        raise HTTPException(status_code=500, detail="Tokenization failed: Empty sequence")

    padded = pad_sequences(sequence, maxlen=100, padding="post", truncating="post")
    print(f"📏 Padded sequence shape: {padded.shape}")

    try:
        prediction = classification_model.predict(padded)
        print(f"🔮 Probabilities: {prediction}")  # Menampilkan probabilitas tiap kelas
        label_index = np.argmax(prediction, axis=1)[0]
        print(f"🏷 Chosen index: {label_index}")
    except Exception as e:
        print(f"❌ Model prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")

    try:
        label = label_encoder.inverse_transform([label_index])[0]
    except Exception as e:
        print(f"❌ Label encoding failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Label encoding failed: {str(e)}")

    print(f"✅ Final classified label: {label}")
    return label
