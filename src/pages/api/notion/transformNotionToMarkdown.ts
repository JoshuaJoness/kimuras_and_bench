import { Client } from "@notionhq/client";
import type {
  ImageBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QueryDatabaseResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function transformNotionToMarkdown(
  notion: Client,
  notionBlogPosts: QueryDatabaseResponse
) {
  console.log(notionBlogPosts, "notionBlogPosts");

  const notionToMarkdown = await Promise.all(
    notionBlogPosts.results.map(async ({ id }) => {
      // TODO Add date logic -> filter out results where Date is ...

      const pageData = await notion.blocks.children.list({
        block_id: id,
        page_size: 50,
      });

      const normalizedData = pageData.results.map(result => {
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
                  return `--${content}--`;
                case annotations.underline:
                  `<u>${content}</u>`;
                case annotations.code:
                  `\`${content}\``;
                default:
                  return content;
              }
            }
          );
          return mappedText.join("");
        } else if (result.type === "image") {
          const imageURL = (result as ImageBlockObjectResponse).image.file.url;
          return `![Astro](${imageURL})`;
        }
      });

      return normalizedData;
    })
  );

  return notionToMarkdown;
}
