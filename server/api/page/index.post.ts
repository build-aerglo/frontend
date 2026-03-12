import { getOrCreateCache } from "../../utils/pageCache";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const cache = getOrCreateCache(body.key);

  cache.setData(body.data);

  return { success: true };
});
