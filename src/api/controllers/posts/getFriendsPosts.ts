import Post from "../../../models/Post";
import { getUserFriends } from "../relationships/getUserFriends";

const getFriendsPosts = async (userId: string) => {
  try {
    const friendsIds = await getUserFriends(userId);
    const posts = [];
    for (let index = 0; index < friendsIds.length; index++) {
      const friendPosts = await Post.find({ userId: friendsIds[index] });
      posts.push(...friendPosts);
    }
    return posts;
  } catch (err: any) {
    return [];
  }
};

export { getFriendsPosts };
