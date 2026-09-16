import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let rawUrl = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";
    // Normalize localhost to 127.0.0.1 to prevent Node.js IPv6 DNS hang
    rawUrl = rawUrl.replace("localhost", "127.0.0.1");
    const strapiUrl = rawUrl.replace(/\/+$/, "");
    const token = process.env.STRAPI_API_TOKEN;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const selectedProblems = Array.isArray(body.selectedProblems)
      ? body.selectedProblems.join(", ")
      : body.selectedProblems || undefined;

    const res = await fetch(`${strapiUrl}/api/leads`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          phone: body.phone || undefined,
          email: body.email || undefined,
          storeUrl: body.storeUrl || body.shopifyLink || undefined,
          selectedProblems: selectedProblems || undefined,
          selectedBudget: body.selectedBudget || body.budget || undefined,
          otherNotes: body.otherNotes || body.otherIssues || undefined,
          source: body.source || "Callback Form",
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[API Leads] Strapi response error:", res.status, errData);
      return NextResponse.json(
        { success: false, error: errData?.error?.message || "Failed to save lead in Strapi" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Leads] Error saving lead:", error, error?.cause);
    return NextResponse.json({ success: false, error: error?.message || "Failed to save lead", cause: error?.cause ? String(error.cause) : undefined }, { status: 500 });
  }
}
