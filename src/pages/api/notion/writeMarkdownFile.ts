import fs from "fs";

// Function to construct Markdown content
function constructMarkdownContent(array: string[]) {
  // TODO get author, title, data, ogImage, tags, description

  let markdownContent = `
---
    author: Joshua Jones
    pubDatetime: 2024-01-10T18:16:04.768Z
    title: Test males don’t exist (and other bullshit the culture wants you to believe)
    slug: "test-exist"
    featured: true
    ogImage: ../../assets/images/AstroPaper-v4.png
    tags:
    - bjj
    - jiu jitsu
    - grappling
    - alpha males
    - tantra
    - lifting weights
    - skill acquisition
    - growth mindset
    - bravery

    description: "Test males don’t exist (and other bullshit the culture wants you to believe)"
---
`;

  array.forEach(string => {
    markdownContent += `${string}\n\n`;
  });

  return markdownContent.trimStart();
}

// Function to write Markdown file
function writeMarkdownFile(content: string) {
  fs.writeFile("src/content/blog/TEST2.md", content, err => {
    if (err) throw err;
    console.log("Markdown file has been created!");
  });
}

export async function processAndwriteMarkdownFile(
  pagesInMarkdown: (string | undefined)[][]
) {
  pagesInMarkdown.forEach(markdownPage => {
    const markdownContent = constructMarkdownContent(markdownPage);
    console.log(markdownContent, "markdownContent");
    writeMarkdownFile(markdownContent);
  });
}
