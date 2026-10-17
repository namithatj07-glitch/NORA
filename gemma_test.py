
import os
import re
import json
import base64
import subprocess

import speech_recognition as sr
import ollama
from vosk import Model, KaldiRecognizer
from difflib import SequenceMatcher

# ========== SETTINGS ==========

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VOSK_PATH = os.path.join(BASE_DIR, "vosk-model")
MEMORY_FILE = os.path.join(BASE_DIR, "nora_memory.json")

AI_MODEL = "gemma3:1b"
USER_NAME = "Alex"


# ========== SAVED MEMORY ==========

def load_memory():
    memory = {}

    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE, "r", encoding="utf-8") as file:
                memory = json.load(file)
        except (json.JSONDecodeError, OSError):
            print("Memory file could not be read. Creating a new one.")

    # Set the preferred name to Alex.
    memory["user_name"] = USER_NAME

    try:
        with open(MEMORY_FILE, "w", encoding="utf-8") as file:
            json.dump(memory, file, indent=2, ensure_ascii=False)
    except OSError as error:
        print("Memory saving error:", error)

    return memory


memory = load_memory()


# ========== DAILY ROUTINES ==========
ROUTINES_FILE = os.path.join(BASE_DIR, "routines.json")


def load_routines():
    try:
        with open(ROUTINES_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, dict):
            raise ValueError("The routines file must contain a JSON object.")

        return data

    except FileNotFoundError:
        print("Warning: routines.json was not found.")
        return {}

    except (json.JSONDecodeError, OSError, ValueError) as error:
        print("Could not load routines:", error)
        return {}




# ========== CLEAN AI RESPONSES ==========

