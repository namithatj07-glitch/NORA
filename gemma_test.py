
import json
import os
import time
import threading
from datetime import datetime

import ollama

MODEL_NAME = "gemma3:1b"
DATA_FILE = "routines.json"

file_lock = threading.Lock()
print_lock = threading.Lock()
stop_event = threading.Event()

routine_data = {}
file_signature = None
notified_tasks = set()


SYSTEM_PROMPT = """
You are NORA, a compassionate daily-life assistant for a person
living with Alzheimer's or memory difficulties.

Use short, simple, reassuring sentences.
Give one manageable instruction at a time.
Respect the person's choices and dignity.
Use saved information when relevant.
Never invent personal memories, appointments, routines, or items.
Never invent medication instructions or change a dose.
Do not claim a task is complete without confirmation.
If information is missing, say so.
You support daily life but do not replace caregivers or clinicians.
"""


def load_schedule(force=False):
    """Load updated JSON data when the file changes."""
    global routine_data, file_signature

    try:
        stat = os.stat(DATA_FILE)
        signature = (stat.st_mtime_ns, stat.st_size)

        if not force and signature == file_signature:
            return False

        with open(DATA_FILE, "r", encoding="utf-8") as file:
            new_data = json.load(file)

        if not isinstance(new_data, dict):
            raise ValueError("The JSON root must be an object.")

        with file_lock:
            routine_data = new_data
            file_signature = signature

        with print_lock:
            print("\n[NORA SYSTEM] Schedule loaded or updated.")

        return True

    except (OSError, json.JSONDecodeError, ValueError) as error:
        with print_lock:
            print("\n[NORA SYSTEM] Could not load schedule:", error)

        return False


def get_data():
    """Return a snapshot of the current schedule."""
    with file_lock:
        return json.loads(json.dumps(routine_data))


def show_routines():
    data = get_data()
    routines = data.get("routines", {}).get("morning", [])

    if not routines:
        print("\nNORA: No morning routines are saved.\n")
        return

    print("\nNORA: Here are the saved morning activities:")

    for activity in routines:
        print("\nActivity:", activity.get("task", "Unnamed activity"))
        print("Items:", ", ".join(activity.get("items", [])))

        steps = activity.get("steps", [])
        if steps:
            print("First step:", steps[0])

    print()


def find_activity(task_name):
    data = get_data()

    for activity in data.get("routines", {}).get("morning", []):
        if activity.get("task", "").strip().lower() == task_name.lower():
            return activity

    return None


def show_dressing_items():
    activity = find_activity("Get dressed")

    if not activity:
        print("\nNORA: I don't have saved dressing information yet.\n")
        return

    items = activity.get("items", [])

    if not items:
        print("\nNORA: No dressing items have been saved.\n")
        return

    print("\nNORA: Here are the saved dressing items:")
    for item in items:
        print("-", item)
    print()


def guide_dressing():
    activity = find_activity("Get dressed")

    if not activity or not activity.get("steps"):
        print("\nNORA: I don't have a saved dressing routine yet.\n")
        return

    print("\nNORA: Let's follow your saved dressing routine.")

    for index, step in enumerate(activity["steps"]):
        print("\nNORA:", step)

        if index == len(activity["steps"]) - 1:
            break

        answer = input("Ready for the next step? (yes/no): ").strip().lower()

        if answer not in ("yes", "y"):
            print("\nNORA: That's okay. We can pause here.")
            print("Type 'guide dressing' when you want to try again.\n")
            return

    print("\nNORA: We've reached the end of the saved instructions.")
    print("Please make sure everything feels comfortable and safe.\n")


def show_schedule():
    data = get_data()
    schedule = data.get("schedule", [])

    if not schedule:
        print("\nNORA: No scheduled commitments are saved.\n")
        return

    print("\nNORA: Here is the saved schedule:")

    for task in schedule:
        status = "enabled" if task.get("enabled") is True else "disabled"
        days = ", ".join(task.get("days", []))

        print(
            f"- {task.get('time', 'No time')} | "
            f"{task.get('title', 'Unnamed task')} | "
            f"{days} | {status}"
        )

        items = task.get("items", [])
        if items:
            print("  Items:", ", ".join(items))

    print()


