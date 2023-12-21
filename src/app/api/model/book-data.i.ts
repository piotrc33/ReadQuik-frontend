export interface BookDataI {
  _id: string,
  title: string,
  author: string,
  coverUrl: string,
  language: 'Polish' | 'English',
  totalSegments: number,
  tags: string[]
}