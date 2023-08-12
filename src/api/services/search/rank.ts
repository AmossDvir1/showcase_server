import { Document } from "mongoose";
import { calculateSimilarity, preprocessString } from "./searchUtils";
import { isNullOrUndefined } from "../../utils/helpers";

const rankDocuments = (
  documents: Document[],
  query: string,
  fieldsWithWeights: { field: string; weight: number }[]
) => {
  const queryTokens = preprocessString(query);

  const rankedDocuments = documents.map((document) => {
    const fieldRelevances = fieldsWithWeights.map(({ field, weight }) => {
      const fieldTokens = preprocessString(document.get(field));

      if (fieldTokens && queryTokens) {
        const simValues = queryTokens
          .map((qToken) =>
            fieldTokens.map((fToken) => calculateSimilarity(qToken, fToken))
          )
          .flat(1);
        if (simValues) {
          return weight * simValues.reduce((pv, cv) => pv + cv, 0);
        }
      } else {
        return 0;
      }
    });
    const totalRelevance = fieldRelevances.reduce(
      (sum, relevance) => (sum ?? 0) + (relevance ?? 0),
      0
    );
    return {
      document,
      relevance: totalRelevance,
    };
  });
  if (rankedDocuments) {
    return (
      rankedDocuments?.sort((a, b) => {
        if (a.relevance !== undefined && b.relevance !== undefined) {
          return b.relevance - a.relevance;
        }
        return 0;
      }) ?? []
    );
  }
  return [];
};

export { rankDocuments };
