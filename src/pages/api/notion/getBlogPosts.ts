import { Client } from "@notionhq/client";

export async function getBlogPosts(notion: Client) {
  const databaseId = "46316de82f284103aea32e8859ec2430"; // TODO - store somewhere
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response;
}
