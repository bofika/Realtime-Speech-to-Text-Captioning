# Real-time Caption Display

A web-based real-time captioning application that provides live speech-to-text transcription with customizable display options.

## Features

- Real-time speech-to-text captioning with word-by-word display
- Multiple language support
- Customizable caption display:
  - Font size and family
  - Text and background colors
  - Background opacity
  - Caption positioning (top, middle, bottom)
  - Text alignment (left, center, right)
  - Number of visible lines (1-12)
  - Line spacing control
  - Top and bottom padding adjustment
  - ALL CAPS display option
- Auto-hiding control buttons
- Save full transcript as text file
- Keyboard accessible
- Screen reader friendly
- Debug mode for visual testing

## System Requirements

### Recommended Browsers
- Google Chrome (preferred)
- Microsoft Edge
- Other Chromium-based browsers

### Operating Systems
- Windows
- macOS
- Linux
- Chrome OS

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Configure caption settings:
   - Choose your language
   - Select audio input device
   - Set display preferences:
     - Position (top, middle, bottom)
     - Text alignment
     - Font and colors
     - Number of caption lines
     - Line spacing
     - Padding
   - Toggle ALL CAPS if desired

2. Click "Start Captioning"
3. Allow microphone access when prompted
4. Begin speaking to see real-time captions
5. Move your mouse to reveal control buttons:
   - Save button (green) to download the full transcript
   - Close button (red) to stop captioning and return to settings
6. Control buttons automatically hide after 2 seconds of mouse inactivity

## Accessibility Features

- Keyboard navigation support
- ARIA live regions for screen readers
- High contrast color options
- Customizable font sizes
- Adjustable text alignment
- Clear, semantic HTML structure
- Auto-hiding controls for cleaner display

## Known Limitations

- Speech recognition requires an internet connection
- Best performance in Chrome-based browsers
- Language support varies by browser
- Recognition accuracy depends on:
  - Microphone quality
  - Background noise
  - Speaker clarity
  - Chosen language

## Credits

This application uses:
- Web Speech API for speech recognition
- React for the user interface
- Tailwind CSS for styling
- Lucide React for icons