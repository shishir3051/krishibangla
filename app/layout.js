import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata = {
  title: "কৃষি বাংলাদেশ — Agriculture Intelligence Portal",
  description: "AI-Powered Agriculture Intelligence Portal for Bangladesh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
