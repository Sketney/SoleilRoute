import { NextResponse } from "next/server";

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      error: message,
      errorCode: code,
      ...(details ? { details } : {}),
    },
    { status },
  );
}
