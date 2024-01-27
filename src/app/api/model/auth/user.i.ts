import { ReadingProgressI } from "../progress/reading-progress.i"

export interface UserI {
  email: string,
  username: string,
  password: string
  readingProgress?: ReadingProgressI[]
}