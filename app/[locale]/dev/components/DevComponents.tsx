"use client";

import * as React from "react";
import { Metadata } from "next";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { RadioCard } from "@/components/ui/RadioCard";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "@/components/ui/Breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";

import { HeroEducation } from "@/components/blocks/HeroEducation";
import { TrustRow } from "@/components/blocks/TrustRow";
import { ProcessChecklist } from "@/components/blocks/ProcessChecklist";
import { ProgramCard } from "@/components/blocks/ProgramCard";
import { ProgramFilterBar } from "@/components/blocks/ProgramFilterBar";
import { UniversityCard } from "@/components/blocks/UniversityCard";
import { CostTable } from "@/components/blocks/CostTable";
import { ScholarshipCard } from "@/components/blocks/ScholarshipCard";
import { StoryCard } from "@/components/blocks/StoryCard";
import { FAQAccordion } from "@/components/blocks/FAQAccordion";
import { DivisionStrip } from "@/components/blocks/DivisionStrip";
import { CTAPanel } from "@/components/blocks/CTAPanel";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { TeamCard } from "@/components/blocks/TeamCard";
import { OfficeCard } from "@/components/blocks/OfficeCard";
import { QuoteRequestForm } from "@/components/blocks/QuoteRequestForm";
import { EligibilityWizard } from "@/components/blocks/EligibilityWizard";
import { StampResult } from "@/components/blocks/StampResult";
import { MobileActionBar } from "@/components/blocks/MobileActionBar";

