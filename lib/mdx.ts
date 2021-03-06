import fs from "fs";
import path from "path";
import matter from "gray-matter";
import mdxPrism from "mdx-prism";
import remarkLinks from "remark-autolink-headings";
import remarkSlug from "remark-slug";
import remarkCode from "remark-code-titles";
import { serialize } from "next-mdx-remote/serialize";

const root = process.cwd();

export const getFiles = () => fs.readdirSync(path.join(root, "data"));

export const getFileBySlug = async (slug: string) => {
  const mdxSource = fs.readFileSync(
    path.join(root, "data", `${slug}.mdx`),
    "utf-8"
  );

  const { data, content } = await matter(mdxSource);

  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkLinks, remarkSlug, remarkCode],
      rehypePlugins: [mdxPrism],
    },
  });

  return {
    source,
    frontmatter: {
      slug,
      ...data,
    },
  };
};

export const getAllFilesMetadata = () => {
  const files: any = getFiles();

  return files.reduce((allPosts: any, postSlug: any) => {
    const mdxSource: any = fs.readFileSync(
      path.join(root, "data", postSlug),
      "utf-8"
    );

    const { data } = matter(mdxSource);

    return [{ ...data, slug: postSlug.replace(".mdx", "") }, ...allPosts];
  }, []);
};
