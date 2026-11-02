import React, { useId } from 'react';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  mono?: boolean;
}

/** Labelled input with optional help and error text, all linked for assistive tech. */
export function Field({ label, help, error, mono = false, id, className = '', ...rest }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helpId = help ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div className="field">
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={`field-input${mono ? ' field-input--mono' : ''} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      {help && (
        <span id={helpId} className="field-help">
          {help}
        </span>
      )}
      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
