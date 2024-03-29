import type { APIRoute } from "astro";
import { Client } from "@notionhq/client";
import { transformNotionToMarkdown } from "./transformNotionToMarkdown";
import { getBlogPosts } from "./getBlogPosts";
import { processAndwriteMarkdownFile } from "./processAndWriteMarkdownFile";

// Initializing a client
const notion = new Client({
  auth: "secret_dnq1QMZw6kycckaysq6W3JH6NxdCOH61ha4g1g5Af7b", // TODO process.env.NOTION_TOKEN,
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const notionBlogPosts = await getBlogPosts(notion);
    const pagesInMarkdown = await transformNotionToMarkdown(
      notion,
      notionBlogPosts
    );
    processAndwriteMarkdownFile(pagesInMarkdown);
  } catch (error) {
    console.error(error);
  }

  return new Promise(() => "");
};

// TODO does a mdx file look the same across themes?
// TODO - port to Kimuras
