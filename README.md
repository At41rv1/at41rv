# At41rv Chat - Frontend-Only AI Chat Interface

A modern, ChatGPT-style chat interface that connects directly to the TypeGPT API without requiring any backend services.

## Features

- **Direct API Integration**: Connects directly to TypeGPT API from the browser
- **Streaming Responses**: Real-time text generation as the AI responds
- **Multiple AI Models**: Support for 8 different AI models:
  - GPT-4 (default)
  - GPT-4o Extended
  - GPT-4.5 Preview
  - O3
  - O3 Pro
  - Gemini 2.5 Pro
  - Gemini 2.5 Flash
  - Claude Sonnet 4
- **Modern UI**: Clean, centered layout inspired by ChatGPT
- **Dark Theme**: Matches the portfolio aesthetic
- **Local Storage**: Chat history persists between sessions
- **Responsive Design**: Works on desktop and mobile devices

## Usage

1. Simply open `chat.html` in your web browser
2. Start typing your message
3. Press Enter or click Send
4. Switch models by clicking the model badge in the header

## Features

- **Copy**: Copy any AI response to clipboard
- **Regenerate**: Re-run the last message with the AI
- **New Chat**: Start a fresh conversation
- **Model Selection**: Choose from 8 different AI models
- **Auto-save**: Conversations are saved locally

## Technical Details

- **Frontend Only**: No backend server required
- **API**: TypeGPT API (https://fast.typegpt.net)
- **Storage**: Browser localStorage for persistence
- **Streaming**: Server-Sent Events (SSE) for real-time responses

## File Structure

```
web/portfolio-lite/
├── chat.html          # Main chat interface (standalone)
├── index.html         # Portfolio homepage
├── script.js          # Portfolio scripts
└── README.md          # This file
```

## Notes

- The API key is embedded in the frontend code for simplicity
- For production use, consider implementing a backend proxy for security
- Chat history is stored locally in the browser