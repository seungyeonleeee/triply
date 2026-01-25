import "./globals.css";

import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/layout/Header";
import AppFrame from "@/components/layout/AppFrame";
import SideBrand from "@/components/layout/SideBrand";

export const metadata: Metadata = {
  title: "Triply",
  description: "Interactive travel planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-100">
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Left Side */}
            <SideBrand />

            {/* Mobile App */}
            <AppFrame>
              <Header />
              <main className="min-h-[calc(100vh-56px)]">
                {children}
              </main>
            </AppFrame>

            {/* Right Side */}
            <SideBrand />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
