import Post from "../../../models/Post";
import { mapPostContent, populatePosts } from "../../../utils/utils";
import { getUserFriendsIds } from "../relationships/getUserFriendsIds";

const getFriendsPosts = async (userId: string) => {
  try {
    const friendsIds = await getUserFriendsIds(userId);
    const posts = [];
    for (let index = 0; index < friendsIds.length; index++) {
      const friendPosts = await Post.find({ "user": friendsIds[index] });
      posts.push(...friendPosts);
    }
    // await populatePosts(posts);
    return await populatePosts(posts);
    // return await mapPostContent(posts);
  } catch (err: any) {
    console.log(err);
    return [];
  }
};

export { getFriendsPosts };
