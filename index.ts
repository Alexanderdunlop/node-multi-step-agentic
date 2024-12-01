import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import "dotenv/config";
import { z } from "zod";

const main = async () => {
  const result = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: "What is the weather in San Francisco?",
  });

  console.log(result.text);
};

main().catch(console.error);
