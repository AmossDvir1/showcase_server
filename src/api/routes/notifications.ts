import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getNotifications } from "../controllers/notifications/getNotifications";
import { markNotificationsAsRead } from "../controllers/notifications/markAsRead";
import { markNotificationsAsUnread } from "../controllers/notifications/markAsUnread.ts";

const notificationRoute = express.Router();

// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

notificationRoute.get("/", checkAuthentication, getNotifications);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

notificationRoute.post("/mark-as-read", checkAuthentication, markNotificationsAsRead);
notificationRoute.post("/mark-as-unread", checkAuthentication, markNotificationsAsUnread);


export { notificationRoute };
