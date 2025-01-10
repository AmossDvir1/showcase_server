import { Request, Response } from "express";
import { rankDocuments } from "../../services/search/rank";
import Project from "../../../models/Project";
import User, { IUser } from "../../../models/User";
import { RELEVANCE_THRESHOLD } from "../../../utils/constants";
import { PipelineStage } from "mongoose";

const getSearchSuggestions = async (req: Request, res: Response) => {
  let { q } = req.query;
  const query = q?.toString() || "";
  if (query?.length > 0) {
    try {
      const pipeline: PipelineStage[] = [
        {
          $search: {
            index: "autocomplete",
            autocomplete: {
              query,
              path: "fullName",
              fuzzy: {
                maxEdits: 1,
                prefixLength: 1,
              },
            },
          },
        },
        {
          $limit: 10,
        },
        {
          $project: {
            _id: 1,
            title: "$fullName",
            content: "$email",
            type: { $literal: "user" },
            score: { $meta: "searchScore" },
          },
        },
        {
          $sort: { score: -1 },
        },
        {
          $facet: {
            results: [{ $limit: 10 }],
            maxScore: [{ $group: { _id: null, maxScore: { $max: "$score" } } }],
          },
        },
        {
          $project: {
            results: 1,
            maxScore: { $arrayElemAt: ["$maxScore.maxScore", 0] },
          },
        },
        {
          $unwind: "$results",
        },
        {
          $project: {
            _id: "$results._id",
            title: "$results.title",
            content: "$results.content",
            type: "$results.type",
            score: {
              $cond: {
                if: { $gt: ["$maxScore", 0] },
                then: {
                  $divide: ["$results.score", "$maxScore"], // Normalize score between 0 and 1
                },
                else: 0,
              },
            },
          },
        },
        {
          $sort: { score: -1 },
        },
      ];

      // Execute the aggregation pipeline
      let results = await User.aggregate(pipeline);
      console.log(results.map(res => ({name: res.title, score: res.score})));

      // Populate `profilePicture` for the users
      results = await User.populate(results, { path: "profilePicture" });

      // Format the results to include the icon field
      const formattedResults = results.map((user: any) => ({
        title: user.title,
        content: user.content,
        type: "profile",
        score: user.score,
        icon: user.profilePicture || null, // Use populated profilePicture
      }));

      return res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Error during search:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
  return res.json([]);

  // if (query?.length > 0) {
  //   const projects = await Project.find();
  //   const users = await User.find();

  //   const rankedProjectDocs = rankDocuments(projects, query, [
  //     { field: "title", weight: 0.8 },
  //     { field: "description", weight: 0.2 },
  //   ]);
  //   const rankedUsersDocs = rankDocuments(users, query, [
  //     { field: "firstName", weight: 0.8 },
  //     { field: "lastName", weight: 0.2 },
  //   ]);

  //   const rankedProjectsItems = rankedProjectDocs.map((item) => {
  //     return {
  //       ...item,
  //       title: item.document.get("title"),
  //       content: item.document.get("description"),
  //       type: "project",
  //       icon: null
  //     };
  //   });

  //   const rankedUsersItems = Promise.all(rankedUsersDocs.map(async (item) => {
  //     return {
  //       ...item,
  //       title: item.document.get("firstName"),
  //       content: item.document.get("lastName"),
  //       type: "profile",
  //       icon: await item.document.populate("profilePicture")
  //     };
  //   }));

  //   const filteredRankedDocs = [
  //     ...rankedProjectsItems,
  //     ...await rankedUsersItems,
  //   ].filter((doc) => doc.relevance && doc.relevance > RELEVANCE_THRESHOLD);
  //   const sortedFilteredRankedDocs = filteredRankedDocs.sort((a, b) => {
  //     if (a.relevance !== undefined && b.relevance !== undefined) {
  //       return b.relevance - a.relevance;
  //     }
  //     return 0;
  //   });

  //   const filteredRankedResult = sortedFilteredRankedDocs.map((result) => {
  //     return {
  //       title: result.title,
  //       content: result.content,
  //       type: result.type,
  //       ...(result?.icon && {icon: result.document.get("profilePicture")}),
  //       ...(result.document.get("urlMapping") && {urlMapping: result.document.get("urlMapping")})
  //     };
  //   });

  //   return res.json(filteredRankedResult);
  // }
  // return res.json([]);
};

export { getSearchSuggestions };
