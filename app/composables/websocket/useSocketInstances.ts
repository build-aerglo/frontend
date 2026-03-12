import * as signalR from "@microsoft/signalr";

const connections: Record<string, signalR.HubConnection> = {};

export default function () {
  const createConnection = (endpoint: string) => {
    if (connections[endpoint]) return connections[endpoint];

    const baseUrl = `${location.protocol}//${location.hostname}:5187`;

    connections[endpoint] = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${endpoint}`)
      .withAutomaticReconnect()
      .build();

    return connections[endpoint];
  };

  const useRecentReviewsSocket = () => createConnection("/hubs/reviews");
  const useStatisticsSocket = () => createConnection("/hub/statistics");

  return { useRecentReviewsSocket, useStatisticsSocket };
}
