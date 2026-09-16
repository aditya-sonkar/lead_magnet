import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawUrl = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "https://lead-magnet-7s2k.onrender.com";
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
    console.error("[API Leads] Error saving lead:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to save lead" }, { status: 500 });
  }
}
