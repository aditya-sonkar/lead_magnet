import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const strapiUrl = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    const res = await fetch(`${strapiUrl}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          phone: body.phone || "",
          email: body.email || "",
          storeUrl: body.storeUrl || body.shopifyLink || "",
          selectedProblems: Array.isArray(body.selectedProblems)
            ? body.selectedProblems.join(", ")
            : body.selectedProblems || "",
          selectedBudget: body.selectedBudget || body.budget || "",
          otherNotes: body.otherNotes || body.otherIssues || "",
          source: body.source || "Callback Form",
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn("[API Leads] Strapi response error:", res.status, errData);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Leads] Error saving lead:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to save lead" }, { status: 500 });
  }
}