def clean_response(text):
    # Remove common emoji, pictograph and variation-selector characters.
    emoji_pattern = (
        "["
        "\U0001F000-\U0001FAFF"
        "\U00002600-\U000027BF"
        "\U0000FE00-\U0000FE0F"
        "\U0001F1E6-\U0001F1FF"
        "\U0000200D"
        "\U000020E3"
        "\U0001F3FB-\U0001F3FF"
        "]+"
    )

    text = re.sub(emoji_pattern, "", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def answer_routine(user_text):
    """Answer explicit routine questions from the local JSON file."""
    text = user_text.lower().strip()

    # Only handle questions that clearly ask about a routine.
    routine_requests = (
        "routine", "daily schedule", "morning schedule",
        "afternoon schedule", "evening schedule", "night schedule",
        "what is next in my schedule",
        "what is next in my routine"
    )

    if not any(phrase in text for phrase in routine_requests):
        return None

    routines = load_routines()

    if not routines:
        return "I couldn't load your saved routines. Please check the routines file."

    # Only use recognized routine categories with a list of steps.
    valid_periods = ("morning", "afternoon", "evening", "night")
    routines = {
        period: routines[period]
        for period in valid_periods
        if isinstance(routines.get(period), list)
    }

    if not routines:
        return "Your routine file doesn't contain any valid routines yet."

    selected_period = next(
        (period for period in valid_periods if period in text and period in routines),
        None
    )

    if selected_period is None:
        selected_period = next(iter(routines), None)

    if selected_period is None:
        return "Which routine would you like: morning, afternoon, evening, or night?"

    steps = routines[selected_period]

    if not steps:
        return f"Your {selected_period} routine has no saved steps yet."

    answer = f"Here is your {selected_period} routine. "
    answer += " ".join(
        f"Step {index + 1}: {step}"
        for index, step in enumerate(steps)
    )
    return answer

# ========== NORA'S VOICE: WINDOWS SPEECH ==========

def speak(text):
    text = clean_response(str(text))

    if not text:
        return

    print(f"\nNORA: {text}")

    # Encode the text safely for PowerShell.
    message_b64 = base64.b64encode(
        text.encode("utf-8")
    ).decode("ascii")

    powershell_script = f"""
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Volume = 100
$synth.Rate = 0
$message = [System.Text.Encoding]::UTF8.GetString(
    [System.Convert]::FromBase64String("{message_b64}")
)
$synth.Speak($message)
$synth.Dispose()
"""

    encoded_script = base64.b64encode(
        powershell_script.encode("utf-16le")
    ).decode("ascii")

    try:
        subprocess.run(
            [
                "powershell.exe",
                "-NoProfile",
                "-EncodedCommand",
                encoded_script
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
            timeout=120
        )
    except Exception as error:
        print("NORA speech error:", error)


# ========== LOAD VOSK SPEECH RECOGNITION ==========

if not os.path.isdir(VOSK_PATH):
    raise FileNotFoundError(
        f"Vosk model folder not found: {VOSK_PATH}\n"
        "Check that the vosk-model folder is inside your project folder."
    )

print("Loading Vosk model...")
vosk_model = Model(VOSK_PATH)
print("Vosk is ready!")


# ========== MICROPHONE ==========

microphone_recognizer = sr.Recognizer()
microphone_recognizer.dynamic_energy_threshold = True
microphone_recognizer.pause_threshold = 0.8
microphone_recognizer.non_speaking_duration = 0.5


def listen():
    try:
        with sr.Microphone(sample_rate=16000) as source:
            print("\nNORA is listening. Speak clearly...")

            # Calibrate briefly for room noise.
            microphone_recognizer.adjust_for_ambient_noise(
                source,
                duration=0.6
            )

            audio = microphone_recognizer.listen(
                source,
                timeout=15,
                phrase_time_limit=12
            )

        raw_audio = audio.get_raw_data(
            convert_rate=16000,
            convert_width=2
        )

        recognizer = KaldiRecognizer(vosk_model, 16000)

        # Feed the recording to Vosk in chunks.
        chunk_size = 4000

        for start in range(0, len(raw_audio), chunk_size):
            recognizer.AcceptWaveform(
                raw_audio[start:start + chunk_size]
            )

        result = json.loads(recognizer.FinalResult())
        recognized_text = result.get("text", "").strip()

        if recognized_text:
            print(f"\nYOU SAID: {recognized_text}")
            return recognized_text

        print("I couldn't recognize those words. Please try again.")
        return ""

    except sr.WaitTimeoutError:
        print("I didn't hear speech. Please try again.")
        return ""

    except Exception as error:
        print("Listening error:", repr(error))
        return ""


# ========== GEMMA AI ==========


system_prompt = f"""
You are NORA, a friendly, patient, respectful and helpful voice-controlled
assistive AI for everyday life.

The user's preferred name is {memory["user_name"]}.
Use the name Alex when addressing the user.
Never invent or change the user's name.

YOUR PURPOSE:
Help the user with a wide range of everyday needs. You are not limited
to routines or a single task.

YOU CAN HELP WITH:
- Answering general knowledge questions.
- Explaining difficult topics in simple language.
- Helping plan everyday activities and organize tasks.
- Giving step-by-step instructions.
- Supporting memory with information actually available to you.
- Helping the user understand their schedule and routines.
- Brainstorming ideas, writing messages and solving everyday problems.
- Offering calm, respectful assistance when the user feels confused.
- Asking a short clarification question when the request is unclear.

IMPORTANT BEHAVIOUR:
- Answer the user's actual question instead of forcing it into a routine.
- Do not assume the user needs help with a particular task.
- Offer choices when several approaches may help.
- Give one step at a time when the user needs instructions.
- Be patient if the user repeats a question.
- Do not invent appointments, memories, personal details or completed actions.
- Only claim to remember information that is actually available.
- Be honest when you do not know something.
- For emergencies, encourage contacting local emergency services or a
  trusted person as appropriate.
- You are an AI assistant, not a substitute for professional medical care.

VOICE RESPONSE STYLE:
- Use simple, natural, warm language.
- Keep answers concise and easy to understand when spoken aloud.
- Use plain text. Do not use emojis or decorative symbols.
- Avoid unnecessarily complicated words.
"""


# ========== MAIN PROGRAM ==========

def main():
    try:
        ollama.list()

        speak(
            f"Hello! I'm NORA. "
            f"Hi {memory['user_name']}. "
            "I'm ready to listen. What would you like to talk about?"
        )

    except Exception as error:
        print("Ollama connection error:", repr(error))
        speak("I couldn't connect to my AI brain. Please check Ollama.")
        return

    while True:
       

        user_text = listen()

        if not user_text:
            continue
        if should_stop(user_text):
            speak("Goodbye, Alex. I'll be here when you need me.")
            break
       
        reply = answer_routine(user_text)

        if reply is None:
            reply = ask_gemma(user_text)

        speak(reply)


def should_stop(user_text):
    """Recognize common voice commands for stopping NORA."""
    text = re.sub(r"[^a-z0-9\s]", "", user_text.lower())
    text = " ".join(text.split())

    exact_commands = {
        "stop",
        "stop nora",
        "nora stop",
        "nora please stop",
        "please stop",
        "stop listening",
        "nora stop listening",
        "exit",
        "exit nora",
        "quit",
        "quit nora",
        "shut down",
        "nora shut down",
        "turn off",
        "turn off nora",
        "goodbye",
        "goodbye nora"
    }

    if text in exact_commands:
        return True

    # Allow common recognition errors in short stop commands.
    words = text.split()

    if len(words) <= 3 and words:
        last_word = words[-1]

        for command in ("stop", "exit", "quit"):
            if SequenceMatcher(None, last_word, command).ratio() >= 0.80:
                return True

    return False

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nNORA stopped.")
    finally:
        print("NORA has shut down.")
