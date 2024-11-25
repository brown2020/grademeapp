// types/dictionary-en-us.d.ts
declare module 'dictionary-en-us' {
  type DictionaryCallback = (
    error: Error | null,
    result: { aff: string; dic: string }
  ) => void

  function loadDictionary(callback: DictionaryCallback): void

  export default loadDictionary
}
