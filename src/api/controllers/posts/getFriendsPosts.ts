import Post from "../../../models/Post";
import { populatePosts } from "../../../utils/utils";
import { getUserFriendsIds } from "../relationships/getUserFriendsIds";

const getFriendsPosts = async (userId: string) => {
  try {
    const friendsIds = await getUserFriendsIds(userId);
    const posts = [];
    for (let index = 0; index < friendsIds.length; index++) {
      const friendPosts = await Post.find({ user: friendsIds[index] });
      posts.push(...friendPosts);
    }
    return await populatePosts(posts);
  } catch (err: any) {
    console.log("Error during fetching friends posts: ", err);
    return [];
  }
};

export { getFriendsPosts };
