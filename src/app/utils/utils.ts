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
  const avgWordLength = 5.5;
  const numberOfWords = textLength / avgWordLength;
  const timeToReadSec = (numberOfWords / wpm) * 60;
  return Math.floor((timeToReadSec / numberOfPhrases) * 1000);
}

export function calculateSpeed(
  elapsedTime: number,
  totalCharactersNumber: number
): number {
  const elapsedTimeMin = elapsedTime / (1000 * 60);
  return Math.floor(totalCharactersNumber / 5.5 / elapsedTimeMin);
}
