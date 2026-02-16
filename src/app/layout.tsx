import type { Metadata } from "next";
import { Orbitron, Chakra_Petch } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
    subsets: ["latin"],
    variable: "--font-orbitron",
    display: "swap",
});

const chakra = Chakra_Petch({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-chakra",
    display: "swap",
});

export const metadata: Metadata = {
    title: "RC Performance | Precision Scale Engineering",
    description: "Experience the next generation of RC technology.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${orbitron.variable} ${chakra.variable}`}>
            <body className="bg-black text-white antialiased overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}
