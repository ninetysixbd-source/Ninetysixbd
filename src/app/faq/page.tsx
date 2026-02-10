import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
    const faqs = [
        {
            question: "Where is your brand based?",
            answer: "We are a Bangladesh-based clothing brand, serving customers nationwide.",
        },
        {
            question: "Do you deliver all over Bangladesh?",
            answer: "Yes, we offer delivery across all districts in Bangladesh through trusted courier services.",
        },
        {
            question: "How long does delivery take?",
            answer: (
                <div className="space-y-1">
                    <p>Inside Dhaka: 1–2 working days</p>
                    <p>Outside Dhaka: 2–3 working days</p>
                </div>
            ),
        },
        {
            question: "What are the delivery charges?",
            answer: (
                <div className="space-y-1">
                    <p>Inside Dhaka: 80tk.</p>
                    <p>Outside Dhaka: 130tk.</p>
                </div>
            ),
        },
        {
            question: "How can I place an order?",
            answer: (
                <div className="space-y-2">
                    <p>Orders can be placed through our website by selecting your preferred product, size, and delivery details.</p>
                    <p>For assistance, please contact our support team or directly message us on Facebook & WhatsApp.</p>
                </div>
            ),
        },
        {
            question: "What is your exchange policy?",
            answer: "We offer exchanges under the following conditions: The exchange request must be made within 48 hours of delivery. Product must be unused, unwashed, and with original tags intact. Also need the order details and picture.",
        },
        {
            question: "Do you accept returns?",
            answer: (
                <div className="space-y-1">
                    <p>Returns are accepted only in case of:</p>
                    <ul className="list-disc pl-5">
                        <li>Damaged products</li>
                        <li>Incorrect items sent</li>
                    </ul>
                </div>
            ),
        },
        {
            question: "What should I do if I receive a damaged or wrong product?",
            answer: "Please contact us within 24 hours of delivery with an unboxing video or clear images. We will arrange a replacement after verification.",
        },
        {
            question: "What payment methods are available?",
            answer: "We accept the following payment options: bKash, Nagad, credit/debit cards & Cash on Delivery (COD).",
        },
    ]

    return (
        <div className="container py-12 md:py-20 max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider">Frequently Asked Questions</h1>
                <p className="text-muted-foreground">
                    Find answers to common questions about our products, delivery, and policies.
                </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium text-lg">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
