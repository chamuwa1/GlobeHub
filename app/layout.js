import { Inter, Space_Grotesk } from "next/font/google";
import Navbar from "../components/Navbar/Navbar";
import SplashScreen from "../components/SplashScreen/SplashScreen";
import Footer from "../components/Footer/Footer";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata = {
  title: "GlobeHub - News & Weather",
  description: "Your modern hub for global news and real-time weather.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="top" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
        <Script 
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {pageLanguage: 'en'},
                'google_translate_element'
              );
            }
          `}
        </Script>

        <SplashScreen />
        <Navbar />

        {children}
        <Footer />
      </body>
    </html>
  );
}
