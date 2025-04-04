import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { Octokit } from "@octokit/rest";

const DEFAULT_REPO = process.env.DEFAULT_REPO;

export const searchIssuesTool = tool(
  async ({ query }) => {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const makeQuery = (q: string) => `repo:${DEFAULT_REPO} is:issue ${q}`;

    const trySearch = async (q: string) => {
      console.log("🔍 [search_issues] Scoped GitHub query:", q);
      const result = await octokit.request("GET /search/issues", {
        q,
        advanced_search: "true",
      });
      return result.data.items;
    };

    try {
      // 🔎 First attempt: user query as-is
      let issues = await trySearch(makeQuery(query));
      if (issues.length === 0) {
        // 🌀 Retry with OR-joined query
        const tokens = query.split(/\s+/).filter(Boolean);
        const orQuery = tokens.map((t) => `"${t}"`).join(" OR ");
        const fallbackQuery = makeQuery(`(${orQuery})`);
        console.log("🔁 [search_issues] Retrying with fallback query...");
        issues = await trySearch(fallbackQuery);
      }

      console.log(`📦 [search_issues] Found ${issues.length} issues`);
      return JSON.stringify(issues.slice(0, 5), null, 2);
    } catch (error) {
      console.error("❌ [search_issues] GitHub API error:", error);
      throw error;
    }
  },
  {
    name: "search_issues",
    description: `Search all GitHub issues (open and closed) in the repository ${DEFAULT_REPO}. Automatically adds fallback logic to widen search if no results are found.`,
    schema: z.object({
      query: z
        .string()
        .describe(
          `GitHub search string to match issue titles, bodies, or comments. Automatically filters to 'is:issue' and retries with OR between keywords if no results.`
        ),
    }),
  }
);
