import { Request, Response } from "express";
import { IUser } from "../../../models/User";
import Project from "../../../models/Project";

const getMyProjects = async (req: Request, res: Response) => {
  const user = req.user as IUser;
};

const getProjectPreviews = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (!user) {
    return res.sendStatus(400);
  }
  const projects = await Project.find({userId: user._id})
  console.log(projects)
  return res.json({projects});
};

export { getMyProjects, getProjectPreviews };
