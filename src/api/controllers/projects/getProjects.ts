import { Request, Response } from "express";

const getMyProjects = async (req: Request, res: Response) => {};

const getProjectPreviews = async (req: Request, res: Response) => {
  const data = req?.body;
  if (!data) {
    return res.sendStatus(400);
  }
  console.log(data)
  return res.json(200);
};

export { getMyProjects, getProjectPreviews };
