// Contact form rules shared by the browser form and the /api/contact handler.
// The database enforces its own (looser) limits as a last line of defence.

export const LIMITS = { name: 100, email: 254, message: 2000 } as const;

export type ContactInput = { name: string; email: string; message: string };
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Control characters other than tab and newlines.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const LINE_BREAKS = /[\r\n\t]/;

function text(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFC").trim() : "";
}

export function validateContact(input: Record<string, unknown>): {
  data: ContactInput | null;
  errors: FieldErrors;
} {
  const name = text(input.name);
  const email = text(input.email);
  const message = text(input.message).replace(/\r\n?/g, "\n");
  const errors: FieldErrors = {};

  if (!name) errors.name = "Please tell me your name.";
  else if (name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  else if (CONTROL_CHARS.test(name) || LINE_BREAKS.test(name)) errors.name = "Your name contains characters I can't accept.";

  if (!email) errors.email = "Please add your email so I can reply.";
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) errors.email = "That email address doesn't look right.";

  if (!message) errors.message = "Please write a short message.";
  else if (message.length > LIMITS.message) errors.message = `Keep your message under ${LIMITS.message} characters.`;
  else if (CONTROL_CHARS.test(message)) errors.message = "Your message contains characters I can't accept.";

  const valid = Object.keys(errors).length === 0;
  return { data: valid ? { name, email, message } : null, errors };
}
