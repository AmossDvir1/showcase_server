import express from "express";
import { checkAuthentication } from "../utils/authUtils";
import { getProfile } from "../controllers/profiles/getProfile";
import { uploadPicture } from "../controllers/profiles/uploadPicture"; 
import { Request, Response } from "express";

const profileRoute = express.Router();


// -------------------------- //
// ----- GET Functions ------ //
// -------------------------- //

profileRoute.get("/", checkAuthentication, getProfile);

// -------------------------- //
// ----- POST Functions ----- //
// -------------------------- //

profileRoute.post("/upload/cover", checkAuthentication, (req: Request, res: Response) => uploadPicture(req, res, "cover" ));
profileRoute.post("/upload/profile", checkAuthentication, (req: Request, res: Response) => uploadPicture(req, res, "profile" ));

export { profileRoute }