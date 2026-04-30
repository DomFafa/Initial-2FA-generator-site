"use client";

import { Clipboard, Eye, EyeOff, KeyRound, RotateCcw, ShieldCheck } from "lucide-react";
import type { CSSProperties } from "react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { generateTotp, secondsRemaining, validateAndDecodeSecret } from "@/lib/totp";

type Toast = { id: number; message: string };

export function TotpGenerator() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState<Toast | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const remaining = secondsRemaining(now);
  const progress = (remaining / 30) * 100;
  const isExpiring = remaining <= 5;

  const normalizedSecret = useMemo(() => validateAndDecodeSecret(secret), [secret]);

  const showToast = useCallback((message: string) => {
    const next = { id: Date.now(), message };
    setToast(next);
    window.setTimeout(() => {
      setToast((current) => (current?.id === next.id ? null : current));
    }, 1800);
  }, []);

  const refreshCode = useCallback(async () => {
    const validation = validateAndDecodeSecret(secret);
    if (!validation.ok) {
      setCode("");
      setError(validation.message);
      setHasGenerated(false);
      return;
    }

    try {
      const nextCode = await generateTotp(validation.bytes);
      setCode(nextCode);
      setError("");
      setHasGenerated(true);
    } catch {
      setCode("");
      setError("The code could not be generated in this browser. Try a modern browser.");
      setHasGenerated(false);
    }
  }, [secret]);

  const copyCode = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      showToast("Copied");
    } catch {
      showToast("Copy failed. Select the code manually.");
    }
  }, [code, showToast]);

  const clearAll = useCallback(() => {
    setSecret("");
    setCode("");
    setError("");
    setHasGenerated(false);
    setToast(null);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hasGenerated || !normalizedSecret.ok) return;

    let active = true;
    generateTotp(normalizedSecret.bytes)
      .then((nextCode) => {
        if (active) setCode(nextCode);
      })
      .catch(() => {
        if (active) setError("The code could not be refreshed.");
      });

    return () => {
      active = false;
    };
  }, [hasGenerated, normalizedSecret, remaining]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        clearAll();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "c" && code) {
        const selection = window.getSelection()?.toString();
        if (!selection) {
          event.preventDefault();
          void copyCode();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearAll, code, copyCode]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void refreshCode();
  }

  return (
    <section className="tool-card" aria-labelledby="generator-title">
      <div className="tool-heading">
        <div>
          <p className="eyebrow">Local TOTP generator</p>
          <h2 id="generator-title">Generate a 2FA code</h2>
        </div>
        <div className="security-pill">
          <ShieldCheck size={16} aria-hidden="true" />
          Local only
        </div>
      </div>

      <form className="generator-form" onSubmit={onSubmit}>
        <label htmlFor="secret">2FA Secret</label>
        <div className="input-row">
          <KeyRound className="input-icon" size={19} aria-hidden="true" />
          <input
            id="secret"
            value={secret}
            type={isHidden ? "password" : "text"}
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            placeholder="JBSW Y3DP EHPK 3PXP"
            onChange={(event) => {
              setSecret(event.target.value);
              if (error) setError("");
            }}
          />
          <button
            className="icon-button"
            type="button"
            aria-label={isHidden ? "Show secret" : "Hide secret"}
            title={isHidden ? "Show secret" : "Hide secret"}
            onClick={() => setIsHidden((value) => !value)}
          >
            {isHidden ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
          </button>
        </div>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            Generate code
          </button>
          <button className="secondary-button" type="button" onClick={clearAll}>
            <RotateCcw size={17} aria-hidden="true" />
            Clear
          </button>
        </div>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      <div className={`code-panel ${code ? "is-active" : ""}`} aria-live="polite">
        <div className="code-display" aria-label={code ? `Current code ${code}` : "No code generated yet"}>
          {code || "------"}
        </div>
        <div className="timer-wrap">
          <div
            className={`timer-ring ${isExpiring ? "is-expiring" : ""}`}
            style={{ "--progress": `${progress}%` } as CSSProperties}
            aria-label={`${remaining} seconds remaining`}
          >
            <span>{remaining}</span>
          </div>
          <span className="timer-label">seconds left</span>
        </div>
        <button className="copy-button" type="button" onClick={copyCode} disabled={!code}>
          <Clipboard size={18} aria-hidden="true" />
          Copy code
        </button>
      </div>

      <div className="help-strip">
        <p>No account. No upload. No browser storage.</p>
        <p>If a code fails, check that your device time is set automatically.</p>
      </div>

      {toast ? (
        <div className="toast" role="status">
          {toast.message}
        </div>
      ) : null}
    </section>
  );
}
