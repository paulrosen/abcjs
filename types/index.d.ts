declare module 'abcjs' {
  export function renderAbc(target: string|HTMLElement, code: string, params: { [key: string]: string | number | { [key:string]: string | number } })
  // ToDo: finish types
}
