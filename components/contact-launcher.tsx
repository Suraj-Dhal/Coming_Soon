"use client";

import { useId, useRef, useState } from "react";
import { LIMITS, validateContact, type ContactField, type ContactResponse, type FieldErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactLauncher() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [open, setOpen] = useState(false);
  const id = useId();

  const openDialog = () => {
    if (status === "sent") {
      setStatus("idle");
      setMessageLength(0);
      formRef.current?.reset();
    }
    openedAt.current = Date.now();
    dialogRef.current?.showModal();
    setOpen(true);
  };

  const closeDialog = () => dialogRef.current?.close();

  const focusFirstInvalid = (fieldErrors: FieldErrors) => {
    const first = (["name", "email", "message"] as ContactField[]).find((f) => fieldErrors[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const { data, errors: clientErrors } = validateContact(values);
    setErrors(clientErrors);
    setFormError("");
    if (!data) {
      focusFirstInvalid(clientErrors);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: values.website ?? "",
          elapsed: Date.now() - openedAt.current,
        }),
      });
      const result = (await response.json()) as ContactResponse;
      if (result.ok) {
        setStatus("sent");
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.error);
      setStatus("error");
      if (result.fieldErrors) focusFirstInvalid(result.fieldErrors);
    } catch {
      setFormError("I couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  const clearError = (field: ContactField) => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const describedBy = (field: ContactField) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <>
      <button
        type="button"
        className="pill"
        onClick={openDialog}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-dialog`}
      >
        <span className="pill__label" data-hover="Get in touch">
          <span>Coming Soon</span>
        </span>
        <span className="sr-only">: send Suraj a message</span>
      </button>

      <dialog
        ref={dialogRef}
        id={`${id}-dialog`}
        className="sheet"
        aria-labelledby={`${id}-title`}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="sheet__inner">
          <button type="button" className="sheet__close" onClick={closeDialog} aria-label="Close">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
          </button>

          {status === "sent" ? (
            <div className="sheet__done" role="status">
              <svg className="sheet__check" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l7 7 15-16" />
              </svg>
              <h2 id={`${id}-title`} className="sheet__title">
                Message sent
              </h2>
              <p className="sheet__lede">Thank you. Your message is on its way to Suraj.</p>
              <button type="button" className="pill pill--solid" onClick={closeDialog} autoFocus>
                <span className="pill__label">
                  <span>Close</span>
                </span>
              </button>
            </div>
          ) : (
            <>
              <p className="sheet__eyebrow">surajdhal.com</p>
              <h2 id={`${id}-title`} className="sheet__title">
                Say hello
              </h2>
              <p className="sheet__lede">
                The full site is on its way. Until then, leave a message and it will reach Suraj directly.
              </p>

              <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
                <div className="field">
                  <label htmlFor={`${id}-name`}>Name</label>
                  <input
                    id={`${id}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={LIMITS.name}
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy("name")}
                    onInput={() => clearError("name")}
                  />
                  {errors.name && (
                    <p id={`${id}-name-error`} className="field__error">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor={`${id}-email`}>Email</label>
                  <input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={LIMITS.email}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={describedBy("email")}
                    onInput={() => clearError("email")}
                  />
                  {errors.email && (
                    <p id={`${id}-email-error`} className="field__error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="field">
                  <div className="field__head">
                    <label htmlFor={`${id}-message`}>Message</label>
                    <span className="field__count" aria-hidden="true">
                      {messageLength}/{LIMITS.message}
                    </span>
                  </div>
                  <textarea
                    id={`${id}-message`}
                    name="message"
                    rows={5}
                    maxLength={LIMITS.message}
                    required
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={describedBy("message")}
                    onInput={(event) => {
                      setMessageLength(event.currentTarget.value.length);
                      clearError("message");
                    }}
                  />
                  {errors.message && (
                    <p id={`${id}-message-error`} className="field__error">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
                <div className="field--trap" aria-hidden="true">
                  <label htmlFor={`${id}-website`}>Website</label>
                  <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <p className="form__status" role="alert">
                  {formError}
                </p>

                <button
                  type="submit"
                  className="pill pill--solid"
                  disabled={status === "sending"}
                  aria-busy={status === "sending"}
                >
                  <span className="pill__label">
                    <span>{status === "sending" ? "Sending…" : "Send message"}</span>
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
