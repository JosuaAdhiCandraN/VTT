import sys
import librosa

# Ambil path file dari argument
if len(sys.argv) < 2:
    print("Usage: python cek_ram.py <audio_path>", file=sys.stderr)
    sys.exit(1)

audio_path = sys.argv[1]

try:
    audio, rate = librosa.load(audio_path, sr=16000, mono=True)
    audio_size_mb = audio.nbytes / 1e6
    print(f"{audio_size_mb:.2f} MB")  # Print ukuran audio ke terminal
except Exception as e:
    print(f"Error loading audio: {str(e)}", file=sys.stderr)
    sys.exit(1)
