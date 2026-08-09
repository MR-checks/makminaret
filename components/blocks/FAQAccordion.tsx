import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface FAQAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  faqs?: FAQItem[];
}

const defaultFaqs: FAQItem[] = [
  {
    question: "Do I need to speak Turkish to study in Türkiye?",
    answer:
      "No. Many of our partner universities offer complete degree programs in 100% English. If you choose a Turkish-medium program, you will need to complete a one-year TÖMER (Turkish language) prep course before starting your degree.",
  },
  {
    question: "Are there scholarships available for African students?",
    answer:
      "Yes. While the prestigious Türkiye Bursları is highly competitive, Minaret negotiates guaranteed partial tuition discounts (often 25-50%) at our private partner universities specifically for students applying from Ghana and Nigeria.",
  },
  {
    question: "Can I work while studying?",
    answer:
      "International students in Türkiye are legally permitted to work part-time (up to 24 hours per week) after completing their first year of study. However, we recommend securing enough funding for your first year before arriving.",
  },
];

const FAQAccordion = React.forwardRef<HTMLDivElement, FAQAccordionProps>(
  ({ className, faqs = defaultFaqs, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <Accordion type="single" className="w-full border-t border-[var(--rule)]">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-[1.125rem] text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[1rem] leading-[1.65]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }
);
FAQAccordion.displayName = "FAQAccordion";

export { FAQAccordion };
