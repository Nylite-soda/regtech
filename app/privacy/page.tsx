import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div
      className={`min-h-screen dark:bg-gray-900 dark:text-white bg-white text-gray-900 transition-colors duration-300`}
    >
      <Navbar />
      {/* <header className={`p-6 border-b dark:border-gray-700 border-gray-200`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/images/horizon-logo.png"
              alt="Logo"
              width={20}
              height={20}
            />
            <h1 className="text-2xl font-bold text-[#AD0000]">
              RegTech Horizon
            </h1>
          </div>
        </div>
      </header> */}

      <main className="container mx-auto py-8 px-4 md:px-6 max-w-4xl mt-[70px]">
        <div className={`p-6 rounded-lg shadow-lg dark:bg-gray-800 bg-white`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#AD0000]">
              Privacy Policy
            </h1>
            <p className={`text-sm dark:text-gray-400 text-gray-600`}>
              Last Updated: May 17, 2025
            </p>
          </div>

          <div className="prose max-w-none lg:prose-lg text-g">
            <p>
              Welcome to RegTech Horizon, a digital platform managed and
              operated by RegTech Africa. Your privacy and the protection of
              your personal data are of utmost importance to us. This Privacy
              Policy explains how we collect, use, store, protect, and disclose
              your information when you visit, register, or use our services via
              [app.regtechhorizon.com] or any related subdomains, web pages, or
              services (collectively referred to as the "Platform").
            </p>

            <p>
              By using our Platform, you consent to the terms outlined in this
              Privacy Policy. If you do not agree with any part of this policy,
              you are advised not to use our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              1. Who We Are
            </h2>
            <p>
              RegTech Horizon is a platform developed by RegTech Africa to
              enable the discovery, profiling, and connection of RegTech
              companies across Africa. The Platform allows users to search,
              register, and interact with company profiles, manage
              subscriptions, and explore the evolving landscape of regulatory
              technology.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              2. Scope of This Privacy Policy
            </h2>
            <p>
              This Privacy Policy applies to all visitors, registered users,
              premium subscribers, company representatives, and administrators
              who access or interact with the Platform through any device. It
              governs how we handle both personal and non-personal information,
              whether collected actively (via forms) or passively (via cookies
              and analytics tools).
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              3. Information We Collect
            </h2>
            <p>
              We collect several categories of data, either directly from you,
              from your use of the Platform, or through third-party tools.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              3.1 Information You Provide to Us
            </h3>
            <p>This includes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                User Account Information: Name, email address, password
                (hashed), phone number, and country.
              </li>
              <li>
                Company Profile Information: Company name, logo, website, year
                founded, industry/niche, country, number of employees, and
                services offered.
              </li>
              <li>
                Billing and Payment Data: While we do not store your financial
                information, we may collect transaction IDs, subscription plan
                details, and billing references from our payment processor,
                Flutterwave.
              </li>
              <li>
                Support and Communication Records: Emails, tickets, and in-app
                feedback submitted by you.
              </li>
              <li>
                Content Submissions: Any files, images, or descriptions you
                upload as part of your profile or public contributions.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              3.2 Information We Collect Automatically
            </h3>
            <p>When you use our Platform, we automatically collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Device Information: IP address, browser type, operating system,
                language preferences, time zone.
              </li>
              <li>
                Usage Data: Click paths, session duration, page visits, feature
                use (e.g., filter selections, search queries).
              </li>
              <li>
                Cookies and Local Storage: We store data in your browser to
                remember login sessions, saved filters, UI preferences, and for
                authentication.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              4. How We Use Your Information
            </h2>
            <p>We process your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create and manage your account</li>
              <li>
                Deliver core services such as company discovery, filtering, and
                subscriptions
              </li>
              <li>
                Manage user roles (Visitor, Registered User, Premium User,
                Admin) and control access to resources
              </li>
              <li>
                Enable company representatives to manage their public profiles
                and update business details
              </li>
              <li>Facilitate secure payments and subscription tracking</li>
              <li>
                Send you important notifications (e.g., payment receipts,
                profile completion reminders, system announcements)
              </li>
              <li>
                Maintain Platform security and prevent unauthorized access
              </li>
              <li>
                Improve our services through analytics and feature usage
                insights
              </li>
              <li>
                Enforce terms of use and respond to legal requests or disputes
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              5. Legal Grounds for Processing Your Information
            </h2>
            <p>
              In compliance with applicable data protection laws, our legal
              basis for processing your information may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Consent: For account creation, newsletter subscriptions, and
                certain cookies
              </li>
              <li>
                Contractual Obligation: When providing services you've requested
                (e.g., paid subscriptions)
              </li>
              <li>
                Legal Compliance: For regulatory reporting and fraud prevention
              </li>
              <li>
                Legitimate Interests: For internal analytics, product
                improvement, and ensuring service integrity
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              6. Sharing of Your Information
            </h2>
            <p>We do not sell your personal data.</p>
            <p>
              However, we may share your data in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              6.1 With Trusted Service Providers
            </h3>
            <p>We share data with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Flutterwave (payment processor)</li>
              <li>
                Email service providers (for transactional or alert emails)
              </li>
              <li>
                Cloud infrastructure providers (hosting and database management)
              </li>
              <li>
                Analytics platforms (e.g., Google Analytics for usage trends)
              </li>
            </ul>
            <p>
              All providers are bound by strict confidentiality and data
              protection agreements.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              6.2 With Internal Staff
            </h3>
            <p>
              Your information may be accessed by authorized team members or
              administrators of RegTech Africa solely for the purposes of
              support, verification, moderation, and business continuity.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              6.3 For Legal Purposes
            </h3>
            <p>We may disclose your information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                When required by law, court orders, or government regulations
              </li>
              <li>
                To enforce our Terms of Service or investigate suspected
                violations
              </li>
              <li>To detect and prevent fraud or other illegal activity</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              7. How We Protect Your Information
            </h2>
            <p>We maintain industry-standard security practices, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                SSL Encryption: All data transmitted via our site is encrypted
                using HTTPS.
              </li>
              <li>
                Hashed Passwords: User passwords are encrypted and never stored
                in plain text.
              </li>
              <li>
                Role-Based Access Control (RBAC): Users only access data and
                features permitted by their role.
              </li>
              <li>
                Firewall and Access Controls: Access to our servers is
                restricted and monitored.
              </li>
              <li>
                Regular Monitoring: We perform regular scans and security
                reviews to detect potential vulnerabilities.
              </li>
            </ul>
            <p>
              Despite our efforts, no system can guarantee 100% protection. You
              are responsible for keeping your login credentials secure and
              reporting any unauthorized access to us.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              8. Your Data Rights
            </h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access the data we hold about you</li>
              <li>Correct inaccurate or outdated information</li>
              <li>
                Delete your personal information ("Right to be Forgotten")
              </li>
              <li>Withdraw consent at any time</li>
              <li>Export your data in a machine-readable format</li>
              <li>
                Object to the processing of your information in certain
                situations
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at
              info@regtechhorizon.com. We will respond within a reasonable time
              and in accordance with applicable laws.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              9. Retention of Data
            </h2>
            <p>We will retain your information for as long as:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your account remains active</li>
              <li>Required to provide services</li>
              <li>
                Necessary to comply with legal obligations (e.g., payment
                records)
              </li>
              <li>Needed to enforce agreements or resolve disputes</li>
            </ul>
            <p>
              Inactive accounts may be archived, anonymized, or deleted after a
              specific period of inactivity.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              10. Cookies and Similar Technologies
            </h2>
            <p>
              We use cookies and browser storage to enhance your experience.
              These are used to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Keep you logged in between sessions</li>
              <li>Save your preferences and filters</li>
              <li>Measure traffic and improve functionality</li>
            </ul>
            <p>
              You can modify your cookie settings through your browser. Blocking
              essential cookies may affect Platform usability.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              11. Third-Party Links
            </h2>
            <p>
              Our Platform may contain links to third-party websites (e.g.,
              partner company pages or payment portals). We are not responsible
              for the privacy practices or content of external websites. We
              recommend reviewing their privacy policies before submitting data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              12. Children's Privacy
            </h2>
            <p>
              Our services are not intended for individuals under the age of 16.
              We do not knowingly collect personal data from minors. If we
              become aware of such data, we will delete it promptly.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              13. International Data Transfers
            </h2>
            <p>
              Our infrastructure may be hosted in data centers outside your home
              country. By using the Platform, you agree that your data may be
              transferred, stored, or processed in other regions with different
              privacy laws. We take appropriate steps to ensure your data is
              handled securely.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              14. Updates to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. When we do, the
              "Last Updated" date will be changed, and users may be notified via
              email or dashboard announcements for major updates.
            </p>
            <p>
              We encourage users to review this page regularly to stay informed.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              15. Contact Us
            </h2>
            <p>
              For questions, concerns, or data-related requests, contact us:
            </p>
            <address className="not-italic mt-2">
              <strong>RegTech Horizon</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:info@regtechhorizon.com"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                info@regtechhorizon.com
              </a>
              <br />
              {/* Website:{" "}
              <a
                href="https://app.regtechhorizon.com"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://app.regtechhorizon.com
              </a> */}
            </address>
            <p className="mt-4">
              We are committed to protecting your rights and ensuring full
              transparency in how we handle your data.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/terms" passHref>
            <button
              className={`px-6 py-2 rounded font-semibold dark:hover:bg-red-700 hover:bg-red-800 text-white transition-colors bg-[#AD0000] dark:bg-[#8A0000]`}
            >
              View Terms of Service
            </button>
          </Link>
        </div>
      </main>

      {/* <footer
        className={`py-6 mt-16 border-t dark:border-gray-700 dark:bg-gray-900 border-gray-200 bg-gray-50`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className={`text-sm dark:text-gray-400 text-gray-600`}>
                &copy; {new Date().getFullYear()} RegTech Horizon. All rights
                reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className={`text-sm dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className={`text-sm dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className={`text-sm dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900`}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer> */}
      <Footer />
    </div>
  );
}
