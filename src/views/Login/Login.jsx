import { useEffect, useId, useRef, useState } from 'react';

import LogoNormalIcon from '../../assets/logo/logo-normal.svg?react';
import LogoInversoIcon from '../../assets/logo/logo-inverso.svg?react';
import OjoIcon from '../../assets/icons/ojo.svg?react';
import OjoCerradoIcon from '../../assets/icons/ojocerrado.svg?react';
import FlechaIzqIcon from '../../assets/icons/flechaizq.svg?react';
import abanicoCromos from '../../assets/cards/abanico-de-cromos.png';

import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';

import styles from './Login.module.css';

export const Login = ({ texts, isSubmitting = false, onNavigate, onLogin }) => {
  const loginTexts = texts?.paginas?.ingresar;
  const backHomeLabel = texts?.estados?.noEncontrado?.botones?.irAlInicio ?? 'Ir al inicio';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSession, setKeepSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const emailId = useId();
  const passwordId = useId();
  const emailErrorId = useId();
  const passwordErrorId = useId();
  const keepSessionId = useId();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = loginTexts?.seo?.titulo ?? 'Ingresar · Cromoverso';
    return () => {
      document.title = previousTitle;
    };
  }, [loginTexts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!email.trim()) {
      errors.email = loginTexts?.errores?.correoObligatorio ?? 'Escribe tu correo electrónico.';
    }
    if (!password) {
      errors.password = loginTexts?.errores?.claveObligatoria ?? 'Escribe tu contraseña.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.email) {
        emailRef.current?.focus();
      } else if (errors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});
    await onLogin?.({
      correo: email.trim(),
      clave: password,
      keepSession,
    });
  };

  const togglePasswordLabel = showPassword
    ? (loginTexts?.formulario?.botones?.ocultarClave ?? 'Ocultar contraseña')
    : (loginTexts?.formulario?.botones?.mostrarClave ?? 'Mostrar contraseña');

  return (
    <section className={styles.page}>
      <aside className={styles.showcase}>
        <div className={styles.showcaseTop}>
          <a
            href="/"
            className={styles.brandLink}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('inicio');
            }}
          >
            <LogoInversoIcon />
          </a>

          <a
            href="/"
            className={`${styles.backHomeLink} body-s-bold`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('inicio');
            }}
          >
            <FlechaIzqIcon />
            <span>{backHomeLabel}</span>
          </a>
        </div>

        <div className={styles.cardsShowcase}>
          <img
            src={abanicoCromos}
            alt="Abanico de cromos de Cromoverso"
            className={styles.cardsImage}
          />
        </div>

        <div className={styles.showcaseCopy}>
          <span className={`${styles.seasonBadge} detail-note-bold`}>
            {loginTexts?.presentacion?.etiquetas?.temporada ?? 'Temporada 1 · Seis mundos'}
          </span>
          <h2 className={`${styles.showcaseTitle} heading-h1`}>
            {loginTexts?.presentacion?.titulo ?? 'Seis mundos. 120 héroes. Un álbum tuyo.'}
          </h2>
          <p className={`${styles.showcaseSubtitle} body-m`}>
            {loginTexts?.presentacion?.texto ?? 'Explora seis mundos y conoce a sus 120 héroes originales.'}
          </p>
        </div>
      </aside>

      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <a
            href="/"
            className={`${styles.brandLink} ${styles.desktopLogo}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('inicio');
            }}
          >
            <LogoNormalIcon />
          </a>

          <div className={styles.formHeader}>
            <h1 className="heading-h1">
              {loginTexts?.formulario?.titulo ?? 'Ingresa a tu cuenta'}
            </h1>
            <p className={`${styles.formSubtitle} body-m`}>
              {loginTexts?.formulario?.subtitulo ?? 'Ingresa con el correo y la contraseña de tu cuenta.'}
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor={emailId} className="body-s-bold">
                {loginTexts?.formulario?.etiquetas?.correo ?? 'Correo electrónico'}
              </label>
              <Input
                ref={emailRef}
                id={emailId}
                name="correo"
                type="email"
                size="m"
                shape="rounded"
                autoComplete="email"
                placeholder={loginTexts?.formulario?.placeholders?.correo ?? 'nombre@correo.com'}
                value={email}
                error={Boolean(fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? emailErrorId : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
              />
              {fieldErrors.email && (
                <p id={emailErrorId} className={`${styles.fieldError} body-s`} role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor={passwordId} className="body-s-bold">
                {loginTexts?.formulario?.etiquetas?.clave ?? 'Contraseña'}
              </label>
              <Input
                ref={passwordRef}
                id={passwordId}
                name="clave"
                type={showPassword ? 'text' : 'password'}
                size="m"
                shape="rounded"
                autoComplete="current-password"
                value={password}
                error={Boolean(fieldErrors.password)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? passwordErrorId : undefined}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                rightElement={
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={togglePasswordLabel}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <OjoCerradoIcon /> : <OjoIcon />}
                  </button>
                }
              />
              {fieldErrors.password && (
                <p id={passwordErrorId} className={`${styles.fieldError} body-s`} role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className={styles.optionsRow}>
              <label htmlFor={keepSessionId} className={`${styles.checkboxLabel} body-s`}>
                <input
                  id={keepSessionId}
                  type="checkbox"
                  className={styles.checkbox}
                  checked={keepSession}
                  onChange={(e) => setKeepSession(e.target.checked)}
                />
                <span>
                  {loginTexts?.formulario?.etiquetas?.mantenerSesion ?? 'Mantener la sesión iniciada'}
                </span>
              </label>

              <a
                href="/recuperar-clave"
                className={`${styles.link} body-s-bold`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('recuperar-clave');
                }}
              >
                {loginTexts?.formulario?.enlaces?.olvidasteClave ?? '¿Olvidaste tu contraseña?'}
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="l"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="s" />
                  <span>{loginTexts?.formulario?.mensajes?.ingresando ?? 'Ingresando…'}</span>
                </>
              ) : (
                loginTexts?.formulario?.botones?.ingresar ?? 'Ingresar'
              )}
            </Button>

            <p className={`${styles.signupPrompt} body-s`}>
              <span>{loginTexts?.formulario?.mensajes?.sinCuenta ?? '¿No tienes cuenta?'}</span>{' '}
              <a
                href="/crear-cuenta"
                className={`${styles.link} body-s-bold`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('crear-cuenta');
                }}
              >
                {loginTexts?.formulario?.enlaces?.crearCuenta ?? 'Crea una cuenta'}
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
