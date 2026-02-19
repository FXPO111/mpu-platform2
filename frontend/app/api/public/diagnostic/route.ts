import { NextRequest, NextResponse } from "next/server";

function resolveBackendBaseUrl(): string | null {
  const configuredUrl = process.env.BACKEND_API_BASE_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:8000";
  }

  return null;
}

export async function POST(request: NextRequest) {
  const backendBaseUrl = resolveBackendBaseUrl();

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        error: {
          message: "Server misconfiguration",
          details: {
            required_env: "BACKEND_API_BASE_URL",
            hint: "Set BACKEND_API_BASE_URL to the backend origin, for example http://backend:8000",
          },
        },
      },
      { status: 500 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Invalid JSON body" } }, { status: 400 });
  }

  try {
    const response = await fetch(`${backendBaseUrl}/api/public/diagnostic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const bodyText = await response.text();
    return new NextResponse(bodyText, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          message: "Backend unavailable",
          details: { backend_base_url: backendBaseUrl },
        },
      },
      { status: 502 },
    );
  }
}
