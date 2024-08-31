import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OS",
  description: "Created by Engix",
};

export default function RootLayout({ children }) {
  return (
    <html className="bg-[#f5fcff]" lang="en">
      <body className={inter.className}>{children}
      </body>
    </html>
  );
}
