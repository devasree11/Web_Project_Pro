import { useMemo, useRef, useState } from "react";
import {
  FIELD_ORDER,
  isFormValid,
  PASSWORD_CHECK_LABELS,
  passwordStrength,
  validateStudent
} from "./validation.js";

const EMPTY_FORM = {
  name: "",
  age: "",
  email: "",
  className: "",
  phone: "",
  password: "",
  confirmPassword: ""
};

function Formvalidation() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const emailRef = useRef(null);
  const classNameRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const fieldRefs = {
    name: nameRef,
    age: ageRef,
    email: emailRef,
    className: classNameRef,
    phone: phoneRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef
  };

  const errors = useMemo(() => validateStudent(formData), [formData]);
  const strength = useMemo(
    () => passwordStrength(formData.password),
    [formData.password]
  );
  const valid = isFormValid(errors);
  const issueCount = Object.values(errors).reduce((total, list) => total + list.length, 0);

  const shownError = (field) =>
    done ? [] : touched[field] || submitted ? errors[field] : [];

  const fieldState = (field) => {
    if (done || !(touched[field] || submitted)) return "idle";
    return errors[field].length ? "invalid" : formData[field] === "" ? "idle" : "valid";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const field = e.target.name;
    if (!touched[field]) setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const focusField = (field) => fieldRefs[field]?.current?.focus();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!valid) {
      const firstInvalid = FIELD_ORDER.find((field) => errors[field].length);
      focusField(firstInvalid);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 900);
  };

  const handleClear = () => {
    setFormData(EMPTY_FORM);
    setTouched({});
    setSubmitted(false);
    setSubmitting(false);
    setDone(false);
  };

  const handleReset = () => {
    handleClear();
  };

  const statusIcon = (field) => {
    const state = fieldState(field);
    if (state === "valid") return <span className="field-status pass">✓</span>;
    if (state === "invalid") return <span className="field-status fail">✕</span>;
    return null;
  };

  const errorNodes = (field, label) =>
    shownError(field).map((message, index) => (
      <p
        key={message}
        id={index === 0 ? `${label}-error` : undefined}
        className="field-error"
        role="alert"
      >
        {message}
      </p>
    ));

  const wrapClass = (field) => {
    const state = fieldState(field);
    return [
      "input-wrap",
      state === "invalid" ? "is-invalid" : "",
      state === "valid" ? "is-valid" : ""
    ].filter(Boolean).join(" ");
  };

  return (
    <div className="form-card">
      <header className="form-header">
        <h2 className="form-title">Student Registration</h2>
        <p className="form-subtitle">
          Every field is validated live as you type. Errors appear the moment a field
          is touched or the form is submitted.
        </p>
      </header>

      {done ? (
        <section className="success-panel" role="status">
          <h3>Registration complete</h3>
          <p className="success-note">Student record created successfully. Here is the preview:</p>

          <dl className="kv-list">
            <div className="kv"><span>Student Name</span><strong>{formData.name}</strong></div>
            <div className="kv"><span>Age</span><strong>{formData.age}</strong></div>
            <div className="kv"><span>Email</span><strong>{formData.email}</strong></div>
            <div className="kv"><span>Class</span><strong>{formData.className}</strong></div>
            <div className="kv"><span>Phone</span><strong>{formData.phone}</strong></div>
          </dl>

          <button type="button" className="btn btn-primary" onClick={handleReset}>
            Register another student
          </button>
        </section>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {submitted && !valid && (
            <div className="error-summary" role="alert">
              <strong>
                {issueCount === 1
                  ? "One field needs attention"
                  : `${issueCount} issues to fix before submitting`}
              </strong>
              <ul>
                {FIELD_ORDER.filter((field) => errors[field].length).map((field) => (
                  <li key={field}>{errors[field][0]}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="field-group">
            <div className="label-row">
              <label className="field-label" htmlFor="name">Student Name</label>
              <span className={`char-count ${formData.name.length > 40 ? "low" : ""}`}>
                {formData.name.length}/50
              </span>
            </div>

            <div className={wrapClass("name")}>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Arunima Sharma"
                maxLength={50}
                autoComplete="name"
                aria-invalid={shownError("name").length > 0}
                aria-describedby={shownError("name").length ? "name-error" : undefined}
                ref={nameRef}
              />
              {statusIcon("name")}
            </div>
            {errorNodes("name", "name")}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="age">Age</label>

            <div className={wrapClass("age")}>
              <input
                id="age"
                name="age"
                type="text"
                inputMode="numeric"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 17"
                maxLength={3}
                autoComplete="off"
                aria-invalid={shownError("age").length > 0}
                aria-describedby={shownError("age").length ? "age-error" : undefined}
                ref={ageRef}
              />
              {statusIcon("age")}
            </div>
            {errorNodes("age", "age")}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="email">Email</label>

            <div className={wrapClass("email")}>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. arunima.s@example.com"
                autoComplete="email"
                aria-invalid={shownError("email").length > 0}
                aria-describedby={shownError("email").length ? "email-error" : undefined}
                ref={emailRef}
              />
              {statusIcon("email")}
            </div>
            {errorNodes("email", "email")}
          </div>

          <div className="field-group">
            <div className="label-row">
              <label className="field-label" htmlFor="className">Class / Course Code</label>
              <span className={`char-count ${formData.className.length > 16 ? "low" : ""}`}>
                {formData.className.length}/20
              </span>
            </div>

            <div className={wrapClass("className")}>
              <input
                id="className"
                name="className"
                type="text"
                value={formData.className}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder='e.g. 12-B or CS101'
                maxLength={20}
                autoComplete="off"
                aria-invalid={shownError("className").length > 0}
                aria-describedby={shownError("className").length ? "className-error" : undefined}
                ref={classNameRef}
              />
              {statusIcon("className")}
            </div>
            {errorNodes("className", "className")}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="phone">Phone</label>

            <div className={wrapClass("phone")}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 9876543210"
                maxLength={10}
                autoComplete="tel"
                aria-invalid={shownError("phone").length > 0}
                aria-describedby={shownError("phone").length ? "phone-error" : undefined}
                ref={phoneRef}
              />
              {statusIcon("phone")}
            </div>
            {errorNodes("phone", "phone")}
          </div>

          <div className="field-group">
            <div className="label-row">
              <label className="field-label" htmlFor="password">Password</label>
              {formData.password && (
                <span className={`strength-label level-${strength.score}`}>
                  {strength.label}
                </span>
              )}
            </div>

            <div className={wrapClass("password")}>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                aria-invalid={shownError("password").length > 0}
                aria-describedby={shownError("password").length ? "password-error" : undefined}
                ref={passwordRef}
              />
              {statusIcon("password")}
            </div>

            {formData.password && (
              <>
                <div className="strength-bars" aria-hidden="true">
                  {[0, 1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className={index <= strength.score ? `active level-${strength.score}` : ""}
                    />
                  ))}
                </div>
                <ul className="password-checks">
                  {Object.entries(PASSWORD_CHECK_LABELS).map(([key, label]) => (
                    <li key={key} className={strength.checks[key] ? "pass" : "fail"}>
                      <span aria-hidden="true">{strength.checks[key] ? "✓" : "✕"}</span>
                      {label}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {errorNodes("password", "password")}
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="confirmPassword">Confirm Password</label>

            <div className={wrapClass("confirmPassword")}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Re-type your password"
                autoComplete="new-password"
                aria-invalid={shownError("confirmPassword").length > 0}
                aria-describedby={
                  shownError("confirmPassword").length ? "confirmPassword-error" : undefined
                }
                ref={confirmPasswordRef}
              />
              {statusIcon("confirmPassword")}
            </div>
            {errorNodes("confirmPassword", "confirmPassword")}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                "Create student"
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={submitting}
            >
              Clear form
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Formvalidation;