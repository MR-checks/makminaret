"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { WhatsAppLink } from "@/components/page/Cta";

/**
 * Homepage hero (MASTERPLAN §3.1 section 1).
 *
 * One thesis, stated once. No carousel, no rotating headline, no animated
 * counters. The entrance stagger is the once-on-first-paint moment from §6.8
 * and is driven by the `hero-stagger` class in globals.css, which
 * prefers-reduced-motion collapses.
 *
 * The mini-form is three fields that deep-link into the wizard with the
 * answers pre-filled. It is not the wizard itself.
 *
 * The field list is passed in from the content layer rather than hardcoded, so
 * this select, the wizard and the programme finder cannot drift apart.
 */

const LEVELS = [
  ["foundation", "Foundation or language year"],
  ["bachelor", "Bachelor's degree"],
  ["master", "Master's degree"],
  ["phd", "PhD"],
];

const COUNTRIES = [
  "Ghana",
  "Nigeria",
  "Kenya",
  "Cameroon",
  "Uganda",
  "Tanzania",
  "Other",
];

export function HeroSection({
  fields,
}: {
  fields: Array<{ slug: string; name: string }>;
}) {
  const router = useRouter();
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");
  const [country, setCountry] = useState("");

  const start = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (level) params.set("level", level);
    if (field) params.set("field", field);
    if (country) params.set("citizenship", country);
    router.push(`/eligibility${params.size ? `?${params}` : ""}`);
  };

  const control =
    "min-h-11 w-full rounded-sm border border-border-input bg-paper-raised px-3 font-sans text-base text-ink";

  return (
    <section className="on-dark bg-navy px-6 py-16 text-paper md:py-24 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[55fr_45fr] lg:items-center">
        <div className="hero-stagger">
          <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-gold">
            Minaret Educational Consultancy
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.05] tracking-tight">
            Study in Türkiye.
          </h1>

          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-paper/85">
            We place students from across Africa into accredited Turkish universities, and
            we handle the paperwork that stops most applications: denklik, apostille,
            visa, and residence permit.
          </p>

          <form
            onSubmit={start}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <div className="flex-1">
              <label htmlFor="hero-level" className="sr-only">
                I want to study
              </label>
              <select
                id="hero-level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={control}
              >
                <option value="">I want to study…</option>
                {LEVELS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="hero-field" className="sr-only">
                Field
              </label>
              <select
                id="hero-field"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className={control}
              >
                <option value="">Field…</option>
                {fields.map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="hero-country" className="sr-only">
                My country
              </label>
              <select
                id="hero-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={control}
              >
                <option value="">My country…</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-seal px-6 font-sans text-sm font-medium text-white transition-colors hover:bg-seal/90"
            >
              See my options
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <p className="mt-4 font-mono text-[0.8125rem] tracking-[0.04em] text-paper/70">
            Free. Two minutes. No documents needed yet.
          </p>

          <div className="mt-6">
            <WhatsAppLink context="Hi, I would like to ask about studying in Türkiye." />
          </div>
        </div>

        {/*
          Licensed place-and-atmosphere photograph, downloaded and committed
          rather than hotlinked: the site CSP is img-src 'self', so a remote
          image is blocked outright. Source, photographer and licence are
          recorded in content/image-credits.json, and the subject was visually
          checked for identifiable people before it was committed (HANDOVER §1.5).
        */}
        <figure className="m-0">
          <Image
            src="/images/istanbul-skyline.jpg"
            alt="The Istanbul skyline over the Bosphorus, with mosques and minarets at dusk"
            width={1600}
            height={1067}
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="w-full rounded-lg border border-paper/15 object-cover"
          />
          <figcaption className="mt-6 rounded-md border border-paper/15 bg-navy-deep p-6">
            <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-gold">
              Based in Ankara, Türkiye
            </p>
            <p className="mt-3 font-display text-xl leading-snug md:text-2xl">
              We are in Ankara, not in Accra. We handle your file from inside Türkiye.
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
