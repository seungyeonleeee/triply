import "./globals.css";

export const metadata = {
  title: "Triply",
  description: "Interactive Travel Planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
