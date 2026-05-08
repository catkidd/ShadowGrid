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
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">1. User Conduct</h2>
                        <p>
                            By accessing the ShadowGrid, you agree to utilize our hardware interfaces for authorized purposes only. Any attempt to reverse-engineer, exploit, scrape, or disrupt the grid architecture will result in immediate termination of access and potential legal action. Maintain the integrity of the network.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">2. Shipping and Delivery</h2>
                        <p>
                            Physical peripherals are dispatched globally from our automated fulfillment centers. Delivery timelines vary based on your geographic sector. ShadowGrid is not liable for delays caused by local customs protocols, carrier issues, or inter-sector transit anomalies. Once a package is handed to the carrier, risk of loss transfers to the buyer.
                        </p>
                    </section>
                </FadeInUp>

                <FadeInUp delay={300}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">3. Hardware Warranty</h2>
                        <p>
                            All tech products are backed by our standard 1-year operational warranty. This covers manufacturing defects and spontaneous component failure under normal operating conditions. It does NOT cover user-induced damage, improper modifications, water damage, or aesthetic wear and tear. Warranty claims must be submitted with original order credentials.
                        </p>
                    </section>
                </FadeInUp>
                
                <FadeInUp delay={400}>
                    <section>
                        <h2 className="text-xl font-bold text-neon mb-4 uppercase tracking-widest border-b border-white/10 pb-2">4. Limitations of Liability</h2>
                        <p>
                            ShadowGrid shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services, including but not limited to lost data, lost profits, or business interruption.
                        </p>
                    </section>
                </FadeInUp>
            </div>
        </main>
    );
};

export default TermsOfService;
