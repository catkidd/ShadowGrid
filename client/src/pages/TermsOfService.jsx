import FadeInUp from '../components/FadeInUp';

const TermsOfService = () => {
    return (
        <main className="container mx-auto px-6 py-20 max-w-4xl flex-1">
            <FadeInUp>
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-4">Terms of Service</h1>
                    <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Effective Date: May 2026</p>
                </div>
            </FadeInUp>
            <div className="space-y-12 text-white/70 font-medium leading-relaxed">
                <FadeInUp delay={100}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">1. Use of Services</h2>
                        <p>
                            By accessing the ShadowGrid platform, you agree to use our services for lawful purposes only. Unauthorized use, including reverse-engineering, data scraping, or attempting to disrupt the site infrastructure, is strictly prohibited. Violation of these terms may result in account termination and legal action.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">2. Shipping & Risk of Loss</h2>
                        <p>
                            Products are shipped from our fulfillment centers to addresses globally. Delivery timelines are estimates and are not guaranteed. ShadowGrid is not responsible for delays caused by customs, carrier issues, or incorrect address information. Risk of loss and title for products pass to you upon delivery to the carrier.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={300}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">3. Limited Product Warranty</h2>
                        <p>
                            All hardware products include a standard 1-year limited warranty covering manufacturing defects and hardware failure under normal use. This warranty does not cover accidental damage, unauthorized modifications, exposure to liquids, or normal wear and tear. Warranty claims require a valid proof of purchase.
                        </p>
                    </section>
                </FadeInUp>
                
                <FadeInUp delay={400}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">4. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, ShadowGrid shall not be liable for any indirect, incidental, or consequential damages, including loss of profits, data, or business interruption, arising out of the use or inability to use our products or services.
                        </p>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default TermsOfService;
