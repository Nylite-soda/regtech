"use client";

import { useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  CreditCard,
  Lock,
  CheckCircle2,
  XCircle,
  Info,
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard as CardIcon,
  MapPin,
  Receipt,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { getItem } from "@/lib/utils";
import Script from "next/script";

interface Plan {
  name: "Basic" | "Standard" | "Premium";
  price: {
    monthly: number;
    quarterly: number;
    annual: number;
  };
  features: string[];
  description: string;
  icon: React.ReactElement;
  gradient: string;
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: {
      monthly: 0,
      quarterly: 0,
      annual: 0,
    },
    features: [
      "Access to basic company profiles",
      "Limited search results",
      "Basic filters",
      "Email support",
      "Monthly newsletter",
    ],
    description: "Perfect for individuals and small teams",
    icon: <Shield className="w-6 h-6" />,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Standard",
    price: {
      monthly: 79,
      quarterly: 213,
      annual: 799,
    },
    features: [
      "All Basic features",
      "Full company profiles",
      "Advanced search and filters",
      "Priority email support",
      "Weekly newsletter",
      "Saved searches",
      "Company favorites",
    ],
    description: "Ideal for growing businesses",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "Premium",
    price: {
      monthly: 112,
      quarterly: 302,
      annual: 1132,
    },
    features: [
      "All Standard features",
      "API access",
      "Custom reports",
      "Dedicated support",
      "Daily newsletter",
      "Market insights",
      "Competitor analysis",
    ],
    description: "For enterprise-level needs",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-orange-500 to-red-500",
  },
];

const paymentPlanIds: Record<string, Record<string, number>> = {
  Standard: {
    monthly: 140582,
    quarterly: 1005,
    annual: 1006,
  },
  Premium: {
    monthly: 140583,
    quarterly: 1008,
    annual: 1009,
  },
};

interface CheckoutForm {
  plan: Plan["name"];
  billingCycle: "monthly" | "quarterly" | "annual";
  name: string;
  email: string;
  phone: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CheckoutPage() {
  const [step, setStep] = useState<"plan" | "review" | "confirmation">("plan");
  const [selectedCycle, setSelectedCycle] = useState<
    "monthly" | "quarterly" | "annual"
  >("monthly");
  const [form, setForm] = useState<CheckoutForm>({
    plan: "Standard",
    billingCycle: "monthly",
    name: "",
    email: "",
    phone: "",
  });

  const selectedPlan = plans.find((p) => p.name === form.plan)!;
  const price = selectedPlan.price[form.billingCycle];
  const paymentPlanId = paymentPlanIds[form.plan][form.billingCycle];

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: Date.now().toString(),
    amount: price,
    currency: "USD",
    payment_options: "card, mobilemoney, banktransfer, ussd",
    customer: {
      email: form.email,
      phone_number: form.phone,
      name: form.name,
    },
    customizations: {
      title: `${form.plan} Plan Subscription`,
      description: `${form.billingCycle} subscription to ${form.plan} plan`,
      logo: "/images/horizon-logo.png",
    },
    payment_plan: paymentPlanId.toString(),
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePlanSelect = (plan: Plan["name"]) => {
    setForm({ ...form, plan, billingCycle: selectedCycle });
    setStep("review");
  };

  const handlePayment = () => {
    handleFlutterPayment({
      callback: (response) => {
        if (response.status === "successful") {
          setStep("confirmation");
        }
        closePaymentModal();
      },
      onClose: () => {},
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b dark:bg-gradient-to-br dark:from-gray-900 dark:to-black from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto mt-[70px] px-4 lg:px-14 py-16">
        <Script
          src="https://checkout.flutterwave.com/v3.js"
          strategy="beforeInteractive"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade or downgrade at any
            time.
          </p>
        </motion.div>

        {step === "plan" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-8"
          >
            <div className="flex justify-center gap-4 p-1 bg-gray-100 rounded-lg w-fit mx-auto mb-12">
              {(["monthly", "quarterly", "annual"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={clsx(
                    "px-6 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    selectedCycle === cycle
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02 }}
                  className={clsx(
                    "relative bg-white rounded-2xl shadow-xl overflow-hidden",
                    plan.name === "Standard" && "ring-2 ring-[#AD0000]",
                    plan.name !== "Standard" && "scale-[0.9]"
                  )}
                >
                  {plan.name === "Standard" && (
                    <div className="absolute top-0 right-0 bg-[#AD0000] text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                      Popular
                    </div>
                  )}
                  <div
                    className={clsx(
                      "px-6 py-4 bg-gradient-to-r text-white",
                      plan.gradient
                    )}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {plan.icon}
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        ${plan.price[selectedCycle]}
                      </span>
                      <span className="opacity-80">/{selectedCycle}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-gray-700"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePlanSelect(plan.name)}
                      className={clsx(
                        "w-full py-3 rounded-lg text-white font-medium transition-all duration-200",
                        plan.price[selectedCycle] === 0
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600"
                      )}
                    >
                      {plan.price[selectedCycle] === 0
                        ? "Start Free"
                        : "Select Plan"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "review" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Complete Your Order</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD0000] focus:border-[#AD0000] transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD0000] focus:border-[#AD0000] transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AD0000] focus:border-[#AD0000] transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {form.plan} Plan
                      </h3>
                      <p className="text-sm text-gray-600">
                        {form.billingCycle.charAt(0).toUpperCase() +
                          form.billingCycle.slice(1)}{" "}
                        billing
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${price}
                      </p>
                      <p className="text-sm text-gray-600">
                        per {form.billingCycle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("plan")}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={!form.name || !form.email || !form.phone}
                    className="flex-1 py-3 bg-gradient-to-r from-red-800 to-red-500 hover:from-red-600 hover:to-red-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    Complete Purchase
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "confirmation" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome Aboard!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your {form.plan} plan is now active. Get ready to explore all
                the amazing features!
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Building2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">{form.plan}</p>
                  <p className="text-sm text-gray-600">Plan</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">
                    {form.billingCycle.charAt(0).toUpperCase() +
                      form.billingCycle.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">Billing</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Receipt className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">${price}</p>
                  <p className="text-sm text-gray-600">Amount</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 bg-gradient-to-r from-red-800 to-red-500 hover:from-red-600 hover:to-red-600 text-white rounded-lg transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
