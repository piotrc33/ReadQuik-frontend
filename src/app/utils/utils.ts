export function getTimeoutMs(phraseLength: number, wpm: number): number {
  const avgWordLenght = 5.6;
  const lettersPerSecond = (wpm * avgWordLenght) / 60;
  return (phraseLength / lettersPerSecond) * 1000;
}
