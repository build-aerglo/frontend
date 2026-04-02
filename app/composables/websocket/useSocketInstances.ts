import * as signalR from "@microsoft/signalr";

const connections: Record<string, signalR.HubConnection> = {};

export default function () {
  const config = useRuntimeConfig();

  const createConnection = (endpoint: string) => {
    if (connections[endpoint]) return connections[endpoint];

    // const baseUrl = `${location.protocol}//${location.hostname}:5187`;
    const baseUrl = config.public.reviewApiUrl;

    connections[endpoint] = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${endpoint}`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          const delays = [0, 2000, 5000, 10000, 30000];

          const delay = delays[retryContext.previousRetryCount] ?? 30000;

          console.log(
            `[Socket Retry] Attempt #${retryContext.previousRetryCount + 1} for ${endpoint} in ${delay}ms`,
          );

          return delay;
        },
      })
      .build();

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
