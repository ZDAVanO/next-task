import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";

import { ThemeProvider } from "@/components/theme-provider"
// import Header from "@/components/header";
// import LayoutContent from "@/components/LayoutContent";

import { Providers } from "@/components/Providers"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next-Task",
  description: "Next js task management app with server actions and optimistic UI",
};


export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <Providers session={session}>
          <ReduxProvider>

            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >

              {/* <LayoutContent> */}
              {children}
              {/* </LayoutContent> */}

            </ThemeProvider>


          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
