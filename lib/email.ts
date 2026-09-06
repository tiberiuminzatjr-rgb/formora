import { Resend } from "resend";

export const resend = new Resend(
    process.env.RESEND_API_KEY
);

export const FORMORA_EMAIL_FROM =
    process.env.FORMORA_EMAIL_FROM ||
    "onboarding@resend.dev";

export const FORMORA_ADMIN_EMAIL =
    process.env.FORMORA_ADMIN_EMAIL;
