import fs from "fs";

interface DataToWrite {
  dataAsMarkdown: (string | undefined)[];
  userName: string | null;
  lastEdited: any;
  title: string;
  tags: string[];
}

function constructMarkdownContent({
  dataAsMarkdown,
  userName,
  lastEdited,
  title,
  tags,
}: DataToWrite) {
  let markdownContent = `
---
author: ${userName}
pubDatetime: ${lastEdited}
title: ${title}
slug: "test-exist"
featured: true
ogImage: ../../assets/images/AstroPaper-v4.png
tags:${tags.map(tag => `\n \t - ${tag}`)}

description: ""
---
`;

  dataAsMarkdown.forEach(string => {
    markdownContent += `${string}\n\n`;
  });

  return { content: markdownContent.trimStart(), title };
}

function writeMarkdownFile({
  content,
  title,
}: {
  content: string;
  title: string;
}) {
  fs.writeFile(`src/content/blog/${title}.md`, content, err => {
    if (err) throw err;
    console.log("Markdown file has been created!");
  });
}

export async function processAndwriteMarkdownFile(dataToWrite: DataToWrite[]) {
  dataToWrite.forEach(
    ({ dataAsMarkdown, userName, lastEdited, title, tags }) => {
      const markdownContent = constructMarkdownContent({
        dataAsMarkdown,
        userName,
        lastEdited,
        title,
        tags,
      });
      writeMarkdownFile(markdownContent);
    }
  );
}
