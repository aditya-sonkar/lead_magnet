import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = req.headers.get("x-revalidate-secret") || url.searchParams.get("secret");
    
    // Optional secret check if REVALIDATE_SECRET is set
    if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
    }

    // Revalidate the main landing page and any dynamic slug routes
    revalidatePath("/");
    revalidatePath("/[slug]", "page");

    return NextResponse.json({
      revalidated: true,
      message: "Landing page revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Error revalidating", error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

// Also support GET for quick manual browser testing: /api/revalidate
export async function GET(req: Request) {
  return POST(req);
}
