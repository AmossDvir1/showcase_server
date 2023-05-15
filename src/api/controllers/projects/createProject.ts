import { Request, Response } from "express";

const createProject = async (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json("blah");
};

export { createProject };
