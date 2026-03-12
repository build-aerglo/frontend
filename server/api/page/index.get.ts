import { getOrCreateCache } from "../../utils/pageCache";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const cache = getOrCreateCache(query.key as string);

  return cache.getData();
});
