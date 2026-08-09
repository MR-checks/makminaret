import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

export const getUniversities = () => reader.collections.universities.all();
export const getPrograms = () => reader.collections.programs.all();
export const getFields = () => reader.collections.fields.all();
export const getScholarships = () => reader.collections.scholarships.all();
export const getStories = () => reader.collections.stories.all();
export const getArticles = () => reader.collections.articles.all();
export const getCountries = () => reader.collections.countries.all();
export const getServices = () => reader.collections.services.all();
export const getPages = () => reader.collections.pages.all();
export const getTeam = () => reader.collections.team.all();
export const getOffices = () => reader.collections.offices.all();
export const getCourses = () => reader.collections.courses.all();
export const getFaqs = () => reader.collections.faqs.all();
export const getPartners = () => reader.collections.partners.all();

export const getUniversity = (slug: string) => reader.collections.universities.read(slug);
export const getProgram = (slug: string) => reader.collections.programs.read(slug);
export const getScholarship = (slug: string) =>
  reader.collections.scholarships.read(slug);
export const getStory = (slug: string) => reader.collections.stories.read(slug);
export const getArticle = (slug: string) => reader.collections.articles.read(slug);
export const getCountry = (slug: string) => reader.collections.countries.read(slug);
export const getService = (slug: string) => reader.collections.services.read(slug);
export const getPage = (slug: string) => reader.collections.pages.read(slug);
export const getCourse = (slug: string) => reader.collections.courses.read(slug);

export const getSiteSettings = () => reader.singletons.siteSettings.read();
export const getNavigation = () => reader.singletons.navigation.read();

/**
 * Pulls plain text out of a Keystatic document field, which the reader exposes
 * as an async function rather than an array. Reading it as an array silently
 * yields nothing, which is how an invented fallback quote once ended up on
 * every story card.
 */
export async function documentText(field: unknown): Promise<string | null> {
  const nodes = await documentNodes(field);
  const text = nodes
    ?.map((node) => node.children?.map((child) => child.text ?? "").join("") ?? "")
    .join(" ")
    .trim();
  return text || null;
}

export type DocNode = {
  type?: string;
  level?: number;
  children?: Array<{ text?: string }>;
};

export async function documentNodes(field: unknown): Promise<DocNode[] | null> {
  if (typeof field !== "function") return null;
  const nodes = (await (field as () => Promise<unknown>)()) as DocNode[] | undefined;
  return nodes ?? null;
}
