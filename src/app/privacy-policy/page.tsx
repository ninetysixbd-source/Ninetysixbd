export default function PrivacyPolicyPage() {
    return (
        <div className="container py-12 md:py-20 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider">Privacy & Policy</h1>
                <p className="text-muted-foreground">
                    At Ninetysix Lifestyle, we respect your privacy and are committed to protecting your personal information.
                </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                <section>
                    <p className="text-muted-foreground">
                        We collect data when you visit our website or make a purchase to process orders, improve your shopping experience, and provide customer support.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                    <p className="text-muted-foreground mb-4">We may collect the following types of information:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, billing and shipping address, and payment details when you place an order.</li>
                        <li><strong>Account Information:</strong> Login details if you create an account on our website.</li>
                        <li><strong>Cookies & Tracking Technologies:</strong> Used to enhance user experience, analyze website traffic, and improve our services.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                    <p className="text-muted-foreground mb-4">We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Process and fulfill orders</li>
                        <li>Communicate order updates and customer support responses</li>
                        <li>Send promotional emails or offers (you may opt out at any time)</li>
                        <li>Prevent fraud and ensure website security</li>
                        <li>Improve our products, services, and website performance</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">3. Sharing Your Information</h2>
                    <p className="text-muted-foreground mb-4">
                        We do not sell or rent your personal information. We may share your data only with trusted third parties such as:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Payment processors</li>
                        <li>Shipping and delivery partners</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                        These partners are required to protect your information and use it only to provide services on our behalf.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                    <p className="text-muted-foreground">
                        We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, loss, or misuse. However, no online transmission or storage system can be guaranteed 100% secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
                    <p className="text-muted-foreground">
                        Our website uses cookies to personalize your experience and analyze traffic. You can choose to disable cookies through your browser settings, but some features of the website may not function properly.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                    <p className="text-muted-foreground mb-4">Depending on your location, you may have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Access, update, or delete your personal information</li>
                        <li>Opt out of marketing communications</li>
                        <li>Request information about how your data is used</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                        To exercise these rights, please contact us using the details below.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">7. Third-Party Links</h2>
                    <p className="text-muted-foreground">
                        Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.
                    </p>
                </section>
            </div>
        </div>
    )
}
