import { Injectable } from '@angular/core';

@Injectable()
export class TextService {
  // bookFragments: string[] = [
  //   'Miriamowi',
  //   '(Zenonowi Przesmyckiemu)',
  //   'I',
  //   '\n— Niech będzie pochwalony',
  //   'Jezus Chrystus!',
  //   '\n— Na wieki wieków,',
  //   '—moja Agato,',
  //   'a dokąd to wędrujecie, co?',
  // ];

  private bookFragments: string[];

  getBookFragments(): string[] {
    return this.bookFragments;
  }

  private wordFragments: string[];

  getWordFragments(): string[] {
    return this.wordFragments;
  }

  bookTextPiped: string = `Władysław Stanisław Reymont|

Chłopi|
Część pierwsza —| Jesień|

ISBN 978-83-288-2723-3|




Miriamowi|
(Zenonowi Przesmyckiemu)|



I|

— Niech będzie pochwalony| Jezus Chrystus!|

— Na wieki wieków,| moja Agato,| a dokąd to wędrujecie, co?|

— We świat,| do ludzi,| dobrodzieju kochany —| w tyli świat!… —| zakreśliła kijaszkiem| łuk od wschodu do zachodu.|

Ksiądz spojrzał bezwiednie| w tę dal i rychło przywarł oczy,| bo nad zachodem wisiało| oślepiające słońce;| a potem spytał ciszej,| lękliwiej jakby…|

— Wypędzili was Kłębowie,| co?| A może to ino niezgoda?…| może…`;

  bookText: string = `Władysław Stanisław Reymont

Chłopi
Część pierwsza — Jesień

ISBN 978-83-288-2723-3




Miriamowi
(Zenonowi Przesmyckiemu)



I

— Niech będzie pochwalony Jezus Chrystus!

— Na wieki wieków, moja Agato, a dokąd to wędrujecie, co?

— We świat, do ludzi, dobrodzieju kochany — w tyli świat!… — zakreśliła kijaszkiem łuk od wschodu do zachodu.

Ksiądz spojrzał bezwiednie w tę dal i rychło przywarł oczy, bo nad zachodem wisiało oślepiające słońce; a potem spytał ciszej, lękliwiej jakby…

— Wypędzili was Kłębowie, co? A może to ino niezgoda?… może…`;

  constructor() {
    this.bookFragments = this.splitByNewlines(this.bookText);
    this.wordFragments = this.bookFragments.filter((frag) => !this.isNewline(frag));
  }

  splitTextByNWords(text: string, n: number) {
    const words = text.split(/\s+/);
    const groups = [];

    for (let i = 0; i < words.length; i += 3) {
      const group = words.slice(i, i + n).join(' ');
      groups.push(group);
    }

    return groups;
  }

  splitByNewlines(text: string): string[] {
    return text.split(/(\n+)/);
  }

  isNewline(phrase: string): boolean {
    return /^\n+/.test(phrase);
  }
}
