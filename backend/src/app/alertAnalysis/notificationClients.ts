import { NotificationImpl } from "src/shared/notification/notification";
import { WebsocketClientImpl } from "src/shared/notification/notificationClients/websocket";

const websocketClient = new WebsocketClientImpl();

export const notificationClients = new NotificationImpl([websocketClient]);
