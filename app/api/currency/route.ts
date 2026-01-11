import { NextResponse } from "next/server";
import { convertCurrency } from "@/lib/services/exchange-rate";

export async function POST(request: Request) {
  const { amount, from, to } = await request.json();

  if (typeof amount !== "number" || !from || !to) {
    return NextResponse.json(
      { error: "amount, from, and to are required" },
      { status: 400 },
    );
  }

  try {
    const result = await convertCurrency(amount, from, to);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

