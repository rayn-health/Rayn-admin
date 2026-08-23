import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
const fraunces=Fraunces({subsets:["latin"],variable:"--font-display",weight:["400","500","600"]});
const inter=Inter({subsets:["latin"],variable:"--font-body"});
const jetbrainsMono=JetBrains_Mono({subsets:["latin"],variable:"--font-mono"});
export const metadata:Metadata={title:"Rayn",description:"Rayn website and admin dashboard"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}><body className="font-body">{children}</body></html>;}
