import { useState, useEffect, useCallback } from 'react';
import type { TranscriptLine } from '../types';

interface AudioDevice {
  deviceId: string;
  label: string;
}

interface SpeechResult {
  text: string;
  isInterim: boolean;
  words: string[];
}

export function useWebSpeech(language: string, audioDeviceId: string) {
  const [transcript, setTranscript] = useState<SpeechResult>({ text: '', isInterim: false, words: [] });
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);

  const browserSupportsSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  useEffect(() => {
    const loadAudioDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter(device => device.kind === 'audioinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`
          }));
        setAudioDevices(audioInputs);
      } catch (error) {
        console.error('[Speech Recognition] Error loading audio devices:', error);
      }
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(loadAudioDevices)
      .catch(error => console.error('[Speech Recognition] Error accessing microphone:', error));
  }, []);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      console.log('[Speech Recognition] Initializing with language:', language);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = language;

      if (audioDeviceId) {
        console.log('[Speech Recognition] Setting audio device:', audioDeviceId);
        const constraints = {
          audio: {
            deviceId: { exact: audioDeviceId }
          }
        };
        navigator.mediaDevices.getUserMedia(constraints)
          .catch(error => console.error('[Speech Recognition] Error setting audio device:', error));
      }

      recognition.onstart = () => {
        console.log('[Speech Recognition] Recognition started');
      };

      recognition.onresult = (event) => {
        console.log('[Speech Recognition] Result received:', {
          resultIndex: event.resultIndex,
          resultsLength: event.results.length
        });

        let finalText = '';
        let interimText = '';
        let words: string[] = [];

        // Process all results from the current session
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript.trim();
          
          if (result.isFinal) {
            finalText += (finalText ? ' ' : '') + transcript;
          } else {
            interimText += (interimText ? ' ' : '') + transcript;
          }
        }

        // Combine final and interim text
        const fullText = (finalText + (interimText ? ' ' + interimText : '')).trim();
        words = fullText.split(/\s+/);

        console.log('[Speech Recognition] Processing result:', {
          finalText,
          interimText,
          words,
          isInterim: !!interimText
        });

        setTranscript({
          text: fullText,
          isInterim: !!interimText,
          words
        });
      };

      recognition.onerror = (event) => {
        console.log('[Speech Recognition] Error event:', {
          error: event.error,
          message: event.message,
          isRecognitionActive
        });

        if (event.error === 'aborted') {
          console.log('[Speech Recognition] Aborted error - recognition was intentionally stopped');
          // Do nothing, the recognition was intentionally stopped
        } else {
          console.error('[Speech Recognition] Error occurred:', event.error);
          setIsRecognitionActive(false);
        }
      };

      recognition.onend = () => {
        console.log('[Speech Recognition] Recognition ended', {
          isRecognitionActive,
          currentTime: new Date().toISOString()
        });

        if (isRecognitionActive) {
          console.log('[Speech Recognition] Attempting to restart recognition');
          try {
            recognition.start();
            console.log('[Speech Recognition] Successfully restarted');
          } catch (error) {
            console.error('[Speech Recognition] Error restarting recognition:', error);
            setIsRecognitionActive(false);
          }
        }
      };

      setRecognition(recognition);
    }
  }, [language, audioDeviceId, isRecognitionActive]);

  const startListening = useCallback(() => {
    console.log('[Speech Recognition] Starting recognition', {
      hasRecognition: !!recognition,
      isActive: isRecognitionActive
    });

    if (recognition && !isRecognitionActive) {
      try {
        recognition.start();
        setIsRecognitionActive(true);
        console.log('[Speech Recognition] Recognition started successfully');
      } catch (error) {
        console.error('[Speech Recognition] Error starting recognition:', error);
        setIsRecognitionActive(false);
      }
    }
  }, [recognition, isRecognitionActive]);

  const stopListening = useCallback(() => {
    console.log('[Speech Recognition] Stopping recognition', {
      hasRecognition: !!recognition,
      isActive: isRecognitionActive
    });

    if (recognition && isRecognitionActive) {
      setIsRecognitionActive(false);
      try {
        recognition.stop();
        console.log('[Speech Recognition] Recognition stopped successfully');
      } catch (error) {
        console.error('[Speech Recognition] Error stopping recognition:', error);
      }
    }
  }, [recognition, isRecognitionActive]);

  const resetTranscript = useCallback(() => {
    console.log('[Speech Recognition] Resetting transcript');
    setTranscript({ text: '', isInterim: false, words: [] });
  }, []);

  return {
    transcript: transcript.text,
    words: transcript.words,
    isInterim: transcript.isInterim,
    resetTranscript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
    audioDevices,
    isRecognitionActive
  };
}