from fastapi import FastAPI, UploadFile, File, HTTPException
import torch
import torchaudio
import tempfile
import shutil
import os
import pickle
import numpy as np
import subprocess
import httpx
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = FastAPI()

EXPRESS_API_URL = "http://localhost:5000/api/transcription/save"

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

def convert_mp3_to_wav(mp3_path):
    """Konversi MP3 ke WAV menggunakan FFmpeg"""
    wav_path = mp3_path.replace(".mp3", ".wav")
    command = ["ffmpeg", "-i", mp3_path, "-ar", "16000", "-ac", "1", wav_path, "-y"]
    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return wav_path

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Menerima file audio, melakukan transkripsi, lalu mengirim hasil ke Express.js."""

    if not file.filename:
        raise HTTPException(status_code=400, detail="File tidak valid.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_audio_path = temp_audio.name

    try:
        # 🔹 Ubah MP3 ke WAV sebelum membaca audio
        wav_path = convert_mp3_to_wav(temp_audio_path)

        # 🔹 Load audio dengan torchaudio (lebih stabil daripada librosa)
        waveform, sample_rate = torchaudio.load(wav_path)
        
        # 🔹 Pastikan sample rate 16kHz
        transform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
        waveform = transform(waveform)
        audio = waveform.numpy().flatten()

        # 🔹 Transkripsi dengan Whisper
        input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features.to(device)
        
        with torch.no_grad():
            forced_decoder_ids = processor.get_decoder_prompt_ids(language="id", task="transcribe")
            predicted_ids = whisper_model.generate(input_features, forced_decoder_ids=forced_decoder_ids, max_length=300)
        
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

        # 🔹 Cek apakah hasil transkripsi kosong
        if not transcription.strip():
            raise HTTPException(status_code=500, detail="Gagal melakukan transkripsi (hasil kosong).")

        # 🔹 Lakukan klasifikasi teks
        label = classify_text(transcription)

        # 🔹 Debugging log
        print(f"Transcription: {transcription}, Label: {label}")

        # 🔹 Kirim hasil ke Express.js
        async with httpx.AsyncClient() as client:
            response = await client.post(EXPRESS_API_URL, json={
                "file_name": file.filename,
                "transcription": transcription,
                "label": label
            })

        return {"transcription": transcription, "label": label, "express_status": response.status_code}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    finally:    
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
        if os.path.exists(wav_path):
            os.remove(wav_path)

def classify_text(transcription):
    """Klasifikasikan teks menggunakan model TensorFlow/Keras."""
    sequence = tokenizer.texts_to_sequences([transcription])
    padded = pad_sequences(sequence, maxlen=10, padding="post", truncating="post")
    prediction = classification_model.predict(padded)
    label_index = np.argmax(prediction)
    return label_encoder.inverse_transform([label_index])[0]
