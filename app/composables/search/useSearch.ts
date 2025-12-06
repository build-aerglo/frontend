export const useSearch = () => {
  const getSuggestions = async (query: string) => {
    if (!query) return []

    const res = await fetch(
      `/api/search/suggestions?q=${encodeURIComponent(query)}`
    )

    if (!res.ok) throw new Error('Search failed')

    return res.json()
  }

  const search = async (query: string, page = 1) => {
    const res = await fetch(
      `/api/search?q=${encodeURIComponent(query)}&page=${page}`
    )

    if (!res.ok) throw new Error('Search failed')

    return res.json()
  }

  return { getSuggestions, search }
}
