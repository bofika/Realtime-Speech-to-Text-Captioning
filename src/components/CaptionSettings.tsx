import React from 'react';
import type { CaptionConfig } from '../types';

const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana'
];

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'hu-HU', name: 'Hungarian' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' }
];

interface CaptionSettingsProps {
  config: CaptionConfig;
  onConfigChange: (config: CaptionConfig) => void;
  audioDevices: Array<{ deviceId: string; label: string; }>;
}

export function CaptionSettings({ config, onConfigChange, audioDevices }: CaptionSettingsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('padding.')) {
      const key = name.split('.')[1] as keyof typeof config.padding;
      onConfigChange({
        ...config,
        padding: {
          ...config.padding,
          [key]: parseFloat(value)
        }
      });
    } else {
      onConfigChange({
        ...config,
        [name]: type === 'range' ? parseFloat(value) : 
                type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                type === 'number' ? parseInt(value, 10) : value
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="audioDeviceId" className="block text-sm font-medium text-gray-700">
            Audio Input Device
          </label>
          <select
            id="audioDeviceId"
            name="audioDeviceId"
            value={config.audioDeviceId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Default Microphone</option>
            {audioDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={config.language}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="lines" className="block text-sm font-medium text-gray-700">
            Number of Caption Lines (1-12)
          </label>
          <input
            type="number"
            id="lines"
            name="lines"
            min="1"
            max="12"
            value={config.lines}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Caption Position
          </label>
          <select
            id="position"
            name="position"
            value={config.position}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        <div>
          <label htmlFor="textAlign" className="block text-sm font-medium text-gray-700">
            Text Alignment
          </label>
          <select
            id="textAlign"
            name="textAlign"
            value={config.textAlign}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div>
          <label htmlFor="padding.top" className="block text-sm font-medium text-gray-700">
            Top Padding (in line heights)
          </label>
          <input
            type="range"
            id="padding.top"
            name="padding.top"
            min="0"
            max="2"
            step="0.1"
            value={config.padding.top}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
          <div className="mt-1 text-sm text-gray-500">
            {config.padding.top.toFixed(1)}x
          </div>
        </div>

        <div>
          <label htmlFor="padding.bottom" className="block text-sm font-medium text-gray-700">
            Bottom Padding (in line heights)
          </label>
          <input
            type="range"
            id="padding.bottom"
            name="padding.bottom"
            min="0"
            max="2"
            step="0.1"
            value={config.padding.bottom}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
          <div className="mt-1 text-sm text-gray-500">
            {config.padding.bottom.toFixed(1)}x
          </div>
        </div>

        <div>
          <label htmlFor="lineSpacing" className="block text-sm font-medium text-gray-700">
            Line Spacing
          </label>
          <input
            type="range"
            id="lineSpacing"
            name="lineSpacing"
            min="1"
            max="3"
            step="0.1"
            value={config.lineSpacing}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
          <div className="mt-1 text-sm text-gray-500">
            {config.lineSpacing.toFixed(1)}x
          </div>
        </div>

        <div>
          <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700">
            Font Family
          </label>
          <select
            id="fontFamily"
            name="fontFamily"
            value={config.fontFamily}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {FONT_FAMILIES.map(font => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useUppercase"
              name="useUppercase"
              checked={config.useUppercase}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="useUppercase" className="ml-2 block text-sm text-gray-700">
              ALL CAPS
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="debugMode"
              name="debugMode"
              checked={config.debugMode}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="debugMode" className="ml-2 block text-sm text-gray-700">
              Debug Mode
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
            Font Size
          </label>
          <input
            type="text"
            id="fontSize"
            name="fontSize"
            value={config.fontSize}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">
            Text Color
          </label>
          <input
            type="color"
            id="textColor"
            name="textColor"
            value={config.textColor}
            onChange={handleChange}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <input
            type="color"
            id="backgroundColor"
            name="backgroundColor"
            value={config.backgroundColor}
            onChange={handleChange}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="backgroundOpacity" className="block text-sm font-medium text-gray-700">
            Background Opacity
          </label>
          <input
            type="range"
            id="backgroundOpacity"
            name="backgroundOpacity"
            min="0"
            max="1"
            step="0.1"
            value={config.backgroundOpacity}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
        </div>
      </div>
    </div>
  );
}