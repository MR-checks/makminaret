import React from "react";
import { getService, getServices } from "@/lib/content/reader";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({
    locale: "en",
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const service = await getService(p.slug);
  if (!service) return {};
  return {
    title: `${service.title} | Minaret Services`,
    description: service.summary,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await params;
  const service = await getService(p.slug);

  if (!service) {
    notFound();
  }

  // Because Keystatic document is async, we would await it if needed to render full AST.
  // For the structural shell, we just render a placeholder.
  const whatWeDoContent = (
    <p>Detailed service descriptions from CMS will be parsed here.</p>
  );

  return (
    <div className="bg-sand min-h-screen pb-24">
      {/* Hero Header */}
      <header className="bg-navy text-white pt-24 pb-16 px-6 lg:px-12 on-dark">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider rounded-md mb-4">
            {service.division}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
            {service.title}
          </h1>
          <p className="font-sans text-lg text-white/80 max-w-2xl">{service.summary}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 flex flex-col gap-12">
            <section>
              <h2 className="font-display text-3xl text-navy mb-6">What we do</h2>
              <div className="prose prose-slate max-w-none font-sans text-slate">
                {whatWeDoContent}
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl text-navy mb-6">Who it is for</h2>
              <div className="bg-white border-l-4 border-navy p-6 text-slate font-sans italic">
                {service.whoItIsFor}
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl text-navy mb-6">Specific Services</h2>
              <div className="bg-white border border-slate/10 p-8">
                <ul className="flex flex-col gap-4 text-slate">
                  {service.serviceItems &&
                    service.serviceItems.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle2 className="text-navy shrink-0 mt-0.5" size={20} />
                        <span>{item}</span>
                      </li>
                    ))}
                  {(!service.serviceItems || service.serviceItems.length === 0) && (
                    <li>Specific services are being updated.</li>
                  )}
                </ul>
              </div>
            </section>
          </div>

          <div>
            <div className="bg-white border border-slate/10 p-8 sticky top-8">
              <h3 className="font-display text-2xl text-navy mb-4">Request a Quote</h3>
              <p className="text-slate font-sans text-sm mb-6">
                Tell us what you need in Türkiye, and our B2B team will respond within 4
                working hours.
              </p>

              <Link
                href="/eligibility" // In a real scenario, this links to a B2B contact form. We link to main CTA for now.
                className="flex items-center justify-center gap-2 bg-navy text-white w-full h-12 font-sans font-medium uppercase tracking-wide hover:bg-navy/90 transition-colors rounded-md on-dark"
              >
                Get in touch
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
