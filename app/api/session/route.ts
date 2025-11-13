// app/api/session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

// Note: no apiVersion here (prevents TS literal-type mismatch)
const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer", "line_items.data.price.product"],
    });

    const line = session?.line_items?.data?.[0];
    const price = line?.price ?? null;
    const product =
      (price?.product && typeof price.product !== "string"
        ? price.product
        : null) as Stripe.Product | null;

    const planName =
      (product?.name as string | undefined) ||
      (price?.nickname as string | undefined) ||
      "Subscription";

    const amount =
      typeof price?.unit_amount === "number" ? price.unit_amount : null;
    const currency = (price?.currency ?? "usd").toUpperCase();

    return NextResponse.json({
      ok: true,
      session: {
        id: session.id,
        mode: session.mode,
        status: session.status,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email ?? null,
        planName,
        amount,      // cents
        currency,    // e.g. USD
        created: session.created,
      },
    });
  } catch (err: any) {
    console.error("GET /api/session error:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: "Unable to fetch session details." },
      { status: 500 }
    );
  }
}
