import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      status: "ready",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
