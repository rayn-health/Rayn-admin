"use client";
import Link from "next/link";
const items=[['/admin','Overview'],['/admin/content','Content'],['/admin/theme','Theme'],['/admin/media','Media'],['/admin/projects','Projects']];
export function AdminSidebar(){return <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-ink-800 bg-ink-900 p-4"><div className="mb-6 font-display text-xl text-ink-100">Rayn Admin</div><nav className="flex md:flex-col gap-1 overflow-x-auto">{items.map(([href,label])=><Link key={href} href={href} className="rounded-md px-3 py-2 text-sm text-ink-400 hover:bg-ink-800 hover:text-ink-100 whitespace-nowrap">{label}</Link>)}</nav></aside>;}
