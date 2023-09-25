import express from "express";
import { userRoute } from "../api/routes/users";
import { projectRoute } from "../api/routes/projects";
import { searchRoute } from "../api/routes/search";
import { profileRoute } from "../api/routes/profiles";
import { relationshipRoute } from "../api/routes/friends";
import { postRoute } from "../api/routes/posts";
import { notificationRoute } from "../api/routes/notifications";

const useRoutes = (app: express.Express) => {
  app.use("/user", userRoute);
  app.use("/project", projectRoute);
  app.use("/profiles", profileRoute);
  app.use("/search", searchRoute);
  app.use("/friends", relationshipRoute);
  app.use("/post", postRoute);
  app.use('/notifications', notificationRoute);
};
export { useRoutes };
