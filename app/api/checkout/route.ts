import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID!;
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;

const stripe = new Stripe(STRIPE_SECRET_KEY);

type Plan = "starter" | "pro";
function priceIdFor(plan?: Plan) {
  if (plan === "starter") return STARTER_PRICE_ID;
  if (plan === "pro") return PRO_PRICE_ID;
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const plan = (body?.plan as Plan | undefined) ?? undefined;
    const priceId = priceIdFor(plan);

    if (!priceId) {
      return NextResponse.json({ error: "Invalid or missing plan." }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "https://seo.lustmia.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_creation: "always",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create session URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("POST /api/checkout error:", err);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}

// Simple GET probe so hitting /api/checkout in a browser doesn't error
export async function GET() {
  return NextResponse.json({ ok: true, info: "checkout endpoint ready", method: "GET" });
}
