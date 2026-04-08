import * as signalR from "@microsoft/signalr";

const connections: Record<string, signalR.HubConnection> = {};

export default function () {
  const config = useRuntimeConfig();

  const createConnection = (endpoint: string) => {
    if (connections[endpoint]) return connections[endpoint];

    // const baseUrl = `${location.protocol}//${location.hostname}:5187`;
    const baseUrl = config.public.reviewApiUrl;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${endpoint}`)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.None)
      .build();

    // Azure load balancer drops idle WebSocket connections after ~4 minutes.
    // Ping every 30s to keep the connection alive, and allow up to 90s
    // before treating the connection as dead.
    conn.keepAliveIntervalInMilliseconds = 30000;
    conn.serverTimeoutInMilliseconds = 90000;

    connections[endpoint] = conn;

    return connections[endpoint];
  };

  const useRecentReviewsSocket = () => createConnection("/hubs/reviews");
  const useStatisticsSocket = () => createConnection("/hubs/statistics");
  const useTopBusinessSocket = () => createConnection("/hubs/top-business");
  const useCategorySocket = () => createConnection("/hubs/categories");

  return {
    useRecentReviewsSocket,
    useStatisticsSocket,
    useTopBusinessSocket,
    useCategorySocket,
  };
}
