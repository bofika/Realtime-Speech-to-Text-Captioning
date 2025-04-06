export interface CaptionConfig {
  lines: number;
  position: 'top' | 'middle' | 'bottom';
  fontSize: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  language: string;
  useUppercase: boolean;
  audioDeviceId: string;
  lineSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  padding: {
    top: number;
    bottom: number;
  };
  debugMode: boolean;
}

export interface TranscriptLine {
  id: string;
  text: string;
  isInterim: boolean;
  timestamp: number;
}

export interface StoredTranscriptLine {
  text: string;
  timestamp: number;
}