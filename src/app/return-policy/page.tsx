export default function ReturnPolicyPage() {
    return (
        <div className="container py-12 md:py-20 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider">Return & Exchange Policy</h1>
                <p className="text-muted-foreground">
                    At Ninetysix Lifestyle, customer satisfaction is our priority. If you are not fully satisfied with your purchase, we’re here to help.
                </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <p className="text-muted-foreground italic border-l-4 border-primary pl-4">
                    Please read our Return & Exchange Policy carefully before initiating a request.
                </p>

                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Eligibility for Returns & Exchanges</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Items must be returned or exchanged within <strong>[2-3] days</strong> of delivery.</li>
                        <li>Products must be unused, unworn, unwashed, and in their original condition with all tags and packaging intact.</li>
                        <li>Items purchased on sale, clearance, or promotional offers may not be eligible for return or exchange unless stated otherwise.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">2. Non-Returnable Items</h2>
                    <p className="text-muted-foreground mb-2">The following items cannot be returned or exchanged:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Innerwear, masks, or personal-use items (for hygiene reasons)</li>
                        <li>Customized or made-to-order products</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">3. Return Process</h2>
                    <p className="text-muted-foreground mb-4">To initiate a return or exchange:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Contact our customer support with your order number and reason for return, or directly message us on Messenger/WhatsApp.</li>
                        <li>Once approved, you will receive instructions on how to send the item back.</li>
                        <li>Customers are responsible for return shipping costs unless the item is defective or incorrect.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">4. Exchanges</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Exchanges are subject to product availability.</li>
                        <li>If the requested replacement is unavailable, you may choose a refund or store credit.</li>
                        <li>Exchange shipping times may vary depending on your location.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">5. Damaged or Incorrect Items</h2>
                    <p className="text-muted-foreground">
                        If you receive a damaged, defective, or incorrect product, please contact us within <strong>48 hours</strong> of delivery with photos or videos as proof. We will arrange a replacement or refund at no additional cost.
                    </p>
                </section>
            </div>
        </div>
    )
}
