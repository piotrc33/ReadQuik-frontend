import { SegmentI } from '../api/model/book/segment.i';

export class TextUtils {
  static getFragmentsWithNewlines(text: string, maxWordsInFragment: number): string[] {
    let fragments: string[] = [];
    let piped: string = text.replace(/[,.?!;…]+/g, '$&|');
    piped = piped.replace(/\S+$/gm, '$&|'); // adding pipe at the end
    piped = piped.replace(/(?<!^)(?<=[,.?!;…]\s+)—/gm, '$&|');
    fragments = this.#splitByNewlines(piped);
    fragments = this.#splitByPipes(fragments);
    fragments = this.#splitLongFragments(fragments, maxWordsInFragment);

    return fragments;
  }

  static splitTextIntoSegments(
    text: string,
    wordsPerSegment: number = 200
  ): SegmentI[] {
    const endOfTextString = 'END&&';
    const words = text.match(/(\n+|\S+[^\S\r\n]*)/g);
    if (!words) {
      return [];
    }
    words.push(endOfTextString);
    const segments: SegmentI[] = [];
    let segText: string[] = [];
    let segNumber: number = 1;

    words.forEach(word => {
      segText.push(word);
      if (
        (segText.length >= wordsPerSegment && this.isNewline(word)) ||
        word === endOfTextString
      ) {
        segments.push({
          number: segNumber,
          text: segText.join(''),
        });
        segText = [];
        segNumber++;
      }
    });

    return segments;
  }

  static isNewline(phrase: string): boolean {
    return /^\n+/.test(phrase);
  }

  static removeNewlines(fragments: string[]): string[] {
    return fragments.filter(frag => !this.isNewline(frag));
  }

  static #splitByNewlines(text: string): string[] {
    return text.split(/(\n)/);
  }

  static #splitByPipes(fragments: string[]): string[] {
    let result: string[] = [];
    fragments.forEach(frag => {
      const split = frag.split(/\|+/);
      result = result.concat(split);
    });

    result = result.filter(el => el !== '');
    return result;
  }

  static #splitLongFragments(fragments: string[], maxWordsInFragment: number): string[] {
    let result: string[] = [];
    fragments.forEach(frag => {
      const split = this.#splitTextByNWords(frag, maxWordsInFragment);
      result = result.concat(split);
    });
    return result;
  }

  static #splitTextByNWords(text: string, n: number): string[] {
    const words = text.split(/[^\S\r\n]/);
    const groups = [];

    for (let i = 0; i < words.length; i += n) {
      const group = words.slice(i, i + n).join(' ');
      groups.push(group);
    }

    return groups;
  }
}
