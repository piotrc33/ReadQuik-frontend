import { TextUtils } from './text.utils';

describe('TextUtils', () => {
  describe('isNewline', () => {
    it('should return true for newline character', () => {
      const input = '\n';
      const result = TextUtils.isNewline(input);
      expect(result).toBeTruthy();
    });

    it('should return true for more than one newline character', () => {
      const input = '\n\n\n';
      const result = TextUtils.isNewline(input);
      expect(result).toBeTruthy();
    });

    it('should return false for a word', () => {
      const input = 'word';
      const result = TextUtils.isNewline(input);
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const input = '';
      const result = TextUtils.isNewline(input);
      expect(result).toBe(false);
    });
  });

  describe('removeNewlines', () => {
    it('should remove newline characters from array of words', () => {
      const input = ['Hey', '\n', 'this', 'is', '\n\n', 'sample'];
      const expected = ['Hey', 'this', 'is', 'sample'];
      const result = TextUtils.removeNewlines(input);
      expect(result).toEqual(expected);
    });

    it('should return empty array for empty array input', () => {
      const input: string[] = [];
      const result = TextUtils.removeNewlines(input);
      expect(result).toEqual(input);
    });
  });

  describe('splitTextIntoSegments', () => {
    const text = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel aliquet neque, id interdum dolor. Sed sed tortor et libero pharetra efficitur quis nec ex. Etiam luctus ipsum massa, et lobortis urna euismod ac. Duis quis aliquet leo, ac ultrices ipsum. Integer sed aliquam risus. Sed sollicitudin posuere nibh eget facilisis. Sed commodo ut nulla a viverra. Praesent feugiat pretium quam.

Etiam ac sagittis tellus. Quisque imperdiet dui bibendum urna mollis tristique. Aenean fringilla rutrum sapien et suscipit. Donec nec fermentum magna. Curabitur suscipit gravida ipsum sed suscipit. Morbi consequat mi eu imperdiet luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas blandit nulla sed dui pharetra, et finibus massa sodales. Morbi molestie in sem sed hendrerit. Donec vitae viverra mauris. Nulla feugiat dictum lacus, nec congue justo suscipit ac. Mauris ac risus elementum augue luctus cursus. Aenean mattis consectetur hendrerit.

Suspendisse sodales eros eros, nec laoreet tellus tincidunt id. Sed et ex non velit faucibus condimentum. Praesent egestas at elit eu pellentesque. Nulla facilisi. Ut consectetur aliquam velit, porttitor accumsan mauris molestie at. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed at elementum diam. Proin tortor turpis, luctus dictum bibendum id, blandit id tortor. Donec non iaculis ante, vel varius quam. Mauris at rhoncus lacus, in aliquam lorem. Phasellus at iaculis sem.

Cras nisi justo, faucibus in nibh in, placerat ornare urna. Vestibulum feugiat eu justo sed tincidunt. Maecenas et ex porta, scelerisque turpis rutrum, rutrum enim. Vivamus sagittis laoreet elit sed mattis. Etiam viverra convallis odio, vel fringilla lacus. Cras quis orci vitae neque faucibus porttitor vehicula ut libero. Aenean blandit quis ex at convallis.

Maecenas vitae nibh in ipsum`;

    it('should create 5 segments for 5 paragraphs and small segment length (20)', () => {
      const result = TextUtils.splitTextIntoSegments(text, 20);
      expect(result.length).toEqual(5);
    });

    it('should return first segment with segment number equal to one', () => {
      const result = TextUtils.splitTextIntoSegments(text, 20);
      expect(result[0].number).toEqual(1);
    });
  });

  describe('getFragmentsWithNewlines', () => {
    const paragraphs = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vel aliquet neque, id interdum dolor. Sed sed tortor et libero pharetra efficitur quis nec ex. Etiam luctus ipsum massa, et lobortis urna euismod ac. Duis quis aliquet leo, ac ultrices ipsum. Integer sed aliquam risus. Sed sollicitudin posuere nibh eget facilisis. Sed commodo ut nulla a viverra. Praesent feugiat pretium quam.

Etiam ac sagittis tellus. Quisque imperdiet dui bibendum urna mollis tristique. Aenean fringilla rutrum sapien et suscipit. Donec nec fermentum magna. Curabitur suscipit gravida ipsum sed suscipit. Morbi consequat mi eu imperdiet luctus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames`;

    const maxWordsInFragment = 4;
    it('should contain newline characters - for this scenario 3 of them', () => {
      const result = TextUtils.getFragmentsWithNewlines(
        paragraphs,
        maxWordsInFragment
      );
      const newlineCount = result.filter(fragment =>
        TextUtils.isNewline(fragment)
      ).length;
      expect(newlineCount).toEqual(3);
    });

    it('none of the phrases should be longer than maxWordsInFragment variable', () => {
      const result = TextUtils.getFragmentsWithNewlines(
        paragraphs,
        maxWordsInFragment
      );
      const tooLongPhrasesCount = result.filter(fragment => {
        const words = fragment.trim().split(/\s+/);
        return words.length > maxWordsInFragment
      }).length;
      expect(tooLongPhrasesCount).toEqual(0);
    });
  });
});
