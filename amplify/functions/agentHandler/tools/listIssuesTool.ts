import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { Octokit } from "@octokit/rest";

export const listIssuesTool = tool(
  async ({ owner, repo, state }) => {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const result = await octokit.issues.listForRepo({
      owner,
      repo,
      state,
      per_page: 20,
    });
    return JSON.stringify(result.data, null, 2);
  },
  {
    name: "list_issues",
    description: "List recent issues in a GitHub repository (default: open)",
    schema: z.object({
      owner: z.string(),
      repo: z.string(),
      state: z.enum(["open", "closed", "all"]).optional().default("open"),
    }),
  }
);
