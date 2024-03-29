import { Client } from "@notionhq/client";

export async function getUser(notion: Client, id: string) {
  const userId = id;
  const response = await notion.users.retrieve({ user_id: userId });
  return response;
}
