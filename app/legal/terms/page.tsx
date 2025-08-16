// app/legal/terms/page.tsx

export default function TermsOfServicePage() {
  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Terms of Service</h1>
          <p className="mt-4 text-lg text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        {/* --- Content Section with Custom Styling --- */}
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">1. Acceptance of Terms</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              By accessing and using NETSira (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">2. User Accounts</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">3. User Content</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
            </p>
          </section>
          
          {/* Add other sections as needed following this pattern */}

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">6. Contact Us</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              If you have any questions about these Terms, please contact us at <a href="mailto:contact@netsira.com" className="text-blue-400 hover:underline">contact@netsira.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}