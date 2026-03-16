import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SummarizerService {

  summarize(text: string, sentenceCount: number = 4): string {
    if (!text || text.trim().length === 0) return '';

    // 1. Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length <= sentenceCount) return text;

    // 2. Build word frequency map (ignore stop words)
    const stopWords = new Set([
      'a','an','the','and','or','but','in','on','at','to','for','of','with',
      'by','from','is','are','was','were','be','been','has','have','had',
      'it','its','this','that','these','those','i','we','you','he','she',
      'they','as','if','so','do','did','not','no','nor','yet','both','also'
    ]);

    const wordFrequency: Record<string, number> = {};
    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 2) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // 3. Score each sentence based on word frequency
    const sentenceScores = sentences.map(sentence => {
      const sentWords = sentence.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
      let score = 0;
      sentWords.forEach(word => {
        if (wordFrequency[word]) score += wordFrequency[word];
      });
      // Normalize by sentence length to avoid bias toward long sentences
      return { sentence: sentence.trim(), score: score / Math.max(sentWords.length, 1) };
    });

    // 4. Pick top N sentences by score, preserve original order
    const topSentences = [...sentenceScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, sentenceCount)
      .map(s => s.sentence);

    // 5. Return in original document order
    return sentences
      .filter(s => topSentences.includes(s.trim()))
      .join(' ')
      .trim();
  }
}
