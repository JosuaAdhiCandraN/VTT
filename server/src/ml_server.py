from fastapi import FastAPI, UploadFile, File, HTTPException
import torch
import librosa
import tempfile
import shutil
import os
import pickle
import numpy as np
import httpx  # Import httpx untuk mengirim request ke Express.js
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = FastAPI()

# URL Express.js untuk menyimpan ke MongoDB
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

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Menerima file audio, melakukan transkripsi, lalu mengirim hasil ke Express.js."""
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="File tidak valid.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        shutil.copyfileobj(file.file, temp_audio)
        temp_audio_path = temp_audio.name

    try:
        # Load audio file
        file.file.seek(0)  
        audio, rate = librosa.load(temp_audio_path, sr=16000, mono=True)

        # Konversi audio ke input model Whisper
        input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features.to(device)

        with torch.no_grad():
            forced_decoder_ids = processor.get_decoder_prompt_ids(language="id", task="transcribe")
            predicted_ids = whisper_model.generate(input_features, forced_decoder_ids=forced_decoder_ids, max_length=300)

        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        if not transcription:
            raise HTTPException(status_code=500, detail="Gagal melakukan transkripsi.")

        # Lakukan klasifikasi teks
        label = classify_text(transcription)

        # Kirim hasil ke Express.js
        async with httpx.AsyncClient() as client:
            response = await client.post(EXPRESS_API_URL, json={
                "transcription": transcription,
                "label": label
            })

        return {"transcription": transcription, "label": label, "express_status": response.status_code}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

def classify_text(transcription):
    """Klasifikasikan teks menggunakan model TensorFlow/Keras."""
    sequence = tokenizer.texts_to_sequences([transcription])
    padded = pad_sequences(sequence, maxlen=10, padding="post", truncating="post")
    prediction = classification_model.predict(padded)
    label_index = np.argmax(prediction)
    return label_encoder.inverse_transform([label_index])[0]
