export function getTimeoutMs(phraseLength: number, wpm: number): number {
  const avgWordLength = 5.6;
  const lettersPerSecond = (wpm * avgWordLength) / 60;
  return (phraseLength / lettersPerSecond) * 1000;
}

export function getAverageTimeoutMs(
  textLength: number,
  numberOfPhrases: number,
  wpm: number
): number {
  const avgWordLength = 5.6;
  const numberOfWords = textLength / avgWordLength;
  const timeToReadSec = (numberOfWords / wpm) * 60;
  return (timeToReadSec / numberOfPhrases) * 1000;
}

export function calculateSpeed(
  startTime: number,
  wordPhrases: string[]
): number {
  const totalCharacters: number = wordPhrases.reduce(
    (total, currentWord) => total + currentWord.length,
    0
  );
  const elapsedTimeMin = (Date.now() - startTime) / (1000 * 60);
  return Math.floor(totalCharacters / 5.5 / elapsedTimeMin);
}
