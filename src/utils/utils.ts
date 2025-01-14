import express from "express";
import { userRoute } from "../api/routes/users";
import { projectRoute } from "../api/routes/projects";
import { searchRoute } from "../api/routes/search";
import { profileRoute } from "../api/routes/profiles";
import { relationshipRoute } from "../api/routes/friends";
import { postRoute } from "../api/routes/posts";
import { notificationRoute } from "../api/routes/notifications";
import { userSettingsRoute } from "../api/routes/userSettings";
import { IPost } from "../models/Post";
import Picture from "../models/Picture";
import { technologiesRoute } from "../api/routes/technologies";
import { sessionsRoute } from "../api/routes/sessions";
import { chatRoute } from "../api/routes/chat";
import { roomRoute } from "../api/routes/room";
import { aiRoute } from "../api/routes/ai";

const useRoutes = (app: express.Express) => {
  app.use("/user", userRoute);
  app.use("/project", projectRoute);
  app.use("/profiles", profileRoute);
  app.use("/search", searchRoute);
  app.use("/friends", relationshipRoute);
  app.use("/post", postRoute);
  app.use("/notifications", notificationRoute);
  app.use("/settings", userSettingsRoute);
  app.use("/technologies", technologiesRoute);
  app.use("/sessions", sessionsRoute);
  app.use("/chats", chatRoute);
  app.use("/rooms", roomRoute);
  app.use("/ai", aiRoute);
};

const populatePosts = async (posts: IPost | IPost[]) => {
  const populateSinglePost = async (post: IPost) => {
    let populated = await post.populate({
      path: "user",
      model: "User",
    });

    populated = await populated.populate({
      path: "comments",
      populate: [{ path: "user", model: "User" }],
    });
    populated = await populated.populate({
      path: "comments",
      populate: [{ path: "likes", model: "User" }],
    });
    populated = await populated.populate({
      path: "likes",
      model: "User",
    });
    return populated;
  };

  if (Array.isArray(posts)) {
    // If it's an array of posts, use Promise.all to populate each post
    return Promise.all(posts.map(populateSinglePost));
  } else {
    // If it's a single post, just populate it
    const singlePopulated = await populateSinglePost(posts);
    return [singlePopulated];
  }
};

const mapPostContent = async (posts: IPost | IPost[]) => {
  const mapSinglePost = async (post: IPost) => {
    try {
      // Find author's picture
      const authorPicture = await Picture.findOne({
        userId: post.user,
        purpose: "profile",
      })
        .lean()
        .exec();

      // Find unique user IDs from comments
      const commentUserIds = [
        ...new Set(post.comments.map((comment) => comment.user)),
      ];

      // Find pictures for comment users
      const commentsData = await Picture.find({
        userId: { $in: commentUserIds },
        purpose: "profile",
      })
        .lean()
        .exec();

      return {
        post: post.toObject(),
        media: [
          ...(authorPicture
            ? [authorPicture]
            : []),
          ...commentsData,
        ],
      };
    } catch (error) {
      console.error("Error mapping post content:", error);
      return { post: post.toObject(), media: [] }; // Return the original post with an empty media array in case of an error
    }
  };

  const postArray = Array.isArray(posts) ? posts : [posts];
  const mappedPosts = await Promise.all(postArray.map(mapSinglePost));

  // Extract unique media entries based on userId
  const uniqueMedia = Array.from(
    new Map(
      mappedPosts.flatMap((item) =>
        item.media.map((entry) => [entry.userId, entry])
      )
    ).values()
  );

  return {
    postsData: mappedPosts.map((item) => item.post),
    media: uniqueMedia,
  };
};

/**
 * Generates a random RGB color string with an optional alpha value.
 * @param {number} [alpha=1] - The alpha value to use for the color. Should be a number between 0 and 1.
 * @returns {string} A random RGB color string in the format `rgb(r, g, b, a)`.
 */
const generateRandomColorString = (alpha: number = 1): string => {
  const randomBetween = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));
  const r = randomBetween(0, 255);
  const g = randomBetween(0, 255);
  const b = randomBetween(0, 255);
  const rgb = `rgb(${r},${g},${b}, ${alpha})`; // Collect all to a css color string
  return rgb;
};

const removeDuplicatesByProperty = <T, K extends keyof T>(
  array: T[],
  property: K
): T[] => {
  const seenValues = new Set<T[K]>();
  return array.filter(item => {
    const value = item[property];
    if (seenValues.has(value)) {
      return false;
    }
    seenValues.add(value);
    return true;
  });
};

export { useRoutes, populatePosts, mapPostContent, generateRandomColorString, removeDuplicatesByProperty };
