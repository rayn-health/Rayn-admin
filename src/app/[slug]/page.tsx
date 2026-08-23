import { notFound } from "next/navigation";
import { PublicPage } from "@/components/public/PublicPage";
const PUBLIC_SLUGS=new Set(["about","contact"]);
export default function SlugPage({params}:{params:{slug:string}}){if(!PUBLIC_SLUGS.has(params.slug))notFound();return <PublicPage slug={params.slug}/>;}
