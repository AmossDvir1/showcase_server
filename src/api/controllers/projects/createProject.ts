import { Request, Response } from "express";
import Project, { IProject } from "../../../models/Project";
import { IUser } from "../../../models/User";

const createProject = async (req: Request, res: Response) => {
  const data = req?.body?.projectDetails?.data;
  const user = req.user as IUser;

  try {
    console.log(data);

    const createdProject = await create(
      data.projectName,
      data.projectDesc,
      !!data.isExposed,
      user._id
    );
    if (createdProject) {
      console.log("Project created:", createdProject);
      return res.status(200).json({ message: "Project created successfuly" });
    } else {
      console.log("A project with the same name already exists.");
      return res.status(400).json({ message: "Project name already exists" });
    }
  } catch (err: any) {
    console.error("Error:", err);
    return res.sendStatus(500);
  }
};

const create = async (
  title: string,
  description: string,
  isExposed: boolean,
  userId: string
) => {
  try {
    // Check if a project with the same projectName already exists
    const existingProject = await Project.findOne({ title });

    if (existingProject) {
      // A project with the same name already exists
      return null;
    }

    // Create a new project
    const newProject: IProject = new Project({
      title,
      description,
      isExposed,
      userId,
    });

    // Save the new project to the database
    const savedProject = await newProject.save();
    return savedProject;
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating project:", error);
    return null;
  }
};

export { createProject };
