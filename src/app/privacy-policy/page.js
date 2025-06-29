"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 pt-[100px] lg:pt-[120px] pb-16">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 text-center">
          Privacy Policy
        </h1>
        <p className="mb-6 text-gray-700 text-center">
          Last updated: June 2024
        </p>
        <section className="space-y-6 text-gray-800 text-base leading-relaxed">
          <p>
            <strong>KingCompiler</strong> is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website and use
            our services.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">
            Information We Collect
          </h2>
          <ul className="list-disc ml-6">
            <li>
              Personal identification information (Name, email address, phone
              number, etc.)
            </li>
            <li>Usage data (pages visited, time spent, etc.)</li>
            <li>Cookies and tracking technologies</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc ml-6">
            <li>To provide and maintain our services</li>
            <li>To improve user experience and our website</li>
            <li>To communicate with you about updates, offers, and support</li>
            <li>To comply with legal obligations</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-2">
            Information Sharing
          </h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share information with trusted partners who assist
            us in operating our website and conducting our business, as long as
            those parties agree to keep this information confidential.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">Your Rights</h2>
          <ul className="list-disc ml-6">
            <li>Access, update, or delete your personal information</li>
            <li>Opt out of marketing communications</li>
            <li>Request information about how your data is used</li>
          </ul>
        </section>
        <section className="space-y-6 text-gray-800 text-base leading-relaxed mt-12">
          <h2 className="text-2xl font-semibold mb-2">
            Refund & Cancellation Policy
          </h2>
          <ul className="list-disc ml-6">
            <li>
              Once you pay the fees for a course, your enrollment is confirmed.
            </li>
            <li>
              No refunds will be issued after the first class has been
              conducted, except in exceptional circumstances at the discretion
              of KingCompiler management.
            </li>
            <li>
              If you wish to cancel your enrollment before the first class,
              please contact us at least 24 hours in advance for a full refund.
            </li>
            <li>
              Refunds, if approved, will be processed within 7-10 business days
              to the original payment method.
            </li>
            <li>
              Missed classes due to student absence are not eligible for
              refunds, but we may offer make-up classes at our discretion.
            </li>
            <li>
              KingCompiler reserves the right to cancel or reschedule classes.
              In such cases, you will be offered a make-up class or a full
              refund for the cancelled session(s).
            </li>
            <li>
              For any questions or concerns regarding refunds or cancellations,
              please contact us at{" "}
              <span className="font-semibold">
                kingcompiler.official@gmail.com
              </span>
              .
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
            <br />
            <span className="font-semibold">
              kingcompiler.official@gmail.com
            </span>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
