import { Request, Response } from "express";
import User from "../../../models/User";

const getSearchResults = async (req: Request, res: Response) => {
  let { q } = req.query;
  const query = q?.toString() || "";
  if (query?.length > 0) {
    const users = await User.find();

    return res.json({results: users});
  }
  return res.json([]);
};

export { getSearchResults };
