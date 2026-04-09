import * as signalR from "@microsoft/signalr";
import { getOrCreateCache } from "../utils/pageCache";

// Runs once when the Nitro server starts. Connects to all SignalR hubs and
// writes received data directly into the in-memory cache so it is ready
// before the first browser request arrives.

const parseMaybeJson = (value: unknown) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const unwrapPayload = (raw: unknown): unknown => {
  const parsed = parseMaybeJson(raw);
  if (!parsed || typeof parsed !== "object") return parsed;

  const source = parsed as Record<string, unknown>;
  if (Array.isArray(source.data)) return source.data;
  if (Array.isArray(source.items)) return source.items;
  if (Array.isArray(source.result)) return source.result;
  if (Array.isArray(source.value)) return source.value;
  if (source.data && typeof source.data === "object") return source.data;
  if (source.result && typeof source.result === "object") return source.result;
  return source;
};

const asArray = <T>(payload: unknown): T[] => {
  const unwrapped = unwrapPayload(payload);
  return Array.isArray(unwrapped) ? (unwrapped as T[]) : [];
};

const asStats = (payload: unknown) => {
  const unwrapped = unwrapPayload(payload);
  if (!unwrapped || typeof unwrapped !== "object") {
    return { registeredBusinesses: 0, registeredUsers: 0, uploadedReviews: 0 };
  }
  const s = unwrapped as Record<string, unknown>;
  return {
    registeredBusinesses: Number(s.registeredBusinesses) || 0,
    registeredUsers: Number(s.registeredUsers) || 0,
    uploadedReviews: Number(s.uploadedReviews) || 0,
  };
};

const buildConnection = (url: string) =>
  new signalR.HubConnectionBuilder()
    .withUrl(url)
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.None)
    .build();

const startConnection = async (
  conn: signalR.HubConnection,
  name: string,
): Promise<void> => {
  if (
    conn.state === signalR.HubConnectionState.Connected ||
    conn.state === signalR.HubConnectionState.Connecting
  ) {
    return;
  }
  try {
    await conn.start();
    console.log(`[Server Socket] Connected: ${name}`);
  } catch (err) {
    console.error(`[Server Socket] Failed to connect: ${name}`, err);
    setTimeout(() => startConnection(conn, name), 5000);
  }
};

export default defineNitroPlugin(() => {
  const reviewApiUrl = process.env.REVIEW_API_URL;

  if (!reviewApiUrl) {
    console.warn("[Server Socket] REVIEW_API_URL not set, skipping hub connections");
    return;
  }

  const statsConn = buildConnection(`${reviewApiUrl}/hubs/statistics`);
  const businessConn = buildConnection(`${reviewApiUrl}/hubs/top-business`);
  const reviewsConn = buildConnection(`${reviewApiUrl}/hubs/reviews`);
  const categoryConn = buildConnection(`${reviewApiUrl}/hubs/categories`);

  statsConn.keepAliveIntervalInMilliseconds = 30000;
  statsConn.serverTimeoutInMilliseconds = 90000;
  businessConn.keepAliveIntervalInMilliseconds = 30000;
  businessConn.serverTimeoutInMilliseconds = 90000;
  reviewsConn.keepAliveIntervalInMilliseconds = 30000;
  reviewsConn.serverTimeoutInMilliseconds = 90000;
  categoryConn.keepAliveIntervalInMilliseconds = 30000;
  categoryConn.serverTimeoutInMilliseconds = 90000;

  statsConn.on("ReceiveStatistics", (stat) => {
    const normalized = asStats(stat);
    getOrCreateCache("statistics").setData(normalized);
    console.log("[Server Socket] statistics updated");
  });

  businessConn.on("ReceiveTopBusinesses", (data) => {
    const normalized = asArray(data);
    getOrCreateCache("top-business").setData(normalized);
    console.log("[Server Socket] top-business updated");
  });

  reviewsConn.on("ReceiveTopReviews", (data) => {
    const normalized = asArray(data);
    getOrCreateCache("recentReviews").setData(normalized);
    console.log("[Server Socket] recentReviews updated");
  });

  categoryConn.on("ReceiveCategories", (data) => {
    const normalized = asArray(data);
    getOrCreateCache("categories").setData(normalized);
    console.log("[Server Socket] categories updated");
  });

  startConnection(statsConn, "statistics");
  startConnection(businessConn, "top-business");
  startConnection(reviewsConn, "reviews");
  startConnection(categoryConn, "categories");
});
