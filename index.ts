import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import "dotenv/config";
import { z } from "zod";

const main = async () => {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What is the weather in Luxembourg and what should I do?",
    tools: {
      getWeather: {
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
          );
          const weatherData = await response.json();
          return weatherData;
        },
      },
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
          const date = new Date().toISOString();
          const result = await generateText({
            model: openai("gpt-4o-mini"),
            prompt: `What are 3 attractions in ${location} that I should see given it is ${temperature} outside and the ${date} is?`,
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
