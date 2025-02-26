import sys
import torch
import librosa
from transformers import WhisperProcessor, WhisperForConditionalGeneration

# Load model & processor
model_name = "openai/whisper-base"
processor = WhisperProcessor.from_pretrained(model_name)
model = WhisperForConditionalGeneration.from_pretrained(model_name)

# Gunakan GPU jika tersedia
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Ambil path file dari argument
if len(sys.argv) < 2:
    print("Usage: python transcribe.py <audio_path>", file=sys.stderr)
    sys.exit(1)

audio_path = sys.argv[1]

# Periksa apakah file ada sebelum diproses
try:
    audio, rate = librosa.load(audio_path, sr=16000, mono=True)
except Exception as e:
    print(f"Error loading audio file: {str(e)}", file=sys.stderr)
    sys.exit(1)

# Proses audio menggunakan WhisperProcessor
try:
    input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features.to(device)

    # Transkripsi dengan penghematan memori
    with torch.no_grad():
        forced_decoder_ids = processor.get_decoder_prompt_ids(language="id", task="transcribe")
        predicted_ids = model.generate(input_features, forced_decoder_ids=forced_decoder_ids, max_length=1000)

    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    # Cetak hasil transkripsi ke stdout untuk diambil oleh backend
    print(transcription)

except Exception as e:
    print(f"Error during transcription: {str(e)}", file=sys.stderr)
    sys.exit(1)
