import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


interface AiRequest {
	context: string;
	type: 'comment' | 'bio' | 'post'
}

const aiSuggestionsController = async (req: Request, res: Response) => {

    const { context, type } = req.body as AiRequest;
   
    if (!context || !type) {
			return res.status(400).send({ message: 'Context or type are missing.' });
    }
    try {

        const prompt = generatePrompt(context, type);

        const result = await model.generateContent(prompt);

        const response = result.response;
        const text = response.text();
        if(text){
				return res.status(200).send({ suggestions: text });
			} else{
         return res.status(500).send({ message: 'No text was generated' });
        }
    } catch (err: any) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
};

const generatePrompt = (context: string, type: string) => {
  switch (type){
     case "comment":
     return`
       Generate a short relevant comment based on this post:\n\n
       ${context}
       \n\n
      The response should only return the generated comment.
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