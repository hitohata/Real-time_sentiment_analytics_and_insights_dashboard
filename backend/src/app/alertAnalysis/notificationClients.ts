import { NotificationImpl } from "src/shared/notification/notification";
import { DiscordNotificationImpl } from "src/shared/notification/notificationClients/discord";
import { WebsocketClientImpl } from "src/shared/notification/notificationClients/websocket";

const websocketClient = new WebsocketClientImpl();
const discordClient = new DiscordNotificationImpl();

export const notificationClients = new NotificationImpl([
	websocketClient,
	discordClient,
]);