def reminder_worker():
    """
    Check the local clock and file in the background.
    Reminders are issued once per task per local calendar day,
    within five minutes after its scheduled time.
    """
    global notified_tasks

    while not stop_event.is_set():
        load_schedule()

        data = get_data()
        now = datetime.now()
        today = now.strftime("%a").lower()
        today_key = now.strftime("%Y-%m-%d")
        current_minutes = now.hour * 60 + now.minute

        for task in data.get("schedule", []):
            if task.get("enabled") is not True:
                continue

            task_id = task.get("id")
            title = task.get("title", "Scheduled activity")
            time_text = task.get("time", "")
            days = task.get("days", [])

            if not task_id or today not in days:
                continue

            try:
                hour_text, minute_text = time_text.split(":")
                scheduled_minutes = int(hour_text) * 60 + int(minute_text)

                if not (0 <= int(hour_text) <= 23 and
                        0 <= int(minute_text) <= 59):
                    continue

            except (ValueError, TypeError):
                continue

            # Only notify during the five-minute window after the time.
            if 0 <= current_minutes - scheduled_minutes <= 4:
                reminder_key = (today_key, task_id)

                if reminder_key not in notified_tasks:
                    notified_tasks.add(reminder_key)

                    items = task.get("items", [])

                    with print_lock:
                        print("\n")
                        print("=" * 40)
                        print("NORA REMINDER")
                        print("=" * 40)
                        print(f"It's time for: {title}")

                        if items:
                            print("Items to check:")
                            for item in items:
                                print("-", item)

                        instructions = task.get("instructions", [])
                        if instructions:
                            print("Saved instruction:", instructions[0])

                        print("Please check the schedule and confirm")
                        print("the activity is still appropriate.")
                        print("=" * 40)
                        print("You can type a command at the You: prompt.\n")

        stop_event.wait(5)


def chat_with_nora(user_text, messages):
    data = get_data()
    context = json.dumps(data, ensure_ascii=False, indent=2)

    current_messages = messages + [
        {
            "role": "system",
            "content": (
                "Here is the current saved routine and schedule data. "
                "Use it only when relevant. Do not assume a task is "
                "scheduled today unless its day and time support that. "
                "Do not claim a reminder was delivered unless the "
                "program confirms it.\n" + context
            )
        },
        {"role": "user", "content": user_text}
    ]

    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=current_messages
        )

        answer = response["message"]["content"].strip()
        print("\nNORA:", answer, "\n")

        messages.append({"role": "user", "content": user_text})
        messages.append({"role": "assistant", "content": answer})

    except Exception as error:
        print("\nNORA could not contact Gemma.")
        print("Check that Ollama is running.")
        print("Details:", error, "\n")


def main():
    if not load_schedule(force=True):
        print("Please fix routines.json before starting NORA.")
        return

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    print("\n" + "=" * 44)
    print("NORA - Your Daily-Life Companion")
    print("=" * 44)
    print("Schedule monitoring is active while this program runs.")
    print("\nCommands:")
    print("  routine              - View saved morning routines")
    print("  items for dressing   - List dressing items")
    print("  guide dressing       - Follow dressing steps")
    print("  schedule             - View scheduled commitments")
    print("  reload               - Check for file updates now")
    print("  exit                 - Close NORA")
    print("\nYou can also talk to NORA normally.\n")

    worker = threading.Thread(target=reminder_worker, daemon=True)
    worker.start()

    try:
        while True:
            try:
                user_text = input("You: ").strip()
            except (KeyboardInterrupt, EOFError):
                break

            if not user_text:
                continue

            command = user_text.lower()

            if command == "exit":
                break
            elif command == "routine":
                show_routines()
            elif command == "items for dressing":
                show_dressing_items()
            elif command == "guide dressing":
                guide_dressing()
            elif command == "schedule":
                show_schedule()
            elif command == "reload":
                if load_schedule(force=True):
                    print("NORA: I checked the schedule file.\n")
                else:
                    print("NORA: I couldn't reload the file. Check its format.\n")
            else:
                chat_with_nora(user_text, messages)

    finally:
        stop_event.set()
        worker.join(timeout=2)
        print("\nNORA: Goodbye. Take care!")


if __name__ == "__main__":
    main()
