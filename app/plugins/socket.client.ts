import useSocketInstances from "~/composables/websocket/useSocketInstances";
import * as signalR from "@microsoft/signalr";

export default defineNuxtPlugin(() => {
  const {
    useStatisticsSocket,
    useTopBusinessSocket,
    useRecentReviewsSocket,
    useCategorySocket,
  } = useSocketInstances();

  interface Statistics {
    registeredBusinesses: number;
    registeredUsers: number;
    uploadedReviews: number;
  }

  interface Category {
    id: string;
    name: string;
    description: string | null;
    parentCategoryId: string | null;
    icon: string;
    businessCount: number;
  }

  interface Reviews {
    id: string;
    email: string;
    businessId: string;
    businessName: string;
    starRating: number;
    uploadedDate: string;
    reviewBody: string;
    anonymous: boolean;
  }

  interface TopBusiness {
    id: string;
    businessName: string;
    logo: string;
    categories: [
      {
        id: string;
        name: string;
        description: string | null;
        parentCategoryId: string | null;
        icon: string;
      },
    ];
    reviewCount: number;
    avgRating: number;
  }

  const statistics = useState<Statistics>("statistics", () => ({
    registeredBusinesses: 0,
    registeredUsers: 0,
    uploadedReviews: 0,
  }));

  const topBusinesses = useState<TopBusiness[]>("topBusinesses", () => []);
  const reviews = useState<Reviews[]>("reviews", () => []);
  const categories = useState<Category[]>("categories", () => []);

  const statsConn = useStatisticsSocket();
  const businessConn = useTopBusinessSocket();
  const reviewsConn = useRecentReviewsSocket();
  const categoryConn = useCategorySocket();

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

    if (!parsed || typeof parsed !== "object") {
      return parsed;
    }

    const source = parsed as Record<string, unknown>;

    if (Array.isArray(source.data)) return source.data;
    if (Array.isArray(source.items)) return source.items;
    if (Array.isArray(source.result)) return source.result;
    if (Array.isArray(source.value)) return source.value;
    if (source.data && typeof source.data === "object") return source.data;
    if (source.result && typeof source.result === "object")
      return source.result;

    return source;
  };

  const asArray = <T>(payload: unknown): T[] => {
    const unwrapped = unwrapPayload(payload);
    return Array.isArray(unwrapped) ? (unwrapped as T[]) : [];
  };

  const asStats = (payload: unknown): Statistics => {
    const unwrapped = unwrapPayload(payload);

    if (!unwrapped || typeof unwrapped !== "object") {
      return {
        registeredBusinesses: 0,
        registeredUsers: 0,
        uploadedReviews: 0,
      };
    }

    const source = unwrapped as Record<string, unknown>;

    return {
      registeredBusinesses: Number(source.registeredBusinesses) || 0,
      registeredUsers: Number(source.registeredUsers) || 0,
      uploadedReviews: Number(source.uploadedReviews) || 0,
    };
  };

  statsConn.on("ReceiveStatistics", async (stat) => {
    console.log("fetched statistics");

    const normalized = asStats(stat);
    statistics.value = normalized;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "statistics", data: normalized },
    });
  });

  businessConn.on("ReceiveTopBusinesses", async (data) => {
    console.log("fetched top businesses");

    const normalized = asArray<TopBusiness>(data);
    topBusinesses.value = normalized;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "top-business", data: normalized },
    });
  });

  reviewsConn.on("ReceiveTopReviews", async (data) => {
    console.log("fetched reviews");

    const normalized = asArray<Reviews>(data);
    reviews.value = normalized;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "recentReviews", data: normalized },
    });
  });

  categoryConn.on("ReceiveCategories", async (data) => {
    console.log("fetched categories");

    const normalized = asArray<Category>(data);
    categories.value = normalized;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "categories", data: normalized },
    });
  });

  const startConnection = async (
    conn: signalR.HubConnection,
    name: string,
  ): Promise<void> => {
    if (
      conn.state === signalR.HubConnectionState.Connected ||
      conn.state === signalR.HubConnectionState.Connecting
    ) {
      console.log(`[Socket] Skipping ${name}, already ${conn.state}`);
      return;
    }

    try {
      await conn.start();
      console.log(`[Socket] Connected: ${name}`);
    } catch (err: unknown) {
      console.error(`[Socket] Failed: ${name}`, err);

      setTimeout(() => {
        console.log(`[Socket] Retrying manual start: ${name}`);
        startConnection(conn, name);
      }, 5000);
    }
  };

  const preloadCache = async () => {
    try {
      const [stats, businesses, revs, cats] = await Promise.all([
        $fetch("/api/page?key=statistics"),
        $fetch("/api/page?key=top-business"),
        $fetch("/api/page?key=recentReviews"),
        $fetch("/api/page?key=categories"),
      ]);

      statistics.value = asStats(stats);
      topBusinesses.value = asArray<TopBusiness>(businesses);
      reviews.value = asArray<Reviews>(revs);
      categories.value = asArray<Category>(cats);

      console.log("[Socket] Cache hydrated");
    } catch (err) {
      console.error("[Socket] Cache preload failed", err);
    }
  };

  const startAll = () => {
    startConnection(statsConn, "statistics");
    startConnection(businessConn, "top-business");
    startConnection(reviewsConn, "reviews");
    startConnection(categoryConn, "categories");
  };

  preloadCache().finally(() => {
    startAll();
  });

  return {
    provide: {
      statistics,
      topBusinesses,
      reviews,
      categories,
    },
  };
});
