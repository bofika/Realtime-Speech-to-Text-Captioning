import type { TranscriptLine, StoredTranscriptLine } from '../types';

export class TranscriptManager {
  private lines: TranscriptLine[] = [];
  private maxLines: number = 1;
  private currentLineWords: string[] = [];
  private lastInterimUpdate: number = 0;
  private storedLines: StoredTranscriptLine[] = [];

  addLine(text: string, isInterim: boolean, words: string[] = []) {
    const now = Date.now();
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    // Store final results for transcript
    if (!isInterim) {
      this.storedLines.push({
        text: trimmedText,
        timestamp: now
      });
    }

    // If this is a new interim result, update the current line words
    if (isInterim) {
      this.currentLineWords = words;
    } else {
      // For final results, append to current line words
      this.currentLineWords = [...this.currentLineWords, ...words];
    }

    // Create lines based on word count (e.g., ~10-12 words per line)
    const wordsPerLine = 10;
    const newLines: TranscriptLine[] = [];
    
    for (let i = 0; i < this.currentLineWords.length; i += wordsPerLine) {
      const lineWords = this.currentLineWords.slice(i, i + wordsPerLine);
      const lineText = lineWords.join(' ');
      
      newLines.push({
        id: `${isInterim ? 'interim' : 'final'}-${now}-${i}`,
        text: lineText,
        isInterim,
        timestamp: now
      });
    }

    // Update the lines array
    if (isInterim) {
      // Replace any existing interim lines
      const finalLines = this.lines.filter(line => !line.isInterim);
      this.lines = [...finalLines, ...newLines];
    } else {
      // For final results, append new lines
      this.lines = [...this.lines.filter(line => !line.isInterim), ...newLines];
    }

    // Enforce line limit for display
    while (this.lines.length > this.maxLines) {
      const oldestLine = this.lines.shift();
      if (oldestLine) {
        // Remove words from currentLineWords based on the removed line
        const wordCount = oldestLine.text.split(/\s+/).length;
        this.currentLineWords.splice(0, wordCount);
      }
    }

    this.lastInterimUpdate = now;
  }

  setMaxLines(count: number) {
    this.maxLines = Math.max(1, Math.min(12, count));
    // Enforce the new line limit
    while (this.lines.length > this.maxLines) {
      this.lines.shift();
    }
  }

  getVisibleLines(): TranscriptLine[] {
    return [...this.lines];
  }

  getFullTranscript(): string {
    return this.storedLines
      .map(line => line.text)
      .join('\n');
  }

  clear(): void {
    this.lines = [];
    this.currentLineWords = [];
    this.storedLines = [];
    this.lastInterimUpdate = 0;
  }
}