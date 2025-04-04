import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { Octokit } from "@octokit/rest";

export const createIssueTool = tool(
  async ({ owner, repo, title, body }) => {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const result = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
    });
    return JSON.stringify(result.data, null, 2);
  },
  {
    name: "create_issue",
    description: "Create a new GitHub issue",
    schema: z.object({
      owner: z.string(),
      repo: z.string(),
      title: z.string(),
      body: z.string().optional(),
    }),
  }
);
