import { Util } from "@notes/core/util";
import { OpenAI } from "openai";
import { Resource } from "sst";


export const main = Util.handler(async (event) => {
    const openai = new OpenAI({ apiKey: Resource.OpenAIApiKey.value });

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a storyteller. You will create a short dialog about the Noggin company, involving the characters: Sean, Jens, CM, and Kristen. Use humor and try to be misterious about what is Noggin's future. The story should be in valid JSON format and have a maximum of 5 lines of dialogue."
          },
          {
            role: "user",
            content: "Create a short story in a JSON array, with each object containing a speaker and text. The story should be about Noggin, and use only the four characters: Sean, Jens, CM, and Kristen."
          }
        ],
        response_format: {
          // See /docs/guides/structured-outputs
          type: "json_schema",
          json_schema: {
            // The name of your output schema
            name: "story_schema",
            // The actual JSON Schema
            schema: {
              type: "object",
              properties: {
                story: {
                  type: "array",
                  description: "A short dialog (max 5 lines) about Noggin with Sean, Jens, CM, and Kristen.",
                  maxItems: 5,
                  items: {
                    type: "object",
                    properties: {
                      speaker: {
                        type: "string",
                        enum: ["Sean", "Jens", "CM", "Kristen"],
                        description: "One of the four characters."
                      },
                      text: {
                        type: "string",
                        description: "A single line of dialogue about Noggin."
                      }
                    },
                    required: ["speaker", "text"],
                    additionalProperties: false
                  }
                }
              },
              required: ["story"],
              additionalProperties: false
            }
          }
        },
        store: true,
      });
      console.log("completion call completed");
      console.log(completion.choices[0].message);
      const content = completion.choices[0].message.content;

      return content || '{"story":[]}';
});