import type { Metadata } from "next";

import Providers from "./providers";
import BootstrapClient from "./bootstrap-client";

import "./globals.css";
import "../index.css";
import "../assets/all.scss";
import "../assets/swiper.scss";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const metadata: Metadata = {
  title: "Enso Incense",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
          integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Providers>
          <BootstrapClient />
          {children}
        </Providers>
      </body>
    </html>
  );
}

