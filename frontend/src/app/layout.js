// src/app/layout.js
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Referral & Credit System",
  description: "Referral program dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
