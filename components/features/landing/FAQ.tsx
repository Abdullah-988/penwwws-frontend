import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <>
      <section
        id="faq"
        className="flex flex-col justify-between gap-8 p-8 py-16 md:flex-row md:items-center md:px-16 lg:px-32"
      >
        <h1 className="font-jakarta text-5xl font-bold md:text-7xl">Q&A</h1>

        <Accordion className="border-b md:w-[500px]" type="single" collapsible>
          <AccordionItem value="item-1" className="border-b">
            <AccordionTrigger className="text-xl font-semibold">
              What is Penwwws?
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-7">
              Penwwws is an all-in-one platform to manage students, staff,
              classes, and school operations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-b">
            <AccordionTrigger className="text-xl font-semibold">
              Is it free?
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-7">
              Penwwws has a free plan to explore and get started.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-b">
            <AccordionTrigger className="text-xl font-semibold">
              Is it easy to use?
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-7">
              Penwwws is designed to be user-friendly and intuitive, making it
              easy for anyone to use.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-semibold">
              How secure is my data?
            </AccordionTrigger>
            <AccordionContent className="pb-4 pl-7">
              We use enterprise-grade encryption and comply with data protection
              regulations to ensure your information remains safe and private.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </>
  );
}
