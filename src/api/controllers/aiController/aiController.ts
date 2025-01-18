import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

interface AiRequest {
  context: string;
  type: "comment" | "bio" | "post";
}

const aiSuggestionsController = async (req: Request, res: Response) => {
  const { context, type } = req.body as AiRequest;

  if (!context || !type) {
    return res.status(400).send({ message: "Context or type are missing." });
  }
  try {
    const prompt = generatePrompt(context, type);

    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    if (text) {
      return res.status(200).send({ suggestions: text });
    } else {
      return res.status(500).send({ message: "No text was generated" });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};

const generatePrompt = (context: string, type: string) => {
  switch (type) {
    case "comment":
      return `
       Generate a short relevant comment based on this post:\n\n
       ${context}
       \n\n
       -----------------\n
       This was the post.\n
       you are an average user in a social network for developers, programmers and coders, and want to comment on a friend's post.\n
       Don't be super nice or bad, act like a regular man- if something is not understood to you don't just agree with what's written in the post just to be polite. and decide if it fits to use emojis, don't be too polite, don't add emojis if it is not necessary,\n
        Be creative, on a scale of 1-10 of creativity you will be 4.\n
        Be somewhat funny, on a scale of 1-10 of funniness you will be 3. \n
        Try to hit the vibe of the post and write the comment in a similar style.\n
       The response should only return the generated comment, don't include anything else other than the comment.\n
       don't mention that you are not a person or something similar, just avoid this.\n
       don't be rude of course, and you can be somewhat polite but not too much, just like a normal person. on a scale of 1-10 be like 5-6 polite.
     `;
    case "bio":
      return `
       Generate a short and inspiring profile bio based on these technologies and keywords: \n\n
       ${context}
       \n\n
      The response should only return the generated bio.
     `;
    case "post":
      return `
      Generate a short and engaging post based on this keywords: \n\n
      ${context}
      \n\n
      The response should only return the generated post.
     `;
    default:
      return context;
  }
};

export { aiSuggestionsController };
