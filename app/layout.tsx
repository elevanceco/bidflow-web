import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BidFlow | B2B eSourcing & Reverse Auction Platform",
  description:
    "Turn your Excel-based vendor quotation process into an auditable sourcing event in minutes. Create structured RFQs, run live reverse auctions, and export defensible audit trails.",
  keywords: [
    "eSourcing",
    "reverse auction software",
    "RFQ platform",
    "procurement software",
    "vendor quotation",
    "B2B sourcing",
    "BidFlow",
  ],
  authors: [{ name: "BidFlow" }],
  openGraph: {
    title: "BidFlow | Graduate from Excel-based Procurement",
    description:
      "Replace scattered supplier quotations across Excel and email with structured RFQs, competitive bidding, and an auditable sourcing workflow.",
    url: "https://bidflow.com",
    siteName: "BidFlow",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BidFlow | B2B eSourcing Platform",
    description:
      "Turn your Excel-based vendor quotation process into an auditable sourcing event in minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", geist.variable)}>
      {" "}
      <body
        className={`${geist.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
