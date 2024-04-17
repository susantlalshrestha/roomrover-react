import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Room Rover",
  description: "Web application to book the rooms",
};

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en" data-theme="light">
      <body className={poppins.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
