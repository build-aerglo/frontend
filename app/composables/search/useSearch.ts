import useSearchApi from "./useSearchApi";
import { dummySearchData, type GroupedSearchResult } from "./useDummySearch";
export default function () {
  const api = useSearchApi();
  const search = async (q: string) => {
    try {
      const res = await api.get(`api/search?query=${q}`);

      if (res) {
        return res.data;
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const useDummySearch = async (q: string): Promise<GroupedSearchResult> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const query = q.toLowerCase().trim();

    if (!query) {
      return { companies: [], categories: [] };
    }

   const companies = dummySearchData.companies
      .filter(data => 
        data.name.toLowerCase().includes(query) || 
        data.url.toLowerCase().includes(query)
      )
      .slice(0, 5);
    const categories = dummySearchData.categories
      .filter(name => name.toLowerCase().includes(query))
      .slice(0, 5);
    return { companies, categories };
  };
  return {
    search,
    useDummySearch
  };
}

  // const getSuggestions = async (query: string) => {
  //   if (!query) return []

  //   const res = await fetch(
  //     `/api/search/suggestions?q=${encodeURIComponent(query)}`
  //   )

  //   if (!res.ok) throw new Error('Search failed')

  //   return res.json()
  // }

  // const search = async (query: string, page = 1) => {
  //   const res = await fetch(
  //     `/api/search?q=${encodeURIComponent(query)}&page=${page}`
  //   )

  //   if (!res.ok) throw new Error('Search failed')

  //   return res.json()
  // }
