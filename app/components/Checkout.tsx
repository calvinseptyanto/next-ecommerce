"use client";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import OrderAnimation from "./OrderAnimation";
import { motion } from "framer-motion";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function Checkout() {
  const cartStore = useCartStore();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    //Create a paymentIntent as soon as the page loads up
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          return router.push("/api/auth/signin");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
        cartStore.setPaymentIntent(data.paymentIntent.id);
      });
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      labels: "floating",
      theme: "flat",
      variables: {
        fontFamily: ' "Gill Sans", sans-serif',
        fontLineHeight: "1.5",
        borderRadius: "10px",
        colorBackground: "#F6F8FA",
        colorPrimaryText: "#262626",
      },
      rules: {
        ".Block": {
          backgroundColor: "var(--colorBackground)",
          boxShadow: "none",
          padding: "12px",
        },
        ".Input": {
          padding: "12px",
        },
        ".Input:disabled, .Input--invalid:disabled": {
          color: "lightgray",
        },
        ".Tab": {
          padding: "10px 12px 8px 12px",
          border: "none",
        },
        ".Tab:hover": {
          border: "none",
          boxShadow:
            "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
        },
        ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
          border: "none",
          backgroundColor: "#fff",
          boxShadow:
            "0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
        },
        ".Label": {
          fontWeight: "500",
        },
      },
    },
  };
  return (
    <div>
      {!clientSecret && <OrderAnimation />}
      {clientSecret && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
}
