import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { headers } from "next/headers";
import { newsreader, instrumentSans, ibmPlexMono } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { PreviewBar } from "@/components/layout/PreviewBar";
import { getSiteUrl, isShowcase } from "@/lib/site-mode";
import { getSiteSettings } from "@/lib/content/reader";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  // Showcase builds must not be indexed anywhere, and robots.txt alone is not
  // enough: a page reached directly still needs the meta signal (HANDOVER §3.4).
  robots: isShowcase() ? { index: false, follow: false } : undefined,
  title: {
    default: "Minaret Educational Consultancy | Study in Türkiye",
    template: "%s | Minaret Educational Consultancy",
  },
  description:
    "We place students from Africa and the Middle East into accredited Turkish universities, and we handle the paperwork that stops most applications: denklik, apostille, visa, and residence permit.",
  openGraph: {
    type: "website",
    siteName: "Minaret Educational Consultancy",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  const waHref = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi, I would like to ask about studying in Türkiye.")}`
    : null;

  // Consuming the per-request nonce is what makes Next.js stamp it onto its
  // own inline bootstrap and RSC-payload scripts. Without this read the route
  // stays statically prerendered, no nonce is applied, and the 'strict-dynamic'
  // CSP blocks every chunk. MASTERPLAN §10.1 step 4: take the dynamic
  // rendering globally first, measure LCP on throttled 4G, and only split the
  // policy if the budget actually fails.
  await headers();

  return (
    <html
      lang={locale}
      className={`${newsreader.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {/*
          The provider is required: next-intl's client-side Link from
          createNavigation reads routing config from this context, so removing
          it 500s every route. It was worth testing, since nothing in the client
          tree consumes the message catalogue itself, but the machinery is not
          separable from the navigation helpers.
        */}
        <NextIntlClientProvider>
          {isShowcase() && <PreviewBar />}
          <Header
            phone={settings?.primaryPhone}
            whatsappNumber={settings?.whatsappNumber}
            legalName={settings?.legalName}
            registrationNumber={settings?.registrationNumber}
          />
          {/*
            No offset needed: the header is sticky, so it occupies its own
            space in flow. This previously carried a hardcoded pt-[100px].
          */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
          <MobileActionBar phone={settings?.primaryPhone} waHref={waHref} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
