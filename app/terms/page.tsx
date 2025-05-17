import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div
      className={`min-h-screen dark:bg-gray-900 dark:text-white bg-white text-gray-900 transition-colors duration-300`}
    >
      <Navbar />

      <main className="container mx-auto py-8 px-4 md:px-6 max-w-4xl mt-[70px]">
        <div className={`p-6 rounded-lg shadow-lg dark:bg-gray-800 bg-white`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#AD0000]">
              Terms and Conditions
            </h1>
            <p className={`text-sm dark:text-gray-400 text-gray-600`}>
              Last Updated: May 17, 2025
            </p>
          </div>

          <div className="prose max-w-none lg:prose-lg">
            <p>
              Welcome to RegTech Horizon, an online regulatory technology
              (RegTech) intelligence and company discovery platform operated by
              RegTech Africa. These Terms and Conditions ("Terms") govern your
              access to and use of the services available at
              https://app.regtechhorizon.com, including all subdomains, APIs,
              content, features, and services (the "Platform").
            </p>

            <p>
              By using this Platform, you agree to comply with and be legally
              bound by these Terms. If you do not agree with any of these Terms,
              you must discontinue the use of this Platform immediately.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              1. Acceptance of Terms
            </h2>
            <p>By accessing or using this Platform, you acknowledge that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                You have read, understood, and agreed to be bound by these
                Terms.
              </li>
              <li>
                You are at least 16 years of age or of legal age in your
                jurisdiction to form a binding contract.
              </li>
              <li>
                You have the legal authority to accept these Terms on behalf of
                yourself or your organization.
              </li>
              <li>
                These Terms apply to all types of users, including Visitors,
                Registered Users, Premium Subscribers, Company Representatives,
                and Administrators.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              2. Use License and Platform Access
            </h2>
            <p>
              Subject to your compliance with these Terms, RegTech Africa grants
              you a limited, non-exclusive, non-transferable, revocable license
              to access and use the Platform for your personal or
              business-related informational purposes.
            </p>
            <p>You may:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                View, explore, and interact with company listings and platform
                features.
              </li>
              <li>
                Use the search, filtering, and company profile functionality as
                intended.
              </li>
              <li>
                Register an account and manage your company or user dashboard
                (as applicable).
              </li>
            </ul>
            <p>You may not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Republish, reproduce, duplicate, copy, sell, or commercially
                exploit any content from the Platform without express written
                permission.
              </li>
              <li>
                Reverse-engineer, tamper with, or modify the underlying software
                code or interface.
              </li>
              <li>
                Use automated tools (e.g., bots, scrapers) to extract data from
                the Platform.
              </li>
            </ul>
            <p>
              Violation of this section may result in the suspension or
              termination of your account, and may also trigger legal
              proceedings.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              3. User Accounts and Responsibilities
            </h2>
            <p>
              To access core features of the Platform (e.g., managing a company,
              subscribing to a plan), you must create an account.
            </p>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Provide accurate, complete, and updated registration details.
              </li>
              <li>Maintain the confidentiality of your login credentials.</li>
              <li>
                Not impersonate another person or use someone else's
                credentials.
              </li>
              <li>
                Accept full responsibility for all activities that occur under
                your account.
              </li>
            </ul>
            <p>
              You are solely responsible for ensuring that your use of the
              Platform complies with applicable laws and regulations.
            </p>
            <p>RegTech Africa reserves the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Suspend or terminate accounts that violate these Terms.</li>
              <li>
                Monitor account activity to ensure compliance and detect
                suspicious behavior.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              4. Subscription Plans and Payments
            </h2>
            <p>
              The Platform offers both free and paid tiers of access, with
              different features and levels of visibility depending on your
              selected subscription.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              4.1 Types of Plans
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Free Users: Can explore basic listings and filters.</li>
              <li>
                Premium Users: Have access to advanced features such as detailed
                analytics, expanded filters, and early-access content.
              </li>
              <li>
                Company Accounts: May register and manage public profiles;
                visibility may vary by plan level.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              4.2 Payment Terms
            </h3>
            <p>All paid plans require:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Valid payment information, processed via Flutterwave.</li>
              <li>Agreement to pay the stated fees for the selected plan.</li>
              <li>
                Authorization for recurring billing if on a subscription cycle.
              </li>
            </ul>
            <p>
              All fees are stated in Nigerian Naira (₦) or US Dollars ($), as
              applicable, and are non-refundable except where explicitly stated.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">
              4.3 Invoicing and Records
            </h3>
            <p>
              You will receive a receipt or invoice for each successful payment,
              accessible through your account dashboard. RegTech Horizon does
              not store sensitive card data—this is securely handled by
              Flutterwave.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              5. Company Listing Rules
            </h2>
            <p>
              Registered companies on the Platform may create and manage public
              company profiles. You agree that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                All information submitted (e.g., name, website, description,
                contact info) must be accurate, up to date, and lawfully
                presented.
              </li>
              <li>
                Logos, service categories, and tags must not infringe on
                third-party intellectual property.
              </li>
              <li>You will not impersonate or submit fake companies.</li>
              <li>Listings may be reviewed and approved before publication.</li>
            </ul>
            <p>
              We reserve the right to reject, edit, remove, or suspend any
              company profile that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violates these Terms.</li>
              <li>Contains false, harmful, or misleading information.</li>
              <li>Engages in spammy or deceptive practices.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              6. Privacy and Data Use
            </h2>
            <p>
              All use of personal data on RegTech Horizon is governed by our
              Privacy Policy, which outlines how we collect, use, share, and
              protect your data.
            </p>
            <p>
              By using this Platform, you consent to the processing of your data
              as described in the Privacy Policy.
            </p>
            <p>Key Highlights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                We collect user and company data to provide personalized
                services.
              </li>
              <li>We do not sell your data to third parties.</li>
              <li>
                You may request deletion or correction of your data under
                applicable laws.
              </li>
            </ul>
            <p>
              You can view the full Privacy Policy at{" "}
              <Link
                href="/privacy"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                https://app.regtechhorizon.com/privacy
              </Link>
              .
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              7. Acceptable Use Policy
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Platform for unlawful purposes.</li>
              <li>Upload content that is defamatory, hateful, or obscene.</li>
              <li>
                Attempt to gain unauthorized access to restricted features or
                accounts.
              </li>
              <li>
                Circumvent or disable security features, rate limits, or session
                validations.
              </li>
              <li>
                Use the Platform to solicit, spam, or conduct phishing or scam
                activities.
              </li>
            </ul>
            <p>Violation of this policy may lead to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Suspension or termination of your account.</li>
              <li>Legal investigation and/or prosecution.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              8. Intellectual Property Rights
            </h2>
            <p>
              All content, design elements, graphics, software, and
              documentation associated with RegTech Horizon are the exclusive
              property of RegTech Africa or its licensors.
            </p>
            <p>This includes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Brand assets, platform logos, and names.</li>
              <li>Codebases, user interface designs, and database schemas.</li>
              <li>
                Company-generated content submitted through the platform remains
                your property, but you grant us a license to use it to operate
                the service.
              </li>
            </ul>
            <p>
              You may not copy, redistribute, or otherwise exploit our
              intellectual property without prior written permission.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              9. Third-Party Services
            </h2>
            <p>We integrate and rely on third-party providers such as:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Flutterwave – for payment processing</li>
              <li>Google Analytics – for tracking and analytics</li>
              <li>Email APIs – for system-generated communication</li>
            </ul>
            <p>
              These services have their own Terms of Use and Privacy Policies.
              RegTech Horizon is not responsible for third-party failures, but
              we aim to use secure, reputable providers only.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              10. Disclaimers
            </h2>
            <p>
              We provide the Platform "as is" and "as available." To the fullest
              extent permitted by law, we disclaim all warranties of any kind,
              whether express or implied.
            </p>
            <p>We do not warrant that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>The Platform will be uninterrupted or error-free.</li>
              <li>
                The data or listings will be accurate, complete, or current at
                all times.
              </li>
              <li>
                The Platform will meet your specific needs or expectations.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              11. Limitation of Liability
            </h2>
            <p>
              In no event shall RegTech Africa, its partners, staff, or
              affiliates be liable for any direct, indirect, incidental,
              special, punitive, or consequential damages, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Business loss or disruption</li>
              <li>Data loss or corruption</li>
              <li>Financial losses due to subscription issues</li>
              <li>Inability to access the Platform or features</li>
            </ul>
            <p>
              Your sole remedy for dissatisfaction with the Platform is to stop
              using the services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              12. Revisions and Updates
            </h2>
            <p>
              The information presented on the Platform may include errors,
              outdated content, or missing features. We do not guarantee full
              accuracy at all times and may revise features or correct issues
              without prior notice.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              13. Modifications to Terms
            </h2>
            <p>
              We may revise these Terms at any time, for any reason. When we do,
              we will update the "Last Updated" date. You will be deemed to have
              accepted the changes by continuing to use the Platform after such
              revisions are posted.
            </p>
            <p>You are encouraged to review these Terms regularly.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              14. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the Federal Republic of Nigeria.
            </p>
            <p>
              You consent to the exclusive jurisdiction of Nigerian courts in
              resolving any disputes arising from these Terms or your use of the
              Platform.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              15. Termination of Access
            </h2>
            <p>
              We reserve the right to terminate or suspend your access to the
              Platform without notice if you:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Breach any part of these Terms</li>
              <li>Fail to pay subscription fees</li>
              <li>
                Misuse the Platform or act in a fraudulent or illegal manner
              </li>
            </ul>
            <p>Upon termination:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your access to paid features will end</li>
              <li>
                We may delete or archive your company listing and account data
              </li>
              <li>
                You will not be entitled to any refund unless explicitly stated
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              16. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless RegTech Africa,
              its affiliates, and its personnel from and against all losses,
              liabilities, damages, claims, costs, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>
                Your violation of any rights of another party, including
                intellectual property
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-[#AD0000]">
              17. Contact Information
            </h2>
            <p>
              If you have any questions, feedback, or legal concerns regarding
              these Terms, you may contact us using the details below:
            </p>
            <address className="not-italic mt-2">
              <strong>RegTech Africa</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:info@regtechhorizon.com"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                info@regtechhorizon.com
              </a>
              <br />
            </address>
            <p className="mt-4">
              We are committed to maintaining a fair and transparent platform
              that respects our users' rights while delivering valuable services
              to the RegTech community.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/privacy" passHref>
            <button
              className={`px-6 py-2 rounded font-semibold dark:hover:bg-red-700 hover:bg-red-800 text-white transition-colors bg-[#AD0000] dark:bg-[#8A0000]`}
            >
              View Privacy Policy
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
