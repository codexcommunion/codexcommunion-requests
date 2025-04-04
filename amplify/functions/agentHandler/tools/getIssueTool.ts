import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { Octokit } from "@octokit/rest";

export const getIssueTool = tool(
  async ({ owner, repo, issue_number }) => {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const result = await octokit.issues.get({ owner, repo, issue_number });
    return JSON.stringify(result.data, null, 2);
  },
  {
    name: "get_issue",
    description: "Get details of a specific issue by number",
    schema: z.object({
      owner: z.string(),
      repo: z.string(),
      issue_number: z.number(),
    }),
  }
);
