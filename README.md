\# NORA — Offline AI Daily-Life Assistant



\## Project Overview

NORA is an offline AI assistant prototype designed to support people living with Alzheimer's disease and memory difficulties with everyday activities, routines, and daily commitments.



\## Problem Statement

Memory difficulties can make daily routines, remembering necessary items, and managing commitments challenging. These difficulties can affect independence, confidence, and quality of life.



\## Proposed Solution

NORA combines a locally running Gemma language model with Python-based routine and schedule management. It aims to provide calm, simple, step-by-step guidance and access to saved routine information.



\## Current Features

\- Local AI conversation using Gemma 3:1B through Ollama.

\- Locally stored routines using JSON.

\- Saved-item lookup for dressing.

\- Step-by-step dressing guidance with pauses.

\- Schedule display with times, days, and enabled status.

\- Local schedule-file update detection.

\- Scheduled reminder checks while the program is running.



\## Technology Stack

\- Python

\- Ollama

\- Gemma 3:1B

\- JSON local storage



\## How to Run

1\. Install Ollama.

2\. Download the Gemma model using `ollama run gemma3:1b`.

3\. Install the Python Ollama package.

4\. Open PowerShell in the project folder.

5\. Run `python gemma\_test.py`.



\## Future Development

\- Voice input and spoken responses.

\- Accessible mobile and desktop interface.

\- Secure caregiver authentication and synchronisation.

\- Persistent task tracking and operating-system notifications.

\- More extensive safety, accessibility, and usability testing.



\## Safety

NORA is an assistive prototype, not a cure or treatment for Alzheimer's disease. It does not replace caregivers or healthcare professionals.



