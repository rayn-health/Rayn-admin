import { adminDb } from "@/lib/firebase/admin";
import { notFound } from "next/navigation";

type Theme = { background: string; foreground: string; accent: string; fontDisplay: string };
type Section = { id: string; eyebrow?: string; heading?: string; body?: string; buttonLabel?: string; buttonUrl?: string };
type Content = { title?: string; published?: boolean; sections?: Section[]; headline?: string; body?: string };

const DEFAULT_THEME: Theme = { background: "#0B0D12", foreground: "#F1F2F5", accent: "#5B7FFF", fontDisplay: "Fraunces" };
const FONT_STACKS: Record<string, string> = { Fraunces: '"Fraunces", Georgia, serif', "Playfair Display": '"Playfair Display", Georgia, serif', "Space Grotesk": '"Space Grotesk", Arial, sans-serif', Inter: "Inter, Arial, sans-serif" };
function safeHex(value: unknown, fallback: string) { return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback; }
function safeFont(value: unknown) { return typeof value === "string" && value in FONT_STACKS ? value : DEFAULT_THEME.fontDisplay; }

async function getPageData(slug: string) {
  try {
    const [contentSnap, themeSnap] = await Promise.all([adminDb.collection("content").doc(slug).get(), adminDb.collection("theme").doc("site").get()]);
    const content = contentSnap.exists ? (contentSnap.data() as Content) : {};
    const rawTheme = themeSnap.exists ? themeSnap.data() : {};
    const theme: Theme = { background: safeHex(rawTheme?.background, DEFAULT_THEME.background), foreground: safeHex(rawTheme?.foreground, DEFAULT_THEME.foreground), accent: safeHex(rawTheme?.accent, DEFAULT_THEME.accent), fontDisplay: safeFont(rawTheme?.fontDisplay) };
    return { exists: contentSnap.exists, content, theme };
  } catch { return { exists: false, content: {}, theme: DEFAULT_THEME }; }
}

export async function PublicPage({ slug }: { slug: string }) {
  const { exists, content, theme } = await getPageData(slug);
  if (slug !== "home" && (!exists || content.published !== true)) notFound();
  const sections = content.sections?.length ? content.sections : [{ id: "hero", eyebrow: "Rayn", heading: content.headline ?? "This site is ready for its content.", body: content.body ?? "Sign in at /login to write the homepage, set a theme, and publish.", buttonLabel: "Admin sign in", buttonUrl: "/login" }];
  return <main className="min-h-screen px-6 py-16" style={{ background: theme.background, color: theme.foreground }}><div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col justify-center gap-16">{sections.map((section, index) => <section key={section.id || index} className="max-w-3xl">{section.eyebrow && <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em]" style={{ color: theme.accent }}>{section.eyebrow}</p>}{section.heading && <h1 className="text-4xl font-medium leading-tight md:text-6xl" style={{ fontFamily: FONT_STACKS[theme.fontDisplay] }}>{section.heading}</h1>}{section.body && <p className="mt-5 max-w-2xl text-base leading-7 opacity-75 md:text-lg">{section.body}</p>}{section.buttonLabel && section.buttonUrl && <a href={section.buttonUrl} className="mt-7 inline-flex rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-80" style={{ background: theme.accent, color: theme.background }}>{section.buttonLabel}</a>}</section>)}</div></main>;
}
