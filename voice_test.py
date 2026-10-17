
import pyttsx3
import traceback

print("Starting NORA voice test...")

try:
    engine = pyttsx3.init("sapi5")

    engine.setProperty("volume", 1.0)
    engine.setProperty("rate", 150)

    voices = engine.getProperty("voices")
    print("\nAvailable Windows voices:")

    for i, voice in enumerate(voices):
        print(i, voice.name, voice.id)

    if voices:
        engine.setProperty("voice", voices[0].id)

    print("\nNORA should speak now.")
    engine.say(
        "Hello! I am NORA. "
        "If you can hear me, my speaking system is working."
    )
    engine.runAndWait()
    engine.stop()

    print("\nVoice test finished.")

except Exception:
    traceback.print_exc()
