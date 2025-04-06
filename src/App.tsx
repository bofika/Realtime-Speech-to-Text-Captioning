import React, { useState, useRef, useEffect } from 'react';
import { Settings, Mic, Save, X } from 'lucide-react';
import { CaptionSettings } from './components/CaptionSettings';
import { CaptionOverlay } from './components/CaptionOverlay';
import { TranscriptManager } from './utils/TranscriptManager';
import { useWebSpeech } from './hooks/useWebSpeech';
import type { CaptionConfig } from './types';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<number>();
  const [config, setConfig] = useState<CaptionConfig>({
    lines: 2,
    position: 'bottom',
    fontSize: '24px',
    fontFamily: 'Arial',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    backgroundOpacity: 0.8,
    language: 'en-US',
    useUppercase: false,
    audioDeviceId: '',
    lineSpacing: 1.5,
    textAlign: 'left',
    padding: {
      top: 0.5,
      bottom: 0.5
    },
    debugMode: false
  });

  const { transcript, words, isInterim, resetTranscript, startListening, stopListening, browserSupportsSpeechRecognition, audioDevices } = useWebSpeech(config.language, config.audioDeviceId);
  const transcriptManager = useRef(new TranscriptManager());

  useEffect(() => {
    transcriptManager.current.setMaxLines(config.lines);
  }, [config.lines]);

  useEffect(() => {
    if (transcript) {
      transcriptManager.current.addLine(transcript, isInterim, words);
    }
  }, [transcript, isInterim, words]);

  const handleStartCaptioning = () => {
    setIsListening(true);
    setShowSettings(false);
    transcriptManager.current.clear();
    startListening();
  };

  const handleStopCaptioning = () => {
    setIsListening(false);
    setShowSettings(true);
    stopListening();
    resetTranscript();
  };

  const handleSaveTranscript = () => {
    const text = transcriptManager.current.getFullTranscript();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600">
            Your browser doesn't support speech recognition.
            Please use a modern browser like Chrome.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: !showSettings ? config.backgroundColor : '#f3f4f6'
      }}
      onMouseMove={!showSettings ? handleMouseMove : undefined}
    >
      {showSettings ? (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Caption Settings
            </h1>
            
            <CaptionSettings
              config={config}
              onConfigChange={setConfig}
              audioDevices={audioDevices}
            />

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleStartCaptioning}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Mic className="w-5 h-5" />
                Start Captioning
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <CaptionOverlay
            config={config}
            transcript={transcriptManager.current.getVisibleLines()}
          />
          
          <div 
            className={`fixed top-4 right-4 flex gap-2 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={handleSaveTranscript}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              title="Save Transcript"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={handleStopCaptioning}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Stop Captioning"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;