export const metadata: Metadata = {
  title: "Dev Components | Minaret",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevComponentsPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] pb-32">
      <div className="border-b border-[var(--rule)] bg-white px-8 py-6 sticky top-0 z-50 shadow-sm">
        <h1 className="font-display text-2xl">Minaret Design System</h1>
        <p className="font-mono text-sm text-[var(--slate)] uppercase tracking-[0.04em] mt-1">
          Phase 2: Components & Blocks
        </p>
      </div>

      <main className="mx-auto max-w-7xl px-8 py-12 space-y-24">
        {/* Primitives Section */}
        <section>
          <h2 className="font-display text-3xl mb-8 border-b border-[var(--rule)] pb-4 text-[var(--navy)]">
            UI Primitives
          </h2>

          <div className="space-y-16">
            {/* Buttons */}
            <div>
              <h3 className="font-mono text-sm uppercase text-[var(--slate)] mb-4">
                Button
              </h3>
              <div className="flex flex-wrap gap-4 items-end">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="whatsapp">WhatsApp Button</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h3 className="font-mono text-sm uppercase text-[var(--slate)] mb-4">
                Forms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
                <div className="space-y-2">
                  <Label htmlFor="demo-input">Standard Input</Label>
                  <Input id="demo-input" placeholder="Placeholder text..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-select">Select</Label>
                  <Select id="demo-select" defaultValue="">
                    <option value="" disabled hidden>
                      Choose an option
                    </option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone Input</Label>
                  <PhoneInput />
                </div>
                <div className="space-y-2">
                  <Label>Error State</Label>
                  <Input
                    className="border-[var(--seal)] focus-visible:ring-[var(--seal)]"
                    defaultValue="Invalid input"
                  />
                  <FieldError>This field is required.</FieldError>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Textarea</Label>
                  <Textarea placeholder="Type your message here..." />
                </div>
                <div className="space-y-2">
                  <Label>Checkbox</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox id="demo-check" />
                    <Label
                      htmlFor="demo-check"
                      className="normal-case tracking-normal text-[0.875rem] text-[var(--ink)]"
                    >
                      Accept terms and conditions
                    </Label>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Radio Cards</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <RadioCard
                      name="demo-radio"
                      label="Option A"
                      description="First choice"
                      defaultChecked
                    />
                    <RadioCard
                      name="demo-radio"
                      label="Option B"
                      description="Second choice"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div>
              <h3 className="font-mono text-sm uppercase text-[var(--slate)] mb-4">
                Indicators
              </h3>
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <Badge>Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Tag>Filter Tag</Tag>
                <Tag onRemove={() => {}}>Removable Tag</Tag>
              </div>
            </div>

            {/* Accordion & Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-mono text-sm uppercase text-[var(--slate)] mb-4">
                  Accordion
                </h3>
                <Accordion type="single" className="border-t border-[var(--rule)]">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It uses native React state and semantic HTML.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It comes with default styles that matches the other
                      components&apos; aesthetic.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div>
                <h3 className="font-mono text-sm uppercase text-[var(--slate)] mb-4">
                  Tabs
                </h3>
                <Tabs defaultValue="tab-1">
                  <TabsList>
                    <TabsTrigger value="tab-1">Account</TabsTrigger>
                    <TabsTrigger value="tab-2">Password</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="tab-1"
                    className="p-4 border border-[var(--rule)] mt-2 rounded-md bg-[var(--paper-raised)]"
                  >
                    <p className="text-sm">Make changes to your account here.</p>
                  </TabsContent>
                  <TabsContent
                    value="tab-2"
                    className="p-4 border border-[var(--rule)] mt-2 rounded-md bg-[var(--paper-raised)]"
                  >
                    <p className="text-sm">Change your password here.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Navigation & Utilities */}
            <div>
              <h3 className="font-mono text-sm uppercase text-[var(--slate)] mb-4">
                Navigation & Utilities
              </h3>
              <div className="space-y-8">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Current Page</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="flex gap-4 items-center">
                  <Tooltip tooltipContent="This is a helpful tooltip">
                    <span className="underline decoration-dotted cursor-help text-sm">
                      Hover me
                    </span>
                  </Tooltip>
                </div>

                <div className="flex items-center space-x-4 max-w-sm">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Blocks Section */}
        <section>
          <h2 className="font-display text-3xl mb-8 border-b border-[var(--rule)] pb-4 text-[var(--navy)] mt-24">
            Content Blocks
          </h2>

          <div className="space-y-24">
            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                HeroEducation
              </h3>
              <div className="border border-[var(--rule)] rounded-md overflow-hidden">
                <HeroEducation
                  eyebrow="Study in Türkiye"
                  headline={
                    <>
                      Study in
                      <br />
                      Türkiye.
                    </>
                  }
                  subHeadline="We place students from Africa into accredited Turkish universities, and we handle the paperwork that stops most applications."
                  form={
                    <div className="h-32 flex items-center justify-center text-white/50 text-sm border border-white/20 border-dashed rounded-md">
                      Form Placeholder
                    </div>
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                TrustRow
              </h3>
              <div className="border border-[var(--rule)] rounded-md overflow-hidden">
                <TrustRow />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                DivisionStrip
              </h3>
              <div className="border border-[var(--rule)] rounded-md overflow-hidden">
                <DivisionStrip
                  title="Explore"
                  items={[
                    { label: "Universities", href: "#" },
                    { label: "Programs", href: "#" },
                    { label: "Scholarships", href: "#" },
                  ]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                Program Finder
              </h3>
              <div className="bg-[var(--paper-raised)] p-8 border border-[var(--rule)] rounded-md">
                <ProgramFilterBar className="mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ProgramCard
                    university="Bilkent University"
                    programName="BSc Computer Engineering"
                    degree="Bachelor's"
                    language="English"
                    cost="$4,500"
                    originalCost="$9,000"
                  />
                  <ProgramCard
                    university="Koç University"
                    programName="MA International Relations"
                    degree="Master's"
                    language="English"
                    cost="$6,000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                ProcessChecklist
              </h3>
              <div className="bg-white p-8 border border-[var(--rule)] rounded-md">
                <ProcessChecklist />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                Cost table
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <CostTable reviewedOn="August 2026" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                Cards Grid
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UniversityCard
                  name="Sabancı University"
                  location="Istanbul"
                  programCount={42}
                  description="A top-ranked foundation university known for its flexible interdisciplinary approach and strong industry connections."
                />
                <ScholarshipCard
                  name="Minaret Partner Grant"
                  amount="50% Discount"
                  deadline="Aug 15"
                  description="Exclusive tuition discount negotiated for our students applying to select private universities."
                  eligibility={[
                    "Minaret applicants only",
                    "Min 3.0 GPA equivalent",
                    "Apply by deadline",
                  ]}
                />
                <StoryCard
                  studentName="Amaka O."
                  program="MBA"
                  university="Istanbul Technical University"
                  quote="The transition was completely smooth. Minaret handled every detail of my admission and visa."
                />
                <ArticleCard
                  title="How to prepare for your visa interview in Abuja"
                  excerpt="Essential tips and required documents for Nigerian students applying for a Turkish study visa this intake."
                  date="Oct 12, 2025"
                  category="Guide"
                />
                <TeamCard
                  name="Aisha Yılmaz"
                  role="Senior Admissions Advisor"
                  bio="Former university registrar who knows exactly what admission committees look for."
                />
                <OfficeCard
                  city="Accra"
                  country="Ghana"
                  address="14 Independence Ave, Ridge"
                  phone="+233 55 123 4567"
                  email="accra@makminaret.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                Forms & Wizards
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <QuoteRequestForm />
                <EligibilityWizard />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                FAQAccordion
              </h3>
              <div className="max-w-3xl mx-auto bg-white p-8 border border-[var(--rule)] rounded-md">
                <FAQAccordion />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                StampResult
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-12 p-12 bg-[var(--paper-raised)] border border-[var(--rule)] rounded-md">
                <StampResult />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono text-sm uppercase text-[var(--slate)]">
                CTAPanel
              </h3>
              <div className="border border-[var(--rule)] rounded-md overflow-hidden">
                <CTAPanel
                  title="Ready to check if you qualify?"
                  description="Our advisors are ready to review your academic background and recommend the best programs for your goals."
                  primaryActionLabel="Check Eligibility"
                  secondaryActionLabel="Chat on WhatsApp"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <MobileActionBar />
    </div>
  );
}
