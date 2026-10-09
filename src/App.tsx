import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import emblem from "../public/images/emblem.jpg";
import flagBr from "../public/images/flag-brazil.jpg";
import flagPt from "../public/images/flag-portugal.jpg";
import { Terminal } from "./components/Terminal";
import { CREW, IDENTITY, MOTTO, PING_EVENT, STACK } from "./data";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(field);
      return ok;
    } catch {
      return false;
    }
  }
}

function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

function useScramble(text: string) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#";
    let frame = 0;
    const total = 24;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = frame / total;
      setOut(
        text
          .split("")
          .map((ch, index) => {
            if (ch === " ") return " ";
            if (index / text.length < progress) return ch;
            return chars[Math.floor(Math.random() * chars.length)] ?? ch;
          })
          .join(""),
      );
      if (frame >= total) window.clearInterval(id);
    }, 34);
    return () => window.clearInterval(id);
  }, [text]);
  return out;
}

function useGlitchPulse() {
  const [hot, setHot] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let clear = 0;
    const loop = () => {
      setHot(true);
      clear = window.setTimeout(() => setHot(false), 240);
      timer = window.setTimeout(loop, 3600 + Math.random() * 2800);
    };
    timer = window.setTimeout(loop, 1400);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clear);
    };
  }, []);
  return hot;
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setOn(true), 1600);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [on]);

  return (
    <div ref={ref} className={`${className} rise ${on ? "is-in" : ""}`}>
      {children}
    </div>
  );
}

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function DcIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.27 5.33A17.4 17.4 0 0 0 15 4.1l-.27.48a12.2 12.2 0 0 1 3.14 1.27 13.3 13.3 0 0 0-12.74 0A12.2 12.2 0 0 1 8.27 4.58L8 4.1a17.4 17.4 0 0 0-4.27 1.23C1.2 9.05.5 12.7.8 16.3A17.5 17.5 0 0 0 6.9 19l.7-.96a11.2 11.2 0 0 1-1.5-.72l.3-.23c3.1 1.45 6.5 1.45 9.55 0l.3.23c-.48.28-1 .52-1.5.72l.7.96a17.5 17.5 0 0 0 6.1-2.7c.4-4.1-.6-7.7-2.28-10.97ZM8.7 14.3c-.8 0-1.45-.74-1.45-1.65S7.88 11 8.7 11s1.47.74 1.45 1.65-.65 1.65-1.45 1.65Zm6.6 0c-.8 0-1.45-.74-1.45-1.65S14.48 11 15.3 11s1.47.74 1.45 1.65-.65 1.65-1.45 1.65Z"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 0 7.54.54l2.12-2.12a5 5 0 0 0-7.07-7.07L11.2 5.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54L4.34 12.6a5 5 0 0 0 7.07 7.07l1.39-1.39"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
      <path
        d="M12 3 5 6v6c0 4.2 2.9 7.2 7 8.5 4.1-1.3 7-4.3 7-8.5V6l-7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function Flag({ src, alt, side }: { src: string; alt: string; side: "pt" | "br" }) {
  return (
    <div className={`flag-frame flag-${side}`}>
      <img src={src} alt={alt} />
      <div className="flag-sheen" />
      <div className="flag-shade" />
    </div>
  );
}

function SocialButtons({
  copied,
  onDiscord,
  compact = false,
}: {
  copied: boolean;
  onDiscord: () => void;
  compact?: boolean;
}) {
  return (
    <>
      <a
        className="link-btn ig"
        href={IDENTITY.igUrl}
        target="_blank"
        rel="me noreferrer noopener"
        aria-label={`Instagram @${IDENTITY.ig}`}
      >
        <span className="link-btn-l">
          <IgIcon />
          INSTAGRAM
        </span>
        {compact ? null : <span className="link-btn-r">@{IDENTITY.ig}</span>}
      </a>
      <button
        className="link-btn dc"
        type="button"
        onClick={onDiscord}
        aria-label={`Copy Discord username ${IDENTITY.discord}`}
      >
        <span className="link-btn-l">
          <DcIcon />
          {copied ? "COPIED" : "DISCORD"}
        </span>
        {compact ? null : <span className="link-btn-r">{IDENTITY.discord}</span>}
      </button>
    </>
  );
}

