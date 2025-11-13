// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
const STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID ?? "";
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? "";

// (Optional) quick env check — remove after you confirm it works in Vercel logs
console.log("🔑 ENV CHECK:", {
  hasSecret: !!process.env.STRIPE_SECRET_KEY,
  hasStarter: !!process.env.STRIPE_STARTER_PRICE_ID,
  hasPro: !!process.env.STRIPE_PRO_PRICE_ID,
});

if (!STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
if (!STARTER_PRICE_ID) console.warn("Missing STRIPE_STARTER_PRICE_ID");
if (!PRO_PRICE_ID) console.warn("Missing STRIPE_PRO_PRICE_ID");

// No apiVersion literal to avoid TS mismatch
const stripe = new Stripe(STRIPE_SECRET_KEY);

type Plan = "starter" | "pro";
const priceFor: Record<Plan, string> = {
  starter: STARTER_PRICE_ID,
  pro: PRO_PRICE_ID,
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = body?.plan as Plan | undefined;

    // ✅ log AFTER plan is defined
    console.log("🧪 Checkout request:", { plan, priceId: plan ? priceFor[plan] : null });

    if (!plan || !priceFor[plan]) {
      return NextResponse.json({ error: "Invalid or missing plan." }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "https://seo.lustmia.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceFor[plan], quantity: 1 }],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      customer_creation: "always",
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create Stripe Checkout session URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err?.raw?.message || err?.message || err);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
