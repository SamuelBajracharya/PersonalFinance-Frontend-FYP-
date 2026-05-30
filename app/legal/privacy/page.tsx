export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen px-6 py-12 text-textmain">
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <h1 className="text-3xl font-semibold">Privacy Policy</h1>

                <section className="space-y-2 text-textsecondary">
                    <p>
                        This Privacy Policy defines exactly how our data pipeline collects,
                        processes, encrypts, and isolates your financial data when utilizing
                        this platform.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">1. Data Minimization and Ingestion Scope</h2>
                    <p>
                        We process transaction metadata, account balances, and raw banking
                        narration strings (including unstructured legacy text like Finacle
                        memos) exclusively to deliver our core features: automated budgeting,
                        predictive cash-flow charts, and gamified behavioral incentives. We
                        strictly enforce a policy of data minimization; your data is never
                        sold, leased, or shared with third-party advertising networks.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">2. On-Premise Local AI Processing</h2>
                    <p>
                        To preserve absolute data privacy, all generative suggestions and
                        chat actions are processed using an isolated, locally hosted inference
                        model running within our closed network perimeter. Your raw
                        transactional data is never transmitted to public external cloud LLM
                        providers, protecting your financial telemetry from third-party data
                        mining or corporate leaks.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">3. Advanced Data Security and Encryption</h2>
                    <p>
                        All user profiles and transaction records are encrypted at rest using
                        industry-standard cryptographic algorithms (such as AES-256) inside
                        our PostgreSQL data layer. Network handshakes between our frontend
                        interface and backend endpoints are secured via end-to-end transport
                        layer encryption.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">4. User Autonomy and Data Rights</h2>
                    <p>
                        In strict alignment with data protection best practices and local
                        privacy regulations, you maintain full control over your telemetry.
                        You retain the right to opt out of predictive AI analysis tracking
                        modules, inspect your stored financial profiles, or issue a definitive
                        data deletion request to purge your entire data record from our active
                        databases.
                    </p>
                </section>
            </div>
        </div>
    );
}
