import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import "dotenv/config";
import { z } from "zod";

const main = async () => {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What is the weather in San Francisco and what should I do?",
    tools: {
      weather: tool({
        description: "Get the weather in a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      }),
      attractions: tool({
        description: "Get the attractions in a location",
        parameters: z.object({
          location: z
            .string()
            .describe("The location to get the attractions for"),
          temperature: z
            .number()
            .describe("The current temperature in Fahrenheit"),
        }),
        execute: async ({ location, temperature }) => {
          const result = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: `What are 3 attractions in ${location} that I should see given it is ${temperature} outside?`,
          });
          return result.text;
        },
      }),
    },
    maxSteps: 5,
  });

  console.log(result.steps.map((step) => step.stepType).join("\n"));
  console.log(result.text);
};

main().catch(console.error);
