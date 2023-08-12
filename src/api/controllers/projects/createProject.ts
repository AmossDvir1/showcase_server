import { Request, Response } from "express";
import Project, { IProject } from "../../../models/Project";

const createProject = async (req: Request, res: Response) => {
  const data = req?.body?.projectDetails?.data;
try{
  console.log(data);

  const createdProject = await create(data.projectName, data.projectDesc, !!data.isExposed);
  if (createdProject) {
    console.log('Project created:', createdProject);
  } else {
    console.log('A project with the same name already exists.');
  }
}
catch(err: any){
  console.error('Error:', err);
}
  console.log(req.body);
  res.status(200).json("blah");
};

const create = async (
  title: string,
  description: string,
  isExposed: boolean
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
