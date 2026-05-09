import FadeInUp from '../components/FadeInUp';

const PrivacyPolicy = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-4xl flex-1">
            <FadeInUp>
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">Privacy Policy</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Last Updated: May 2026</p>
                </div>
            </FadeInUp>
            <div className="space-y-12 text-white/70 font-medium leading-relaxed">
                <FadeInUp delay={100}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">1. Data Collection & Usage</h2>
                        <p>
                            We collect personal information necessary to process your orders and manage your account. This includes your name, email address, shipping address, and order history. This data is used exclusively for order fulfillment, customer support, and, where permitted, marketing communications. We do not sell or trade your personal data with third parties for their marketing purposes.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">2. Information Security</h2>
                        <p>
                            ShadowGrid employs industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Our databases are encrypted and access is restricted to authorized personnel. While we strive to protect your personal information, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={300}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">3. Cookies & Tracking Technologies</h2>
                        <p>
                            We use cookies to maintain your session, remember cart items, and analyze site traffic. These technologies help us provide a consistent user experience and improve our service. You can manage your cookie preferences through your browser settings, although disabling them may limit site functionality.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={400}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">4. Third-Party Service Providers</h2>
                        <p>
                            We utilize verified third-party partners for payment processing (Stripe, PayPal) and shipping logistics. ShadowGrid does not store raw payment card data on our servers. All financial transactions are encrypted and handled in compliance with PCI-DSS standards by our payment providers.
                        </p>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
