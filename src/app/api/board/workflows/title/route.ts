import { eq } from "drizzle-orm";
import { serve } from "@upstash/workflow/nextjs";

import { db } from "@/db";
import { boards } from "@/db/schema";

interface InputType {
  boardId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate a compelling, strategic title for a project board based on its description. Please adhere to these specific guidelines:

CREATE A CONCISE TITLE (3-8 words, max 60 characters) that captures the essence of the project.
INCORPORATE RELEVANT KEYWORDS that reflect:

The project's primary objectives and goals
Key methodologies or approaches involved
The industry/domain context
Target audience or stakeholders


HIGHLIGHT THE UNIQUE VALUE PROPOSITION by focusing on:

The problem being solved
Expected outcomes or benefits
Innovative aspects or differentiators
Timeline or urgency indicators if applicable


USE CLEAR, PROFESSIONAL LANGUAGE:

Employ active voice and precise wording
Include action verbs when appropriate
Avoid unnecessary jargon unless it's standard terminology in the field
Balance creativity with clarity and searchability


ENSURE THE TITLE IS:

Easily scannable at a glance
Memorable and distinctive
Aligned with professional/organizational tone
Optimized for internal search and organization systems


RETURN ONLY THE FINAL TITLE as plain text without any explanations, quotes, formatting, or additional commentary.

Example transformations:
Description: "A project to redesign the customer onboarding process to reduce friction and improve conversion rates in the first 30 days"
Title: Customer Onboarding Redesign: 30-Day Conversion Boost
Description: "Research initiative to identify emerging market opportunities in sustainable packaging for consumer goods"
Title: Sustainable Packaging Market Opportunities Research`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { boardId } = input;

  const board = await context.run("get-board", async () => {
    const [existingBoard] = await db
      .select()
      .from(boards)
      .where(eq(boards.id, boardId));

    if (!existingBoard) {
      throw new Error("Not found");
    }

    return existingBoard;
  });

  const { body } = await context.api.openai.call("generate-title", {
    baseURL: "https://api.deepseek.com",
    token: process.env.DEEPSEEK_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: board.description
        }
      ]
    }
  });

  const title = body.choices[0]?.message.content;

  if (!title) {
    throw new Error("Bad request");
  }

  await context.run("update-title", async () => {
    await db
      .update(boards)
      .set({
        title: title || boards.title
      })
      .where(eq(boards.id, boardId));
  });
});
