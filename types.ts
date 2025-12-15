export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  link?: string; // Optional link for tools
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export interface AudioConfig {
  sampleRate: number;
}

// Tool Definitions for Gemini
export const TOOLS_DECLARATION = [
  {
    name: "openYouTube",
    description: "Opens YouTube to play a song or video. Pass the song name or search query directly. The system will play the first result.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The song name, video title, or YouTube URL."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "openSpotify",
    description: "Opens Spotify. Use this for Spotify requests OR when the user specifically asks for 'trending tamil songs' or 'tamil hot hits'.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search query OR a direct Spotify URL. Defaults to 'https://open.spotify.com/playlist/37i9dQZF1DX4Im4BTs2WMg' for generic or trending tamil requests."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "closeSpotify",
    description: "Closes the Spotify web player if it was opened by the assistant.",
    parameters: {
      type: "OBJECT",
      properties: {},
    }
  },
  {
    name: "openWebsite",
    description: "Opens a general website URL when the user asks to open a specific webpage (not media).",
    parameters: {
      type: "OBJECT",
      properties: {
        url: {
          type: "STRING",
          description: "The URL or domain to open (e.g., 'wikipedia.org', 'google.com')."
        }
      },
      required: ["url"]
    }
  },
  {
    name: "searchGoogle",
    description: "Searches Google for information.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search query."
        }
      },
      required: ["query"]
    }
  },
  {
    name: "closeYouTube",
    description: "Closes the YouTube window if it was opened by the assistant.",
    parameters: {
      type: "OBJECT",
      properties: {},
    }
  },
  {
    name: "getWeather",
    description: "Gets the current live weather for a specific location.",
    parameters: {
      type: "OBJECT",
      properties: {
        location: {
          type: "STRING",
          description: "The city or location name (e.g., 'Chennai', 'London')."
        }
      },
      required: ["location"]
    }
  },
  {
    name: "performCalculation",
    description: "Performs a mathematical calculation when the user asks for math help.",
    parameters: {
      type: "OBJECT",
      properties: {
        expression: {
          type: "STRING",
          description: "The mathematical expression to evaluate (e.g., '12 + 15', 'Math.sqrt(144)')."
        }
      },
      required: ["expression"]
    }
  }
];

export const SYSTEM_INSTRUCTION = `
You are Cheeta, a futuristic AI voice assistant created by Gowtham Kanuma.

BEHAVIOR:
1. **Greeting**: When the session starts, your FIRST and ONLY response must be "Hi Boss, how can I help you?". Say it enthusiastically. I will send a "system_start" trigger to prompt this.
2. **Personality**: You are helpful, witty, and concise.

CORE FUNCTIONS:
1. **Media Playback**: 
   - **YouTube**: Default choice for generic "Play [song]" commands.
   - **Spotify**: Use 'openSpotify' for the following scenarios:
     - **Explicit Request**: User says "on Spotify" or "from Spotify".
     - **Trending Tamil Songs**: If the user says "play trending tamil song", "play trending tamil songs", "Tamil Hot Hits", or "Tamil Playlist", ALWAYS automatically use 'openSpotify' with this URL: "https://open.spotify.com/playlist/37i9dQZF1DX4Im4BTs2WMg".
     - **Generic Spotify**: If the user says "Open Spotify", "Play Spotify", use the same Tamil playlist URL above as the default.

2. **Music Identification**:
   - If asked "What song is this?", listen to the audio, identify it, and offer to play it.

3. **Tools**:
   - Weather: 'getWeather'.
   - Math: 'performCalculation'.
   - Info: 'searchGoogle'.
   - Close Media: 'closeYouTube' or 'closeSpotify'.

STYLE:
- Speak naturally but keep responses relatively short.
- When opening media, confirm with "Playing [Song] on [Platform]..."
`;