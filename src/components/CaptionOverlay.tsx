import React from 'react';
import type { CaptionConfig } from '../types';
import type { TranscriptLine } from '../types';

interface CaptionOverlayProps {
  config: CaptionConfig;
  transcript: TranscriptLine[];
}

export function CaptionOverlay({ config, transcript }: CaptionOverlayProps) {
  // Calculate line height based on font size
  const baseLineHeight = parseInt(config.fontSize);
  const lineHeight = Math.ceil(baseLineHeight * config.lineSpacing);
  
  // Calculate total padding (top + bottom)
  const totalPadding = (config.padding.top + config.padding.bottom) * baseLineHeight;
  
  // Calculate container height including padding
  const containerHeight = (lineHeight * config.lines) + totalPadding;

  // Ensure we don't show more lines than configured
  const visibleTranscript = transcript.slice(-config.lines);

  // Position-specific styles
  const getPositionStyles = () => {
    const base = {
      position: 'fixed',
      left: 0,
      right: 0,
      width: '100%',
      height: `${containerHeight}px`,
      backgroundColor: `${config.backgroundColor}${Math.round(config.backgroundOpacity * 255).toString(16).padStart(2, '0')}`,
      transition: 'transform 0.3s ease-out, height 0.3s ease-out'
    } as const;

    switch (config.position) {
      case 'top':
        return { ...base, top: 0 };
      case 'middle':
        return {
          ...base,
          top: '50%',
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return { ...base, bottom: 0 };
      default:
        return base;
    }
  };

  return (
    <div
      style={getPositionStyles()}
      className={config.debugMode ? 'outline outline-2 outline-red-500' : ''}
    >
      <div 
        className="container mx-auto"
        role="region" 
        aria-live="polite"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: config.position === 'bottom' ? 'flex-end' : 
                         config.position === 'middle' ? 'center' : 'flex-start',
          paddingTop: `${config.padding.top * baseLineHeight}px`,
          paddingBottom: `${config.padding.bottom * baseLineHeight}px`,
          paddingLeft: '1rem',
          paddingRight: '1rem',
          overflow: 'hidden'
        }}
      >
        {visibleTranscript.map((line, index) => (
          <div 
            key={line.id}
            style={{ 
              color: config.textColor,
              fontFamily: config.fontFamily,
              fontSize: config.fontSize,
              opacity: line.isInterim ? 0.7 : 1,
              height: `${lineHeight}px`,
              lineHeight: `${lineHeight}px`,
              marginBottom: index < visibleTranscript.length - 1 ? `${(config.lineSpacing - 1) * baseLineHeight}px` : 0,
              transition: 'all 0.2s ease-out',
              whiteSpace: 'pre-wrap',
              textAlign: config.textAlign,
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            className={config.debugMode ? 'outline outline-1 outline-blue-500' : ''}
          >
            {config.useUppercase ? line.text.toUpperCase() : line.text}
          </div>
        ))}
      </div>
    </div>
  );
}