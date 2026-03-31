import useSocketInstances from "~/composables/websocket/useSocketInstances";
import * as signalR from "@microsoft/signalr";

export default defineNuxtPlugin(() => {
  const {
    useStatisticsSocket,
    useTopBusinessSocket,
    useRecentReviewsSocket,
    useCategorySocket,
  } = useSocketInstances();

  const statistics = useState("statistics", () => ({}));
  const topBusinesses = useState("topBusinesses", () => []);
  const reviews = useState("reviews", () => []);
  const categories = useState("categories", () => []);

  const statsConn = useStatisticsSocket();
  const businessConn = useTopBusinessSocket();
  const reviewsConn = useRecentReviewsSocket();
  const categoryConn = useCategorySocket();

  statsConn.on("ReceiveStatistics", async (stat) => {
    console.log("fetched statistics");

    statistics.value = stat;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "statistics", data: stat },
    });
  });

  businessConn.on("ReceiveTopBusinesses", async (data) => {
    console.log("fetched top businesses");

    topBusinesses.value = data;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "top-business", data },
    });
  });

  reviewsConn.on("ReceiveTopReviews", async (data) => {
    console.log("fetched reviews");

    reviews.value = data;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "recentReviews", data },
    });
  });

  categoryConn.on("ReceiveCategories", async (data) => {
    console.log("fetched categories");

    categories.value = data;

    await $fetch("/api/page", {
      method: "POST",
      body: { key: "categories", data },
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

      if (stats) statistics.value = stats;
      // @ts-ignore
      if (businesses) topBusinesses.value = businesses;
      // @ts-ignore
      if (revs) reviews.value = revs;
      // @ts-ignore
      if (cats) categories.value = cats;

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
