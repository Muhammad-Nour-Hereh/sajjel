// Build absolute URLs to match axios (baseURL + route)
const BASE_URL = import.meta.env.VITE_API_BASE_URL

// url methods has multiple overloads
export function url(path: string): string
export function url(path: (id: number) => string): string
export function url(
  path: (id1: number, id2: number) => string,
  placeholder1: string,
  placeholder2: string,
): string
export function url(
  path: (id1: number, id2: number, id3: number) => string,
  placeholder1: string,
  placeholder2: string,
  placeholder3: string,
): string
export function url(
  path: string | ((...ids: number[]) => string),
  ...placeholders: string[]
): string {
  // No args case
  if (typeof path === 'string') {
    return BASE_URL + path
  }

  const argCount = path.length

  // Generate unique dummy values to avoid conflicts
  const dummyArgs = Array.from({ length: argCount }, (_, i) => 999900 + i)
  let built = path(...dummyArgs)

  if (argCount === 1) {
    // Single arg case - replace the dummy value with :id
    built = built.replace(String(dummyArgs[0]), ':id')
  } else {
    // Multiple args case
    if (placeholders.length !== argCount) {
      throw new Error(
        `Expected ${argCount} placeholder names, got ${placeholders.length}`,
      )
    }

    // Replace each dummy value with its corresponding placeholder
    dummyArgs.forEach((dummyValue, i) => {
      built = built.replace(String(dummyValue), `:${placeholders[i]}`)
    })
  }

  return BASE_URL + built
}

export class Id {
  private currId: number

  constructor(data: any[]) {
    this.currId = data.length ? Math.max(...data.map((s) => s.id)) + 1 : 1
  }

  public nextId = () => {
    return this.currId++
  }
}
