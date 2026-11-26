import { useEffect, useId, useRef, useState } from 'react';

import LogoNormalIcon from '../../assets/logo/logo-normal.svg?react';
import LogoInversoIcon from '../../assets/logo/logo-inverso.svg?react';
import OjoIcon from '../../assets/icons/ojo.svg?react';
import OjoCerradoIcon from '../../assets/icons/ojocerrado.svg?react';
import FlechaIzqIcon from '../../assets/icons/flechaizq.svg?react';
import AlertaIcon from '../../assets/icons/alerta.svg?react';
import RelojIcon from '../../assets/icons/reloj.svg?react';
import WifiOffIcon from '../../assets/icons/wifioff.svg?react';
import abanicoCromos from '../../assets/cards/abanico-de-cromos.png';

import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { Spinner } from '../../components/ui/Spinner/Spinner';

import styles from './Login.module.css';

const DEFAULT_RETRY_SECONDS = 30;

export const Login = ({ texts, isSubmitting = false, onNavigate, onLogin }) => {
  const loginTexts = texts?.paginas?.ingresar;
  const errorTexts = texts?.errores;
  const stateTexts = texts?.estados;
  const backHomeLabel = stateTexts?.noEncontrado?.botones?.irAlInicio ?? 'Ir al inicio';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSession, setKeepSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const emailId = useId();
  const passwordId = useId();
  const emailErrorId = useId();
  const passwordErrorId = useId();
  const keepSessionId = useId();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const isLocked = lockoutSeconds > 0;
  const isDisabled = isSubmitting || isLocked;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = loginTexts?.seo?.titulo ?? 'Ingresar · Cromoverso';
    return () => {
      document.title = previousTitle;
    };
  }, [loginTexts]);

  useEffect(() => {
    if (!isLocked) {
      setFormError((current) => (current?.type === 'rateLimit' ? null : current));
      return;
    }

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  const executeLogin = async () => {
    if (isDisabled) return;

    const errors = {};
    if (!email.trim()) {
      errors.email = loginTexts?.errores?.correoObligatorio ?? 'Escribe tu correo electrónico.';
    }
    if (!password) {
      errors.password = loginTexts?.errores?.claveObligatoria ?? 'Escribe tu contraseña.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError({ type: 'required' });
      if (errors.email) {
        emailRef.current?.focus();
      } else if (errors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});
    setFormError(null);

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setFormError({ type: 'network' });
      return;
    }

    const result = await onLogin?.({
      correo: email.trim(),
      clave: password,
      keepSession,
    });

    if (!result || result.ok || result.ignored) return;

    if (result.networkError || result.status === 0) {
      setFormError({ type: 'network' });
      return;
    }

    if (result.status === 401 || result.code === 'credenciales_invalidas') {
      setFormError({ type: 'credentials' });
      return;
    }

    if (result.status === 429 || result.code === 'demasiadas_peticiones') {
      const waitSeconds = result.retryAfter ?? DEFAULT_RETRY_SECONDS;
      setLockoutSeconds(waitSeconds);
      setFormError({ type: 'rateLimit' });
      return;
    }

    if (result.status === 422 && result.fields) {
      const apiFieldErrors = {};
      if (result.fields.correo) {
        apiFieldErrors.email = loginTexts?.errores?.correoObligatorio ?? result.fields.correo;
      }
      if (result.fields.clave) {
        apiFieldErrors.password = loginTexts?.errores?.claveObligatoria ?? result.fields.clave;
      }
      setFieldErrors(apiFieldErrors);
      setFormError({ type: 'required' });
      if (apiFieldErrors.email) {
        emailRef.current?.focus();
      } else if (apiFieldErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setFormError({ type: 'server', code: result.code });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin();
  };

  const getBannerContent = () => {
    if (!formError) return null;

    if (formError.type === 'required') {
      return {
        tone: 'error',
        Icon: AlertaIcon,
        title: loginTexts?.errores?.camposObligatorios?.titulo ?? 'Revisa los campos marcados',
        text: loginTexts?.errores?.camposObligatorios?.texto ?? 'Para ingresar escribe tu correo y tu contraseña.',
      };
    }

    if (formError.type === 'credentials') {
      return {
        tone: 'error',
        Icon: AlertaIcon,
        title: loginTexts?.errores?.credenciales?.titulo ?? 'Correo o contraseña incorrectos',
        text:
          loginTexts?.errores?.credenciales?.texto ??
          errorTexts?.credenciales_invalidas ??
          'Revisa los datos e inténtalo de nuevo. Si no recuerdas tu contraseña, puedes restablecerla.',
      };
    }

    if (formError.type === 'rateLimit') {
      const template =
        loginTexts?.errores?.demasiadosIntentos?.texto ??
        'Espera {segundos} segundos antes de volver a intentarlo.';
      return {
        tone: 'warning',
        Icon: RelojIcon,
        title: loginTexts?.errores?.demasiadosIntentos?.titulo ?? 'Demasiados intentos',
        text: template.replace('{segundos}', String(lockoutSeconds)),
      };
    }

    if (formError.type === 'network') {
      return {
        tone: 'error',
        Icon: WifiOffIcon,
        title: loginTexts?.errores?.conexion?.titulo ?? 'No pudimos conectarnos',
        text:
          loginTexts?.errores?.conexion?.texto ??
          'Revisa tu conexión a internet e inténtalo de nuevo. Lo que escribiste se conserva.',
        retryLabel: loginTexts?.errores?.conexion?.botones?.reintentar ?? stateTexts?.error?.botones?.reintentar ?? 'Reintentar',
      };
    }

    return {
      tone: 'error',
      Icon: AlertaIcon,
      title: stateTexts?.error?.titulo ?? 'No se pudo cargar',
      text:
        errorTexts?.[formError.code] ??
        stateTexts?.error?.texto ??
        errorTexts?.generico ??
        'Algo salió mal. Vuelve a intentarlo.',
      retryLabel: stateTexts?.error?.botones?.reintentar ?? 'Reintentar',
    };
  };

  const banner = getBannerContent();
  const BannerIcon = banner?.Icon;

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

          {banner && (
            <div
              className={`${styles.alertBanner} ${banner.tone === 'warning' ? styles.alertWarning : styles.alertError}`}
              role="alert"
              aria-live="assertive"
            >
              <span className={styles.alertIcon} aria-hidden="true">
                <BannerIcon />
              </span>
              <div className={styles.alertBody}>
                <p className="body-s-bold">{banner.title}</p>
                <p className={`${styles.alertText} detail-note`}>{banner.text}</p>
                {banner.retryLabel && (
                  <div className={styles.alertAction}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="s"
                      disabled={isDisabled}
                      onClick={executeLogin}
                    >
                      {banner.retryLabel}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
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
                disabled={isDisabled}
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
                  if (formError && formError.type !== 'rateLimit') {
                    setFormError(null);
                  }
                }}
              />
              {fieldErrors.email && (
                <p id={emailErrorId} className={`${styles.fieldError} detail-note`} role="alert">
                  <AlertaIcon aria-hidden="true" />
                  <span>{fieldErrors.email}</span>
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
                disabled={isDisabled}
                value={password}
                error={Boolean(fieldErrors.password)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? passwordErrorId : undefined}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                  if (formError && formError.type !== 'rateLimit') {
                    setFormError(null);
                  }
                }}
                rightElement={
                  <button
                    type="button"
                    className={styles.eyeButton}
                    disabled={isDisabled}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={togglePasswordLabel}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <OjoCerradoIcon /> : <OjoIcon />}
                  </button>
                }
              />
              {fieldErrors.password && (
                <p id={passwordErrorId} className={`${styles.fieldError} detail-note`} role="alert">
                  <AlertaIcon aria-hidden="true" />
                  <span>{fieldErrors.password}</span>
                </p>
              )}
            </div>

            <div className={styles.optionsRow}>
              <label htmlFor={keepSessionId} className={`${styles.checkboxLabel} body-s`}>
                <input
                  id={keepSessionId}
                  type="checkbox"
                  className={styles.checkbox}
                  disabled={isDisabled}
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
              disabled={isDisabled}
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
