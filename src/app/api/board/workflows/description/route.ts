import { eq } from "drizzle-orm";
import { serve } from "@upstash/workflow/nextjs";

import { db } from "@/db";
import { boards } from "@/db/schema";

interface InputType {
  boardId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to create an informative, concise description for a project board based on its content. Please follow these guidelines:

1. PROVIDE A STRATEGIC OVERVIEW (3-6 sentences, 150-300 characters) that effectively communicates:
   - The core purpose and objectives of the project
   - Key deliverables or expected outcomes
   - Timeline markers or project phases if applicable
   - Stakeholders or target audience

2. EMPHASIZE ACTIONABLE INFORMATION by including:
   - Primary methodologies or approaches being utilized
   - Critical success metrics or goals
   - Resource requirements or constraints
   - Dependencies or integration points with other projects

3. STRUCTURE THE DESCRIPTION TO BE SCANNABLE:
   - Lead with the most essential information
   - Use precise, concrete language
   - Incorporate relevant technical terminology appropriately
   - Balance specificity with accessibility for cross-functional teams

4. MAINTAIN A PROFESSIONAL, OBJECTIVE TONE:
   - Use active voice and present tense when possible
   - Focus on facts rather than opinions
   - Avoid unnecessary adjectives or promotional language
   - Ensure clarity for team members at various expertise levels

5. INCLUDE CONTEXTUAL ELEMENTS when relevant:
   - Business justification or strategic alignment
   - Risk factors or mitigation strategies
   - Innovation aspects or competitive advantages
   - References to established frameworks or methodologies

6. RETURN ONLY THE FINAL DESCRIPTION as plain text without additional explanations, quotes, or formatting.

Example transformation:
Content: "Series of tasks related to migrating the legacy CRM system to Salesforce, including data mapping, integration testing, user training sessions, and post-deployment support through Q3 2023"
Description: Migration of legacy CRM to Salesforce platform with comprehensive data transfer, system integration, and staff enablement components. Project encompasses mapping of existing data structures, API development, testing protocols, and training program development with targeted Q3 2023 completion.`;

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

  const { body } = await context.api.openai.call("generate-description", {
    baseURL: "https://api.deepseek.com",
    token: process.env.DEEPSEEK_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: DESCRIPTION_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: board.description
        }
      ]
    }
  });

  const description = body.choices[0]?.message.content;

  if (!description) {
    throw new Error("Bad request");
  }

  await context.run("update-description", async () => {
    await db
      .update(boards)
      .set({
        description: description || boards.description
      })
      .where(eq(boards.id, boardId));
  });
});
