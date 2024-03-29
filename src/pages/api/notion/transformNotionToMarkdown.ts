import { Client } from "@notionhq/client";
import type {
  ImageBlockObjectResponse,
  PageObjectResponse,
  ParagraphBlockObjectResponse,
  QueryDatabaseResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getUser } from "./getUser";

export async function transformNotionToMarkdown(
  notion: Client,
  notionBlogPosts: QueryDatabaseResponse
) {
  const notionToMarkdown = await Promise.all(
    (notionBlogPosts.results as PageObjectResponse[]).map(
      async ({ id, last_edited_time, created_by, cover, properties }) => {
        const pageData = await notion.blocks.children.list({
          block_id: id,
          page_size: 50,
        });

        const user = await getUser(notion, created_by.id);
        const userName = user.name;
        const title = properties.Name.title[0].plain_text;
        const tags = properties.Tags.multi_select.map(
          ({ name }: { name: string }) => name
        );

        const dataAsMarkdown = pageData.results.map(result => {
          if (result.type === "paragraph") {
            const paragraphResultWithTypes = (
              result as ParagraphBlockObjectResponse
            ).paragraph.rich_text as TextRichTextItemResponse[];

            const mappedText = paragraphResultWithTypes.map(
              ({ text, annotations, href }) => {
                const { content } = text;

                switch (true) {
                  case annotations.bold:
                    return `**${content}**`;
                  case annotations.italic:
                    return `*${content}*`;
                  case annotations.strikethrough:
                    return `~~${content}~~`;
                  case annotations.underline:
                    `<u>${content}</u>`;
                  case annotations.code:
                    `\`\`\`${content}\`\`\``;
                  default:
                    return content;
                }
              }
            );
            return mappedText.join("");
          } else if (result.type === "image") {
            const imageURL = (result as ImageBlockObjectResponse).image.file
              .url;
            return `![Astro](${imageURL})`;
          }
        });

        return {
          dataAsMarkdown,
          userName,
          lastEdited: last_edited_time,
          title,
          tags,
        };
      }
    )
  );

  return notionToMarkdown;
}

// TODO handle notionBlogPosts.hasMore
// TODO Add date logic -> filter out results where Date is ...
// TODO implemenet OG image?
// TODO grab description
