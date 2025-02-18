import sys
import torch
import librosa
from transformers import WhisperProcessor, WhisperForConditionalGeneration

# Load model & processor
model_name = "openai/whisper-small"
processor = WhisperProcessor.from_pretrained(model_name)
model = WhisperForConditionalGeneration.from_pretrained(model_name)
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Ambil path file dari argument
audio_path = sys.argv[1]

# Load audio & resample ke 16kHz
audio, rate = librosa.load(audio_path, sr=16000)

# Proses audio
input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features.to(device)

# Transkripsi
forced_decoder_ids = processor.get_decoder_prompt_ids(language="id", task="transcribe")
predicted_ids = model.generate(input_features, forced_decoder_ids=forced_decoder_ids)
transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

# Cetak hasil transkripsi ke stdout
print(transcription)
