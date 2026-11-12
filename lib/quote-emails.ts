import "server-only";

import { FORMORA_ADMIN_EMAIL, FORMORA_EMAIL_FROM, resend } from "./email";

export type QuoteEmailData = {
    requestId: string;
    service: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    websiteUrl: string;
    projectDetails: string;
    package: string;
    fileNames: string[];
    language: "ro" | "en";
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.formora.ro";

const packageNamesRo: Record<string, string> = {
    Start: "Start",
    Business: "Business",
    "Online store": "Magazin online",
    "Redesign: Refresh": "Redesign · Refresh",
    "Redesign: Complete": "Redesign complet",
    "Redesign: Online store": "Redesign magazin online",
    "Not sure": "Nu știe încă — vrea recomandare",
};

const serviceNamesRo: Record<string, string> = {
    "New Website": "Site web nou",
    "Website Redesign": "Modernizare site web",
    "3D Scanning": "Scanare 3D",
    "3D Printing": "Printare 3D",
    "Scan & Reproduce": "Scanare și reproducere",
};

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function nl2br(value: string) {
    return escapeHtml(value).replace(/\n/g, "<br />");
}

function layout(eyebrow: string, title: string, body: string) {
    return `
<div style="background:#0B0B0D;color:#ffffff;padding:40px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:auto;background:#111114;border:1px solid #26262b;border-radius:24px;padding:36px;">
    <div style="font-size:12px;letter-spacing:4px;color:#3882F6;margin-bottom:20px;">${eyebrow}</div>
    <h1 style="margin:0 0 24px;font-size:26px;line-height:1.25;font-weight:600;">${title}</h1>
    ${body}
    <div style="margin-top:36px;padding-top:20px;border-top:1px solid #26262b;font-size:12px;color:#77777f;">
      FORMORA · Cluj-Napoca · <a href="${SITE_URL}" style="color:#77777f;">formora.ro</a>
    </div>
  </div>
</div>`;
}

function row(label: string, value: string) {
    if (!value) return "";
    return `
<tr>
  <td style="padding:10px 0;border-bottom:1px solid #26262b;color:#77777f;font-size:13px;width:140px;vertical-align:top;">${label}</td>
  <td style="padding:10px 0;border-bottom:1px solid #26262b;color:#ffffff;font-size:14px;">${value}</td>
</tr>`;
}

/** Email to you: a new quote request arrived. */
function adminEmail(data: QuoteEmailData) {
    const phoneLink = data.phone
        ? `<a href="tel:${escapeHtml(data.phone.replace(/\s/g, ""))}" style="color:#3882F6;">${escapeHtml(data.phone)}</a>`
        : "";
    const websiteLink = data.websiteUrl
        ? `<a href="${escapeHtml(data.websiteUrl.startsWith("http") ? data.websiteUrl : `https://${data.websiteUrl}`)}" style="color:#3882F6;">${escapeHtml(data.websiteUrl)}</a>`
        : "";

    const body = `
<table style="width:100%;border-collapse:collapse;">
  ${row("Serviciu", escapeHtml(serviceNamesRo[data.service] ?? data.service))}
  ${row("Pachet", escapeHtml(packageNamesRo[data.package] ?? data.package))}
  ${row("Nume", escapeHtml(data.name))}
  ${row("Firmă", escapeHtml(data.company))}
  ${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:#3882F6;">${escapeHtml(data.email)}</a>`)}
  ${row("Telefon", phoneLink)}
  ${row("Site actual", websiteLink)}
  ${row("Limba", data.language === "ro" ? "Română" : "Engleză")}
  ${row("Fișiere", escapeHtml(data.fileNames.join(", ")))}
</table>
${data.projectDetails ? `
<div style="margin-top:24px;font-size:12px;letter-spacing:2px;color:#77777f;">DETALII PROIECT</div>
<div style="margin-top:10px;padding:18px;background:#0B0B0D;border-radius:16px;font-size:14px;line-height:1.6;color:#d6d6db;">${nl2br(data.projectDetails)}</div>` : ""}
<div style="margin-top:28px;">
  <a href="${SITE_URL}/admin" style="display:inline-block;background:#3882F6;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;font-weight:bold;">Deschide în admin</a>
