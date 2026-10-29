import type { Config } from "@netlify/functions";

type LeadPayload = Record<string, string>;

function webhookFor(formName: string): string | undefined {
  if (formName === "market-report") {
    return Netlify.env.get("N8N_WEBHOOK_REPORT");
  }
  return Netlify.env.get("N8N_WEBHOOK_AUDIT");
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: LeadPayload;
  try {
    payload = (await req.json()) as LeadPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const formName = payload["form-name"] || payload.form_name || "gbp-audit";
  const webhook = webhookFor(formName);

  if (!webhook) {
    return Response.json({ ok: true, forwarded: false, reason: "webhook_not_configured" });
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      received_at: new Date().toISOString(),
      source: "mbrace-insight-site",
    }),
  });

  return Response.json({
    ok: response.ok,
    forwarded: true,
    status: response.status,
  });
};

export const config: Config = {
  path: "/api/form-to-n8n",
  method: "POST",
};
