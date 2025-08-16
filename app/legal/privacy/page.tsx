// app/legal/privacy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-4 text-lg text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        {/* --- Content Section with Custom Styling --- */}
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">1. Information We Collect</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              We collect information that you provide directly to us when you create an account. This includes your username and email address. We do not collect any personal information that you do not voluntarily provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">2. How We Use Your Information</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              We use the information we collect to operate, maintain, and provide the features and functionality of the Service, and to communicate with you, such as to send you Service-related notices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">3. Sharing of Your Information</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              We will not rent or sell your information to third parties. Your username is public and visible to other users of the Service in connection with reviews you post. Your email address is kept private.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">4. Data Security</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              We use commercially reasonable safeguards to help keep the information collected through the Service secure and take reasonable steps to verify your identity before granting you access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">5. Changes to Our Privacy Policy</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              We may modify or update this Privacy Policy from time to time to reflect the changes in our business and practices, and so you should review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">6. Contact Us</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@netsira.com" className="text-blue-400 hover:underline">contact@netsira.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}