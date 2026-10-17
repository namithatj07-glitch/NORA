
import os
import json
import speech_recognition as sr
from vosk import Model, KaldiRecognizer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "vosk-model")

print("Loading Vosk model...")

if not os.path.isdir(MODEL_PATH):
    print("ERROR: Model folder not found:", MODEL_PATH)
    print("Check that the extracted Vosk model is inside your project folder.")
    raise SystemExit(1)

try:
    model = Model(MODEL_PATH)
    print("Vosk model loaded successfully!")
except Exception as e:
    print("Could not load Vosk model:", e)
    raise SystemExit(1)

recognizer = sr.Recognizer()
recognizer.dynamic_energy_threshold = True
recognizer.pause_threshold = 0.8

try:
    with sr.Microphone(sample_rate=16000) as source:
        print("\nKeep quiet for 2 seconds...")
        recognizer.adjust_for_ambient_noise(source, duration=2)

        print("\nSpeak clearly: Hello NORA, can you hear me?")
        audio = recognizer.listen(
            source,
            timeout=10,
            phrase_time_limit=8
        )

    print("Audio captured. Converting to 16 kHz...")
    raw_audio = audio.get_raw_data(
        convert_rate=16000,
        convert_width=2
    )

    vosk_recognizer = KaldiRecognizer(model, 16000)
    vosk_recognizer.SetWords(True)

    # Process the audio in chunks.
    chunk_size = 4000

    for start in range(0, len(raw_audio), chunk_size):
        chunk = raw_audio[start:start + chunk_size]
        vosk_recognizer.AcceptWaveform(chunk)

    result = json.loads(vosk_recognizer.FinalResult())
    recognized_text = result.get("text", "").strip()

    print("\nRecognition result:", result)

    if recognized_text:
        print("\nSUCCESS! NORA heard:", recognized_text)
    else:
        print("\nNo words recognized.")
        print("Try speaking slowly and clearly, closer to the microphone.")
        print("Also verify that your Vosk model is an English model.")

except sr.WaitTimeoutError:
    print("No speech detected before timeout. Try again.")
except Exception as e:
    print("\nTEST ERROR:", repr(e))
