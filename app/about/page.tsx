// app/about/page.tsx

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | NETSira',
  description: 'Learn more about the mission and vision of NETSira.',
};

export default function AboutUsPage() {
  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">About NETSira</h1>
            <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto">
                Our mission is to create a transparent and trustworthy online ecosystem through community-driven reviews.
            </p>
        </div>
        
        {/* --- Content Section with Custom Styling --- */}
        <div className="space-y-10">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Our Vision</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              In an internet cluttered with information, finding reliable websites can be a challenge. NETSira was founded on the principle that real user experiences are the most valuable metric for judging a website's quality, trustworthiness, and utility. We aim to be the definitive platform where users can discover new sites and share their honest feedback, helping others make more informed decisions online.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">How It Works</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              Our platform is built on the power of community. Any registered user can submit a review for a website based on several key criteria:
            </p>
            <ul className="mt-4 space-y-2 text-lg">
                <li><strong className="font-semibold text-slate-200">Design:</strong> The visual appeal and aesthetic quality of the site.</li>
                <li><strong className="font-semibold text-slate-200">Usability:</strong> How easy and intuitive the site is to navigate and use.</li>
                <li><strong className="font-semibold text-slate-200">Content:</strong> The quality, accuracy, and value of the information provided.</li>
                <li><strong className="font-semibold text-slate-200">Reliability:</strong> The performance, security, and trustworthiness of the site.</li>
            </ul>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              By aggregating these scores, we provide a comprehensive overall rating that gives a clear picture of a website's standing in the community.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Join Us</h2>
            <p className="text-lg leading-relaxed text-slate-300">
              Whether you're here to find your next favorite website or to share your own expertise, we welcome you to the NETSira community. Your voice matters, and together, we can build a more transparent web for everyone.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}