// Build absolute URLs to match axios (baseURL + route)
const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const url = (path: string) => BASE_URL + path

export class Id {
  private currId: number

  constructor(data: any[]) {
    this.currId = data.length ? Math.max(...data.map((s) => s.id)) + 1 : 1
  }

  public nextId = () => {
    return this.currId++
  }
}