export default function App() {
  const clock = useClock();
  const scrambled = useScramble("ORUSSOYT");
  const hot = useGlitchPulse();
  const [shock, setShock] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lit, setLit] = useState<string | null>(null);
  const flashTimer = useRef(0);
  const copyTimer = useRef(0);
  const toastTimer = useRef(0);
  const marquee = [...CREW, ...CREW, ...CREW, ...CREW];

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty("--mx", `${event.clientX}px`);
      document.documentElement.style.setProperty("--my", `${event.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const target = "Blessed";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.title = target;
      return;
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#";
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = frame / 16;
      document.title = target
        .split("")
        .map((ch, index) => {
          if (ch === " " || ch === "—" || ch === "-") return ch;
          return index / target.length < progress
            ? (target[index] ?? ch)
            : (chars[Math.floor(Math.random() * chars.length)] ?? ch);
        })
        .join("");
      if (frame >= 16) {
        window.clearInterval(id);
        document.title = target;
      }
    }, 40);
    return () => window.clearInterval(id);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(flashTimer.current);
      window.clearTimeout(copyTimer.current);
      window.clearTimeout(toastTimer.current);
    },
    [],
  );

  function notify(message: string) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }

  function pulse() {
    setShock((value) => value + 1);
    setFlashOn(true);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlashOn(false), 700);
  }

  async function copyDiscord() {
    const ok = await copyText(IDENTITY.discord);
    setCopied(ok);
    notify(ok ? `discord copied — ${IDENTITY.discord}` : `discord · ${IDENTITY.discord}`);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  function openInstagram() {
    window.open(IDENTITY.igUrl, "_blank", "noopener,noreferrer");
  }

  async function onMotto() {
    const ok = await copyText(MOTTO);
    notify(ok ? `copied — ${MOTTO}` : MOTTO);
    pulse();
  }

  function ping(name: string) {
    notify(`${name} — roster locked`);
    window.dispatchEvent(new CustomEvent(PING_EVENT, { detail: name }));
  }

  function focusLang(id: string) {
    setLit(id);
    document.getElementById("loadout")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => setLit((current) => (current === id ? null : current)), 1800);
  }

  const glitchOn = hot || flashOn;

  return (
    <>
      <div className="grid-bg" />
      <div className="spot" />
      <div className="vignette" />
      <div className="grain" />
      <div className="scan" />
      {shock > 0 ? <div key={shock} className="shock" /> : null}

      <header className="status-bar">
        <button className="status-brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="sr-only">Back to top. </span>
          SYS://ORUSSOYT
        </button>
        <span className="status-live">
          <span className="bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          ONLINE
        </span>
        <span className="status-clock">{clock}</span>
      </header>

      <main className="site">
        <p className="sr-only">
          orussoyt, developer and programmer. JavaScript, TypeScript, cybersecurity. Ex CyberTeam.
          Instagram @{IDENTITY.ig}. Discord {IDENTITY.discord}.
        </p>

        <section className="wrap poster" id="top">
          <div className="poster-row">
            <div className="flag-pt">
              <Flag src={flagPt} alt="Flag of Portugal" side="pt" />
            </div>
            <div className="emblem-slot">
              <button
                className="emblem-wrap"
                type="button"
                aria-label="Ex CyberTeam emblem"
                onClick={() => {
                  pulse();
                  notify("WE DO NOT FORGET · WE DO NOT FORGIVE");
                }}
              >
                <span className="ring" />
                <span className="ring b" />
                <span className="emblem-core">
                  <span className="emblem-disc" />
                  <img src={emblem} alt="" />
                </span>
              </button>
            </div>
            <div className="flag-br">
              <Flag src={flagBr} alt="Flag of Brazil" side="br" />
            </div>
          </div>

          <h1 className="hero-name">
            <button className="hero-name-btn" type="button" onClick={pulse} aria-label="orussoyt">
              <span className={glitchOn ? "glitch is-hot" : "glitch"} data-text={scrambled} aria-hidden="true">
                {scrambled}
              </span>
            </button>
          </h1>
          <p className="role">
            Developer <span>·</span> Programador
          </p>
          <p className="unit">
            <span className="dim">EX </span>
            <span className="w">CYBER</span>
            <span className="r">TEAM</span>
          </p>

          <div className="lang-line">
            {STACK.map((mod) => (
              <button
                key={mod.id}
                className="lang-pill"
                type="button"
                style={{ color: mod.accent }}
                onClick={() => focusLang(mod.id)}
              >
                {mod.name}
              </button>
            ))}
          </div>

          <div className="laser" aria-hidden="true" />
          <p className="access">
            <b>›</b> signal locked · public bio
            <span className="caret" aria-hidden="true" />
          </p>

          <div className="crew-line">
            {CREW.map((name, index) => (
              <span className="crew-bit" key={name}>
                {index > 0 ? <span className="sep">-</span> : null}
                <button className="crew-name" type="button" onClick={() => ping(name)}>
                  {name}
                </button>
              </span>
            ))}
          </div>
          <button className="motto" type="button" onClick={onMotto}>
            {MOTTO}
          </button>
          <div className="rule" aria-hidden="true">
            <i />
            ◆
            <i />
          </div>
        </section>

        <section className="wrap" id="card">
          <article className="profile-card">
            <span className="clasp" aria-hidden="true" />
            <div className="id-row">
              <div className="avatar-wrap">
                <div className="avatar">
                  <img src={emblem} alt="" />
                </div>
                <span className="online-dot" />
              </div>
              <div>
                <h2 className="id-name">{IDENTITY.name}</h2>
                <div className="badge">
                  <ShieldIcon />
                  EX CYBERTEAM
                </div>
                <p className="id-sub">DEVELOPER · PROGRAMADOR</p>
                <a className="ig-mini" href={IDENTITY.igUrl} target="_blank" rel="me noreferrer noopener">
                  @{IDENTITY.ig}
                </a>
              </div>
            </div>
            <p className="bio">
              still in the code.
              <span>js / ts / cybersecurity</span>
            </p>
            <div className="redes">
              <LinkIcon />
              REDES
            </div>
            <div className="link-stack">
              <SocialButtons copied={copied} onDiscord={() => void copyDiscord()} />
            </div>
          </article>
        </section>

        <section className="wrap section" id="loadout">
          <div className="col">
            <Reveal>
              <header className="section-head">
                <p className="kicker">Stack</p>
                <h2>Languages</h2>
                <p className="lede">JavaScript, TypeScript, cybersecurity. The whole wire.</p>
              </header>
              <div className="loadout">
                {STACK.map((mod) => (
                  <article
                    key={mod.id}
                    id={`mod-${mod.id}`}
                    className={lit === mod.id ? "mod is-lit" : "mod"}
                    style={{ "--accent": mod.accent } as CSSProperties}
                  >
                    <div className="mod-mark" style={{ background: mod.markBg, color: mod.markFg }}>
                      {mod.short}
                    </div>
                    <div className="mod-copy">
                      <div className="mod-title-row">
                        <h3>{mod.name}</h3>
                        <span className="mod-status">
                          <i />
                          ACTIVE
                        </span>
                      </div>
                      <p>{mod.line}</p>
                      <div className="meter" aria-hidden="true">
                        <span />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="roster-band" id="roster">
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              {marquee.map((name, index) => (
                <span key={`${name}-${index}`}>{name.toUpperCase()}</span>
              ))}
            </div>
          </div>
          <div className="wrap">
            <header className="section-head">
              <p className="kicker">Roster</p>
              <h2>Ex CyberTeam</h2>
              <p className="lede">Five names on the record. Operator: {IDENTITY.name}.</p>
            </header>
            <div className="plates">
              {CREW.map((name, index) => (
                <button key={name} className="plate" type="button" onClick={() => ping(name)}>
                  <span className="plate-i">0{index + 1}</span>
                  <span className="plate-name">{name}</span>
                  <span className="ping">PING</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap section" id="channel">
          <div className="col">
            <header className="section-head">
              <p className="kicker">Channel</p>
              <h2>Terminal</h2>
              <p className="lede">Type help. The page answers.</p>
            </header>
            <Terminal onDiscord={() => void copyDiscord()} onInstagram={openInstagram} onFlash={pulse} />
            <p className="term-hint">try whoami · crew · motto · discord · ig</p>
          </div>
        </section>

        <footer className="wrap closer">
          <div className="col">
            <p className="kicker">Signal</p>
            <button className="motto-xl" type="button" onClick={() => void onMotto()}>
              {MOTTO}
            </button>
            <p className="lede">
              {IDENTITY.name} · ex cyberteam · developer
            </p>
            <div className="closer-actions">
              <SocialButtons copied={copied} onDiscord={() => void copyDiscord()} />
            </div>
            <p className="end">END OF TRANSMISSION</p>
          </div>
        </footer>
      </main>

      <div className="dock">
        <SocialButtons copied={copied} onDiscord={() => void copyDiscord()} compact />
      </div>

      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </>
  );
}
