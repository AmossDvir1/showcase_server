import express from "express";
import { userRoute } from "../api/routes/users";
import { projectRoute } from "../api/routes/projects";
import { searchRoute } from "../api/routes/search";
import { profileRoute } from "../api/routes/profiles";
import { relationshipRoute } from "../api/routes/friends";
import { postRoute } from "../api/routes/posts";
import { notificationRoute } from "../api/routes/notifications";
import { IUser } from "../models/User";
import { IPost } from "../models/Post";
import ProfilePicture from "../models/ProfilePicture";

const useRoutes = (app: express.Express) => {
  app.use("/user", userRoute);
  app.use("/project", projectRoute);
  app.use("/profiles", profileRoute);
  app.use("/search", searchRoute);
  app.use("/friends", relationshipRoute);
  app.use("/post", postRoute);
  app.use("/notifications", notificationRoute);
};

const populateUserWithPicture = async (user: IUser) => {
  return await user.populate("profilePicture");
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
    return populated;
  };

  if (Array.isArray(posts)) {
    // If it's an array of posts, use Promise.all to populate each post
    return Promise.all(posts.map(populateSinglePost));
  } else {
    // If it's a single post, just populate it
    return populateSinglePost(posts);
  }
};

const mapPostContent = async (posts: IPost | IPost[]) => {
  const mapSinglePost = async (post: IPost) => {
    try {
      // Find author's profile picture
      const authorPicture = await ProfilePicture.findOne({ userId: post.user })
        .lean()
        .exec();

      // Find unique user IDs from comments
      const commentUserIds = [
        ...new Set(post.comments.map((comment) => comment.user)),
      ];

      // Find profile pictures for comment users
      const commentsData = await ProfilePicture.find({
        userId: { $in: commentUserIds },
      })
        .lean()
        .exec();

      // Map commentsData to a simplified format
      const mappedCommentsData = commentsData.map((pic) => ({
        userId: pic.userId,
        imageStringBase64: pic.imageStringBase64,
      }));

      return {
        post: post.toObject(),
        media: [
          ...(authorPicture
            ? [
                {
                  userId: authorPicture.userId,
                  imageStringBase64: authorPicture.imageStringBase64,
                },
              ]
            : []),
          ...mappedCommentsData,
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
export { useRoutes, populateUserWithPicture, populatePosts, mapPostContent };
