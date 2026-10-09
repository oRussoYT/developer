import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CREW, IDENTITY, MOTTO, PING_EVENT } from "../data";

type Kind = "in" | "out" | "sys" | "err" | "hot";

type Line = {
  id: number;
  kind: Kind;
  text: string;
};

type Action = "discord" | "ig" | "clear" | "flash";

type Result = {
  lines: { kind: Kind; text: string }[];
  action?: Action;
};

function row(text: string, width = 29) {
  const clipped = text.length > width ? text.slice(0, width) : text;
  return `| ${clipped.padEnd(width, " ")} |`;
}

function banner() {
  const bar = `+${"-".repeat(31)}+`;
  return [
    bar,
    row("ORUSSOYT"),
    row("developer / programador"),
    row("js · ts · cybersecurity"),
    row("ex cyberteam · ONLINE"),
    bar,
  ];
}

function runCommand(raw: string): Result {
  const trimmed = raw.trim();
  const cmd = trimmed.toLowerCase();
  if (!cmd) return { lines: [] };
  const [head, ...rest] = cmd.split(/\s+/);
  const arg = rest.join(" ");
  const say = (text: string, kind: Kind = "out") => ({ kind, text });

  switch (head) {
    case "help":
    case "?":
      return {
        lines: [
          say("commands", "sys"),
          say("  whoami     identity"),
          say("  stack      languages"),
          say("  crew       roster"),
          say("  socials    links"),
          say("  motto      the line"),
          say("  discord    copy handle"),
          say("  ig         open instagram"),
          say("  banner     operator card"),
          say("  clear      wipe screen"),
        ],
      };
    case "whoami":
      return {
        lines: [
          say(IDENTITY.name, "sys"),
          say("developer / programador"),
          say("stack    javascript · typescript · cybersecurity"),
          say("unit     ex cyberteam"),
          say(`ig       @${IDENTITY.ig}`),
          say(`dc       ${IDENTITY.discord}`),
        ],
      };
    case "stack":
    case "languages":
    case "skills":
    case "lang":
      return {
        lines: [
          say("LOADOUT", "sys"),
          say("  01  JavaScript      ACTIVE"),
          say("  02  TypeScript      ACTIVE"),
          say("  03  Cybersecurity   ACTIVE"),
        ],
      };
    case "crew":
    case "roster":
    case "team":
      return {
        lines: [
          say("EX CYBERTEAM", "sys"),
          ...CREW.map((name) => say(`  > ${name}`)),
          say(`operator  ${IDENTITY.name}`, "hot"),
        ],
      };
    case "socials":
    case "links":
    case "redes":
      return {
        lines: [
          say(`instagram  ${IDENTITY.igUrl}`),
          say(`discord    ${IDENTITY.discord}`),
          say("tip: ig | discord", "sys"),
        ],
      };
    case "motto":
    case "legends":
      return { lines: [say(MOTTO, "hot")], action: "flash" };
    case "discord":
    case "dc":
      return {
        lines: [say(`copied discord handle -> ${IDENTITY.discord}`, "sys")],
        action: "discord",
      };
    case "ig":
    case "instagram":
      return {
        lines: [say(`opening instagram @${IDENTITY.ig}`, "sys")],
        action: "ig",
      };
    case "clear":
      return { lines: [], action: "clear" };
    case "banner":
    case "neofetch":
      return { lines: banner().map((text) => say(text, "sys")) };
    case "ls":
      return {
        lines: [say("identity.txt  stack.json  crew.md  socials.lnk  motto.txt")],
      };
    case "cat": {
      const files: Record<string, string[]> = {
        "identity.txt": [
          IDENTITY.name,
          "developer / programador",
          "ex cyberteam",
          "still in the code.",
        ],
        "stack.json": ['{ "lang": ["javascript", "typescript", "cybersecurity"] }'],
        "crew.md": CREW.map((name) => `- ${name}`),
        "socials.lnk": [`ig  @${IDENTITY.ig}`, `dc  ${IDENTITY.discord}`],
        "motto.txt": [MOTTO],
      };
      if (!arg) return { lines: [say("usage: cat <file>", "err")] };
      const hit = files[arg];
      if (!hit) return { lines: [say(`cat: ${arg}: no such file`, "err")] };
      return { lines: hit.map((text) => say(text)) };
    }
    case "sudo":
      return { lines: [say("orussoyt is already root of this page.", "sys")] };
    case "hack":
    case "exploit":
    case "pwn":
    case "ddos":
      return { lines: [say("negative. this channel is a bio. go write code.", "err")] };
    case "hello":
    case "hi":
      return { lines: [say("signal received. type help.", "sys")] };
    default: {
      const hit = CREW.find((name) => name.toLowerCase() === cmd || name.toLowerCase() === head);
      if (hit) return { lines: [say(`${hit} — ex cyberteam. roster locked.`, "hot")] };
      return { lines: [say(`command not found: ${head}. type help.`, "err")] };
    }
  }
}

type Props = {
  onDiscord: () => void;
  onInstagram: () => void;
  onFlash: () => void;
};

export function Terminal({ onDiscord, onInstagram, onFlash }: Props) {
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: "sys", text: "channel open — orussoyt bio" },
    { id: -1, kind: "out", text: "type help" },
  ]);
  const [input, setInput] = useState("");
  const seq = useRef(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<string[]>([]);
  const histPos = useRef(-1);

  const nid = () => seq.current++;

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    const onPing = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;
      if (typeof name !== "string") return;
      setLines((prev) => [
        ...prev,
        { id: nid(), kind: "in", text: `ping ${name}` },
        { id: nid(), kind: "hot", text: `${name} — ex cyberteam. roster locked.` },
      ]);
    };
    window.addEventListener(PING_EVENT, onPing);
    return () => window.removeEventListener(PING_EVENT, onPing);
  }, []);

  function submit(value = input) {
    const text = value.trim();
    if (!text) return;
    historyRef.current.push(text);
    histPos.current = -1;
    setInput("");
    const result = runCommand(text);
    if (result.action === "clear") {
      setLines([]);
      return;
    }
    setLines((prev) => [
      ...prev,
      { id: nid(), kind: "in", text },
      ...result.lines.map((line) => ({ ...line, id: nid() })),
    ]);
    if (result.action === "discord") onDiscord();
    if (result.action === "ig") onInstagram();
    if (result.action === "flash") onFlash();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const history = historyRef.current;
      if (!history.length) return;
      const next = histPos.current < 0 ? history.length - 1 : Math.max(0, histPos.current - 1);
      histPos.current = next;
      setInput(history[next] ?? "");
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const history = historyRef.current;
      if (histPos.current < 0) return;
      const next = histPos.current + 1;
      if (next >= history.length) {
        histPos.current = -1;
        setInput("");
      } else {
        histPos.current = next;
        setInput(history[next] ?? "");
      }
    }
  }

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-bar">
        <span className="dots">
          <button type="button" aria-label="Clear terminal" onClick={() => setLines([])} />
          <i />
          <i />
        </span>
        <span>orussoyt@bio — bash</span>
      </div>
      <div className="term-body" ref={bodyRef} aria-live="polite">
        {lines.map((line) => (
          <div key={line.id} className={`term-line ${line.kind}`}>
            {line.kind === "in" ? <span className="prompt">›</span> : null}
            {line.text}
          </div>
        ))}
      </div>
      <form
        className="term-input"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <span className="prompt prompt-long">orussoyt@bio:~$</span>
        <span className="prompt prompt-short">›</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal command"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="help"
        />
      </form>
    </div>
  );
}
