import { ImagePurpose } from "../../../global";
import Picture from "../../../models/Picture";
import { IUser } from "../../../models/User";

const getPicture = async (user: IUser, purpose: ImagePurpose) => {
    const picture = await Picture.findOne({
        userId: user._id,
        purpose: purpose,
      });
      return picture
}



export { getPicture }