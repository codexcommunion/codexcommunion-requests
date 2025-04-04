import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { Octokit } from "@octokit/rest";

export const addIssueCommentTool = tool(
  async ({ owner, repo, issue_number, body }) => {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const result = await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });
    return JSON.stringify(result.data, null, 2);
  },
  {
    name: "add_issue_comment",
    description: "Add a comment to an existing GitHub issue",
    schema: z.object({
      owner: z.string(),
      repo: z.string(),
      issue_number: z.number(),
      body: z.string(),
    }),
  }
);
