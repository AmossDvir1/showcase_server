import * as stringSimilarity from "string-similarity";
import natural from "natural";

const tokenize = (str: string) => {
  const tokenizer = new natural.WordTokenizer();
  return tokenizer.tokenize(str);
};

const preprocessString = (str: string) => {
  const tokenized = tokenize(str?.toLowerCase() ?? "");
  return tokenized;
};

const calculateSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2 || str1.length === 0 || str2.length === 0) {
    return 0;
  }
  if (str1.length < 2 && str2.length > 1) {
    const regex = new RegExp(str1, "g");
    return (str2.match(regex) || []).length / str2.length;
  }
  if (str2.length < 2 && str1.length > 1) {
    const regex = new RegExp(str2, "g");
    return (str1.match(regex) || []).length / str1.length;
  }
  if (str1.length < 2 && str2.length < 2) {
    return str1 === str2 ? 1 : 0;
  }
  return stringSimilarity.compareTwoStrings(str1, str2);
};

export { preprocessString, tokenize, calculateSimilarity };
