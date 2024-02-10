import { Request, Response } from "express";
import { rankDocuments } from "../../services/search/rank";
import Project from "../../../models/Project";
import User from "../../../models/User";
import { RELEVANCE_THRESHOLD } from "../../../utils/constants";

const getSearchSuggestions = async (req: Request, res: Response) => {
  let { q } = req.query;
  const query = q?.toString() || "";
  if (query?.length > 0) {
    const projects = await Project.find();
    const users = await User.find();

    const rankedProjectDocs = rankDocuments(projects, query, [
      { field: "title", weight: 0.8 },
      { field: "description", weight: 0.2 },
    ]);
    const rankedUsersDocs = rankDocuments(users, query, [
      { field: "firstName", weight: 0.8 },
      { field: "lastName", weight: 0.2 },
    ]);

    const rankedProjectsItems = rankedProjectDocs.map((item) => {
      return {
        ...item,
        title: item.document.get("title"),
        content: item.document.get("description"),
        type: "project",
      };
    });

    const rankedUsersItems = rankedUsersDocs.map((item) => {
      return {
        ...item,
        title: item.document.get("firstName"),
        content: item.document.get("lastName"),
        type: "profile",
      };
    });


    const filteredRankedDocs = [
      ...rankedProjectsItems,
      ...rankedUsersItems,
    ].filter((doc) => doc.relevance && doc.relevance > RELEVANCE_THRESHOLD);
    const sortedFilteredRankedDocs = filteredRankedDocs.sort((a, b) => {
      if (a.relevance !== undefined && b.relevance !== undefined) {
        return b.relevance - a.relevance;
      }
      return 0;
    });

    const filteredRankedResult = sortedFilteredRankedDocs.map((result) => {
      return {
        title: result.title,
        content: result.content,
        type: result.type,
        ...(result.document.get("urlMapping") && {urlMapping: result.document.get("urlMapping")})
      };
    });

    return res.json(filteredRankedResult);
  }
  return res.json([]);
};

export { getSearchSuggestions };
