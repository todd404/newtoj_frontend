import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'

interface langExt {
  [key: string]: any
}

export const LanguageExtensions: langExt = {
  cpp: cpp,
  java: java
}
