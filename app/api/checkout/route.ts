import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID;
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

// Initialize Stripe (omit apiVersion to avoid type mismatch)
const stripe = new Stripe(STRIPE_SECRET_KEY);

type Plan = "starter" | "pro";

function getPriceIdForPlan(plan?: Plan): string | null {
  if (plan === "starter") return STARTER_PRICE_ID ?? null;
  if (plan === "pro") return PRO_PRICE_ID ?? null;
  return null;
}

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();
    const priceId = getPriceIdForPlan(plan);
    if (!priceId) {
      return NextResponse.json({ error: "Invalid or missing plan." }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "https://seo.lustmia.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
