# Realtime Speech-to-Text Captioning v1.0

This application provides real-time, word-by-word speech-to-text captioning directly in the browser using the Web Speech API.

## ✨ Features

- ✅ Live word-by-word transcription with immediate display
- ✅ Interim and final result handling
- ✅ Customizable display settings:
  - Font family, size, and color
  - Background color
  - Line spacing (1.0x – 6.0x)
  - Text alignment (left, center, right)
  - Caption position (top, middle, bottom)
  - Max number of visible lines
- ✅ Audio input device selection
- ✅ Save full transcript to `.txt`
- ✅ Works in Chrome and Edge browsers

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed (v16 or later recommended)
- Modern browser: **Google Chrome** or **Microsoft Edge**
- Internet connection (for Web Speech API)
- Microphone access

### Installation

1. Extract the project ZIP file
2. Open a terminal in the project directory
3. Run the following commands:

```bash
npm install
npm run dev
```

Open the provided localhost link in your browser (e.g. http://localhost:5173)

📝 Usage
Configure your desired caption settings

Click Start Captioning

Speak — captions will appear in real time

Use Save Transcript to export the full spoken content

📁 Transcript
The saved transcript file includes all final recognized text, preserving the full spoken content from your session.

📌 Notes
Captions appear immediately as speech is recognized

Interim results are replaced by final results when available

The visible caption area strictly respects the configured line count

Text alignment, spacing, and position are applied in real-time

Developed with ❤️ using the Web Speech API.
