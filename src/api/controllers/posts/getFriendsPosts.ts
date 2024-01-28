import Post from "../../../models/Post";
import { getUserFriendsIds } from "../relationships/getUserFriendsIds";

const getFriendsPosts = async (userId: string) => {
  try {
    const friendsIds = await getUserFriendsIds(userId);
    const posts = [];
    for (let index = 0; index < friendsIds.length; index++) {
      const friendPosts = await Post.find({ "user.userId": friendsIds[index] });
      posts.push(...friendPosts);
    }
    return posts;
  } catch (err: any) {
    return [];
  }
};

export { getFriendsPosts };