</div>
<p style="margin-top:16px;font-size:12px;color:#77777f;">Poți răspunde direct la acest email; răspunsul ajunge la client.</p>`;

    return {
        subject: `🔔 Cerere nouă: ${serviceNamesRo[data.service] ?? data.service}${data.package && data.package !== "Not sure" ? ` · ${packageNamesRo[data.package] ?? data.package}` : ""} — ${data.name}${data.company ? ` (${data.company})` : ""}`,
        html: layout("CERERE NOUĂ DE OFERTĂ", `${escapeHtml(data.name)} vrea o ofertă`, body),
    };
}

/** Email to the client: confirmation that the request was received. */
function clientEmail(data: QuoteEmailData) {
    const ro = data.language === "ro";
    const service = ro ? serviceNamesRo[data.service] ?? data.service : data.service;

    const body = ro
        ? `
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Salut ${escapeHtml(data.name)},</p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Mulțumesc pentru cerere! Am primit-o și revin cu un răspuns în cel mult <strong style="color:#fff;">24 de ore lucrătoare</strong>.</p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Serviciu ales: <strong style="color:#fff;">${escapeHtml(service)}</strong></p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Dacă vrei să adaugi ceva (poze, linkuri, exemple de site-uri care îți plac), răspunde direct la acest email.</p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Cu drag,<br /><strong style="color:#fff;">Tiberiu</strong><br />FORMORA</p>`
        : `
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Hi ${escapeHtml(data.name)},</p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Thank you for your request! I've received it and will get back to you within <strong style="color:#fff;">24 business hours</strong>.</p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Selected service: <strong style="color:#fff;">${escapeHtml(service)}</strong></p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">If you'd like to add anything (photos, links, websites you like), just reply to this email.</p>
<p style="font-size:15px;line-height:1.7;color:#d6d6db;">Best regards,<br /><strong style="color:#fff;">Tiberiu</strong><br />FORMORA</p>`;

    return {
        subject: ro ? "Am primit cererea ta — FORMORA" : "We received your request — FORMORA",
        html: layout(ro ? "CERERE PRIMITĂ" : "REQUEST RECEIVED", ro ? "Mulțumesc pentru cerere!" : "Thanks for reaching out!", body),
    };
}

/**
 * Sends both emails. Never throws: the request is already saved in Supabase,
 * so an email problem must not show an error to the visitor.
 */
export async function sendQuoteEmails(data: QuoteEmailData) {
    if (!process.env.RESEND_API_KEY) {
        console.error("Quote emails skipped: RESEND_API_KEY is missing");
        return;
    }

    const jobs: Promise<unknown>[] = [];

    if (FORMORA_ADMIN_EMAIL) {
        const admin = adminEmail(data);
        jobs.push(
            resend.emails.send({
                from: `FORMORA <${FORMORA_EMAIL_FROM}>`,
                to: [FORMORA_ADMIN_EMAIL],
                replyTo: data.email,
                subject: admin.subject,
                html: admin.html,
            })
        );
    } else {
        console.error("Admin quote email skipped: FORMORA_ADMIN_EMAIL is missing");
    }

    const client = clientEmail(data);
    jobs.push(
        resend.emails.send({
            from: `Tiberiu de la FORMORA <${FORMORA_EMAIL_FROM}>`,
            to: [data.email],
            ...(FORMORA_ADMIN_EMAIL ? { replyTo: FORMORA_ADMIN_EMAIL } : {}),
            subject: client.subject,
            html: client.html,
        })
    );

    const results = await Promise.allSettled(jobs);
    for (const result of results) {
        if (result.status === "rejected") {
            console.error("Quote email failed:", result.reason);
        } else {
            const value = result.value as { error?: unknown } | undefined;
            if (value?.error) console.error("Quote email failed:", value.error);
        }
    }
}