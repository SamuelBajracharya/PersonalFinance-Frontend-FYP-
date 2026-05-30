export default function TermsPage() {
    return (
        <div className="min-h-screen px-6 py-12 text-textmain">
            <div className="mx-auto w-full max-w-3xl space-y-6">
                <h1 className="text-3xl font-semibold">Terms and Conditions</h1>

                <section className="space-y-2 text-textsecondary">
                    <p>
                        By creating an account, syncing a financial credential, or interacting
                        with this application, you explicitly agree to be bound by these Terms
                        and Conditions.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">1. User Account Responsibility</h2>
                    <p>
                        You are solely responsible for maintaining the strict confidentiality
                        of your authentication credentials. You agree to provide accurate
                        financial transaction profiles and accept full liability for all actions
                        performed under your account session.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">2. AI Feature Execution and Simulation</h2>
                    <p>
                        The application leverages localized Artificial Intelligence models and
                        predictive analytics (including XGBoost, LSTM, and Ollama frameworks)
                        to calculate budget forecasts, project risk vectors, and simulate
                        financial "What-If" scenarios. These outputs are probabilistic
                        behavioral recommendations and data-driven insights. They do not
                        constitute certified professional, legal, or institutional financial
                        advice.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">3. Automated Budget Compliance and Gamification Integrity</h2>
                    <p>
                        The system evaluates user saving parameters based on real-world
                        consumption variances against historical baselines. Any attempt to
                        artificially manipulate budget thresholds, input fraudulent manual
                        ledgers, or exploit gamification rewards milestones will result in the
                        forfeiture of reward tracking, virtual experience points (XP), and
                        partner voucher distribution.
                    </p>
                </section>

                <section className="space-y-2 text-textsecondary">
                    <h2 className="text-xl font-semibold text-textmain">4. Service Modifications</h2>
                    <p>
                        We reserve the right to periodically update these Terms to reflect
                        technical upgrades or regulatory shifts in the local financial
                        technology ecosystem. Continued utilization of the system following
                        an update constitutes definitive acceptance of the revised Terms.
                    </p>
                </section>
            </div>
        </div>
    );
}
