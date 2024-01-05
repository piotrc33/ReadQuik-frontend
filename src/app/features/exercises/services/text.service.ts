import { Injectable } from '@angular/core';
import { SegmentI } from '../../../api/model/segment.i';

@Injectable()
export class TextService {
  getFragmentsWithNewlines(text: string): string[] {
    let fragments: string[] = [];
    let piped: string = text.replace(/[,.?!;…]+/g, '$&|');
    piped = piped.replace(/\S+$/gm, '$&|'); // adding pipe at the end
    piped = piped.replace(/(?<!^)(?<=[,.?!;…]\s+)—/gm, '$&|');
    fragments = this.splitByNewlines(piped);
    fragments = this.splitByPipes(fragments);
    fragments = this.splitLongFragments(fragments);

    return fragments;
  }

  splitByNewlines(text: string): string[] {
    return text.split(/(\n)/);
  }

  splitByPipes(fragments: string[]): string[] {
    let result: string[] = [];
    fragments.forEach((frag) => {
      const split = frag.split(/\|+/);
      result = result.concat(split);
    });

    result = result.filter((el) => el !== '');
    return result;
  }

  splitLongFragments(fragments: string[]): string[] {
    let result: string[] = [];
    fragments.forEach((frag) => {
      const split = this.splitTextByNWords(frag, 4);
      result = result.concat(split);
    });
    return result;
  }

  splitTextByNWords(text: string, n: number): string[] {
    const words = text.split(/[^\S\r\n]/);
    const groups = [];

    for (let i = 0; i < words.length; i += n) {
      const group = words.slice(i, i + n).join(' ');
      groups.push(group);
    }

    return groups;
  }

  splitTextIntoSegments(text: string): SegmentI[] {
    const words = text.match(/(\n+|\S+[^\S\r\n]*)/g);
    const segments: SegmentI[] = [];
    let segText: string[] = [];
    let segNumber: number = 1;
    const wps = 200; // words per segment

    if (!words) {
      return [];
    }

    for (let i = 0; i < words.length; i++) {
      segText.push(words[i]);
      if (
        segText.length >= wps &&
        this.isNewline(segText[segText.length - 1])
      ) {
        segments.push({
          number: segNumber,
          text: segText.join(''),
        });
        segText = [];
        segNumber++;
      }
    }

    return segments;
  }

  isNewline(phrase: string): boolean {
    return /^\n+/.test(phrase);
  }

  removeNewlines(fragments: string[]): string[] {
    return fragments.filter((frag) => !this.isNewline(frag));
  }
}
