"use client";
import { useState } from "react";

// ─── PRICING DATA ────────────────────────────────────────────────────────────
const PRICING = {
  subscriptions: {
    "4-Step Bi-Weekly Annual":            { price: 116.40, perVisit: 58.20,  note: "12-month commitment · rate locked" },
    "4-Step Bi-Weekly Monthly":           { price: 118.80, perVisit: 59.40,  note: "Month-to-month · cancel anytime" },
    "5-Step Bi-Weekly Annual (Handful)":  { price: 188.40, perVisit: 94.20,  note: "12-month · Hofficide included" },
    "4-Step Weekly Annual":               { price: 186.00, perVisit: 46.50,  note: "12-month · 4x/month" },
  },
  addons: {
    "Hofficide Treatment":                "$65/1/8 ac (10% sub discount)",
    "Hedge Trimming (Small 5–7ft)":       "$35–$50/hedge (10% sub discount)",
    "Large Plant Trimming":               "$135–$200/plant",
    "Mulching":                           "$150 starting",
    "Pressure Washing":                   "$165/session",
    "Organic Debris Removal":             "$200/load (10% sub discount)",
    "Inorganic Debris Removal":           "$300+/load",
    "Sod – New/Bare Ground":              "$2.00/sq ft",
    "Sod – Full Replacement":             "$3.00/sq ft",
    "Irrigation Service Call":            "$75 (credited toward labor)",
    "Irrigation Labor":                   "$120/hr",
  },
  christmasLights: {
    basePricePerFt: 12,
    lightType: "C9 LED bulbs (commercial grade) — standard on all installs",
    heightMultipliers: {
      "Single Story":   1.0,
      "Two Story":      1.25,
      "Three Story+":   1.5,
    },
    electricalAdder: { min: 75, max: 150, note: "Flag for Caleb review — difficult plug-in access or chord hiding" },
    addons: {
      "Wreath (standard)":       { price: 45,  note: "Hung at door or window" },
      "Wreath (large/custom)":   { price: 85,  note: "Over 24\" or custom design" },
      "Bush Wrap":               { price: 65,  note: "Per bush, C9 wrap" },
      "Tree Wrap":               { price: 95,  note: "Per tree, C9 wrap" },
      "Custom Decor":            { price: null, note: "Flag for Caleb — quote individually" },
    },
    multiYear: {
      years: 3,
      benefit: "Locked rate — price never increases for life of agreement",
    },
    serviceFlow: [
      "Free Quote",
      "Design Mockup",
      "Product Purchase (HoffLawn supplies lights)",
      "Installation",
      "In-Season Fixes",
      "Removal",
      "Storage Until Next Season",
    ],
  },
};

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  bg:          "#0a0e04",
  surface:     "#131a07",
  border:      "#2a3512",
  gold:        "#c8a84b",
  goldDim:     "#8a7030",
  green:       "#4a7c2f",
  greenBright: "#6db842",
  text:        "#e8e0cc",
  muted:       "#7a7060",
  red:         "#c84b4b",
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 16, ...style }}>
    {children}
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>
    {children}
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: 14 }}>
    <Label>{label}</Label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div style={{ marginBottom: 14 }}>
    <Label>{label}</Label>
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 15, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    <Label>{label}</Label>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box" }}>
      <option value="">— Select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Btn = ({ children, onClick, disabled, variant = "primary", style = {} }) => {
  const bg = variant === "primary" ? C.gold : variant === "secondary" ? C.surface : C.green;
  const col = variant === "primary" ? "#0a0e04" : C.text;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? C.border : bg, color: disabled ? C.muted : col, border: variant === "secondary" ? `1px solid ${C.border}` : "none", borderRadius: 8, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", width: "100%", marginBottom: 10, letterSpacing: 0.5, ...style }}>
      {children}
    </button>
  );
};

const ResponseBox = ({ response, loading }) => {
  const [copied, setCopied] = useState(false);
  if (!response && !loading) return null;
  const copy = () => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.greenBright}33`, borderRadius: 10, padding: 16, marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: C.greenBright, letterSpacing: 2, fontFamily: "monospace" }}>CLAUDE RESPONSE</span>
        {response && <button onClick={copy} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 12px", color: C.muted, fontSize: 12, cursor: "pointer" }}>{copied ? "✓ Copied" : "Copy"}</button>}
      </div>
      {loading ? <div style={{ color: C.muted, fontSize: 14 }}>Asking Claude…</div>
        : <div style={{ color: C.text, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{response}</div>}
    </div>
  );
};

// ─── SECURE CLAUDE CALL (goes through /api/claude) ───────────────────────────
async function askClaude(prompt) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: "You are a helpful assistant for HoffLawn, a professional lawn care and landscaping business in the Sanford/Lake Mary/Longwood, Florida area. Be professional, warm, and concise. Always write as if you're speaking on behalf of HoffLawn.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "No response received.";
}

// ─── SCREEN: HOME ─────────────────────────────────────────────────────────────
const HomeScreen = ({ setScreen }) => (
  <div>
    <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 8 }}>
      <div style={{ fontSize: 13, color: C.muted, letterSpacing: 3, fontFamily: "monospace", marginBottom: 8 }}>OPERATIONS HUB</div>
      <div style={{ fontSize: 15, color: C.text }}>What do you need to do, Nicole?</div>
    </div>
    {[
      { id: "newClient",       icon: "👤", label: "New Client Setup",    sub: "Onboard a new lawn client" },
      { id: "installQuote",    icon: "🌿", label: "Installation Quote",  sub: "Build a landscape install quote" },
      { id: "christmasLights", icon: "🎄", label: "Christmas Lights",    sub: "Quote a holiday display" },
      { id: "invoice",         icon: "📋", label: "Create Invoice",      sub: "Build Jobber-ready line items" },
    ].map(item => (
      <button key={item.id} onClick={() => setScreen(item.id)}
        style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontSize: 28 }}>{item.icon}</span>
        <div>
          <div style={{ color: C.gold, fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
          <div style={{ color: C.muted, fontSize: 13 }}>{item.sub}</div>
        </div>
        <span style={{ marginLeft: "auto", color: C.muted, fontSize: 18 }}>›</span>
      </button>
    ))}
  </div>
);

// ─── SCREEN: NEW CLIENT ───────────────────────────────────────────────────────
const NewClientScreen = () => {
  const [form, setForm] = useState({ name: "", address: "", phone: "", email: "", plan: "", notes: "" });
  const [response, setResponse] = useState(""); const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const buildPrompt = () => `Set up a new HoffLawn client and write a welcome message.\n\nClient Details:\nName: ${form.name}\nAddress: ${form.address}\nPhone: ${form.phone}\nEmail: ${form.email}\nService Plan: ${form.plan}\nMonthly Price: $${PRICING.subscriptions[form.plan]?.price || "TBD"}\nNotes: ${form.notes || "none"}\n\nWrite a warm, professional welcome text/email confirming their plan, price, and what to expect on their first visit. Keep it under 150 words.`;
  const handleAsk = async () => { if (!form.name || !form.plan) return; setLoading(true); const r = await askClaude(buildPrompt()); setResponse(r); setLoading(false); };
  return (
    <div>
      <div style={{ color: C.gold, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>New Client Setup</div>
      <Card>
        <Input label="Client Name" value={form.name} onChange={set("name")} placeholder="Jane Smith" />
        <Input label="Address" value={form.address} onChange={set("address")} placeholder="123 Oak St, Lake Mary FL" />
        <Input label="Phone" value={form.phone} onChange={set("phone")} placeholder="407-555-0000" />
        <Input label="Email" value={form.email} onChange={set("email")} placeholder="jane@email.com" />
        <Select label="Service Plan" value={form.plan} onChange={set("plan")} options={Object.keys(PRICING.subscriptions)} />
        {form.plan && (
          <div style={{ background: C.bg, borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
            <span style={{ color: C.greenBright, fontSize: 13 }}>${PRICING.subscriptions[form.plan].price}/mo · ${PRICING.subscriptions[form.plan].perVisit}/visit · {PRICING.subscriptions[form.plan].note}</span>
          </div>
        )}
        <Textarea label="Notes (gate codes, dogs, special instructions)" value={form.notes} onChange={set("notes")} rows={3} />
      </Card>
      <Btn onClick={handleAsk} disabled={!form.name || !form.plan || loading}>{loading ? "Asking Claude…" : "✦ Ask Claude"}</Btn>
      <Btn variant="secondary" onClick={() => navigator.clipboard.writeText(buildPrompt())}>Copy Prompt for Claude</Btn>
      <ResponseBox response={response} loading={loading} />
    </div>
  );
};

// ─── SCREEN: INSTALL QUOTE ────────────────────────────────────────────────────
const InstallQuoteScreen = () => {
  const [form, setForm] = useState({ client: "", jobType: "", size: "", scope: "" });
  const [response, setResponse] = useState(""); const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const buildPrompt = () => `Build a HoffLawn installation quote.\n\nClient: ${form.client}\nJob Type: ${form.jobType}\nProperty Size: ${form.size}\nScope: ${form.scope}\n\nHoffLawn Pricing Reference:\n- Labor: $120/hr\n- Sod (new/bare ground): $2.00/sq ft\n- Sod (full replacement): $3.00/sq ft\n- Debris removal: $200/load organic, $300+/load inorganic\n- Irrigation service call: $75\n\nBuild a detailed line-item quote with a total range. Format it cleanly so I can read it to a client or paste into Jobber.`;
  const handleAsk = async () => { if (!form.client || !form.scope) return; setLoading(true); const r = await askClaude(buildPrompt()); setResponse(r); setLoading(false); };
  return (
    <div>
      <div style={{ color: C.gold, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Installation Quote</div>
      <Card>
        <Input label="Client Name" value={form.client} onChange={set("client")} placeholder="John Rivera" />
        <Input label="Job Type" value={form.jobType} onChange={set("jobType")} placeholder="Sod replacement, mulch beds, irrigation…" />
        <Input label="Property Size / Area" value={form.size} onChange={set("size")} placeholder="e.g. 2,400 sq ft backyard" />
        <Textarea label="Scope of Work" value={form.scope} onChange={set("scope")} placeholder="Describe everything that needs to be done…" rows={5} />
      </Card>
      <Btn onClick={handleAsk} disabled={!form.client || !form.scope || loading}>{loading ? "Building quote…" : "✦ Ask Claude"}</Btn>
      <Btn variant="secondary" onClick={() => navigator.clipboard.writeText(buildPrompt())}>Copy Prompt for Claude</Btn>
      <ResponseBox response={response} loading={loading} />
    </div>
  );
};

// ─── SCREEN: CHRISTMAS LIGHTS ─────────────────────────────────────────────────
const ChristmasLightsScreen = () => {
  const cl = PRICING.christmasLights;
  const [form, setForm] = useState({ client: "", address: "", linearFt: "", stories: "Single Story", electricalDifficult: false, addons: [], notes: "" });
  const [response, setResponse] = useState(""); const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const toggleAddon = (addon) => setForm(f => ({ ...f, addons: f.addons.includes(addon) ? f.addons.filter(a => a !== addon) : [...f.addons, addon] }));

  const calcQuote = () => {
    if (!form.linearFt || isNaN(form.linearFt)) return null;
    const ft = parseFloat(form.linearFt);
    const mult = cl.heightMultipliers[form.stories] || 1;
    const rooflineBase = ft * cl.basePricePerFt * mult;
    const addonTotal = form.addons.reduce((sum, a) => sum + (cl.addons[a]?.price || 0), 0);
    const hasCustom = form.addons.includes("Custom Decor");
    const elecMin = form.electricalDifficult ? cl.electricalAdder.min : 0;
    const elecMax = form.electricalDifficult ? cl.electricalAdder.max : 0;
    return { ft, mult, rooflineBase, addonTotal, elecMin, elecMax, totalMin: rooflineBase + addonTotal + elecMin, totalMax: rooflineBase + addonTotal + elecMax + (hasCustom ? 150 : 0), hasCustom };
  };

  const buildPrompt = (q) => {
    const addonsStr = form.addons.length ? form.addons.join(", ") : "none";
    return `Build a HoffLawn Christmas Lights proposal.\n\nClient: ${form.client}\nAddress: ${form.address}\nRoofline: ${form.linearFt} linear feet\nStories: ${form.stories} (${cl.heightMultipliers[form.stories]}x multiplier)\nBase rate: $${cl.basePricePerFt}/ft (C9 LED commercial grade)\nHeight-adjusted rate: $${(cl.basePricePerFt * cl.heightMultipliers[form.stories]).toFixed(2)}/ft\nRoofline subtotal: $${q.rooflineBase.toFixed(2)}\nAdd-ons: ${addonsStr}\nAdd-on subtotal: $${q.addonTotal.toFixed(2)}\nElectrical difficulty: ${form.electricalDifficult ? "Yes — flag for Caleb ($75–$150 adder)" : "No"}\nEstimated total: $${q.totalMin.toFixed(0)}–$${(q.totalMax || q.totalMin).toFixed(0)}\nNotes: ${form.notes || "none"}\n\nService includes: quote → mockup → HoffLawn supplies C9 lights → install → in-season fixes → removal → storage.\n\nWrite a professional proposal under 200 words. Mention the 3-year locked rate option.`;
  };

  const handleAsk = async () => { const q = calcQuote(); if (!q || !form.client) return; setLoading(true); const r = await askClaude(buildPrompt(q)); setResponse(r); setLoading(false); };
  const q = calcQuote();

  return (
    <div>
      <div style={{ color: C.gold, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Christmas Lights</div>
      <div style={{ color: C.greenBright, fontSize: 12, fontFamily: "monospace", marginBottom: 20 }}>C9 LED · Full Service · HoffLawn Supplies</div>
      <Card>
        <Input label="Client Name" value={form.client} onChange={set("client")} placeholder="The Johnson Family" />
        <Input label="Address" value={form.address} onChange={set("address")} placeholder="456 Pine Dr, Longwood FL" />
        <Input label="Roofline Linear Footage" value={form.linearFt} onChange={set("linearFt")} placeholder="e.g. 120" type="number" />
        <Select label="Home Height" value={form.stories} onChange={set("stories")} options={Object.keys(cl.heightMultipliers)} />
        {q && (
          <div style={{ background: C.bg, borderRadius: 8, padding: 14, marginBottom: 14, borderLeft: `3px solid ${C.gold}` }}>
            <div style={{ color: C.muted, fontSize: 11, letterSpacing: 2, fontFamily: "monospace", marginBottom: 8 }}>ROOFLINE ESTIMATE</div>
            <div style={{ color: C.text, fontSize: 14 }}>{q.ft} ft × ${(cl.basePricePerFt * q.mult).toFixed(2)}/ft = <span style={{ color: C.gold, fontWeight: 700 }}>${q.rooflineBase.toFixed(2)}</span></div>
            {q.mult > 1 && <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{form.stories} multiplier: {q.mult}x applied</div>}
          </div>
        )}
        <Label>Add-Ons (tap to select)</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {Object.entries(cl.addons).map(([name, { price }]) => {
            const selected = form.addons.includes(name);
            return (
              <button key={name} onClick={() => toggleAddon(name)}
                style={{ background: selected ? C.gold : C.bg, color: selected ? "#0a0e04" : C.text, border: `1px solid ${selected ? C.gold : C.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
                {name} {price ? `+$${price}` : "(custom)"}
              </button>
            );
          })}
        </div>
        {form.addons.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {form.addons.map(a => (
              <div key={a} style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>
                • {a}: {cl.addons[a]?.price ? `$${cl.addons[a].price}` : "⚑ Flag for Caleb"} — {cl.addons[a]?.note}
              </div>
            ))}
          </div>
        )}
        <button onClick={() => set("electricalDifficult")(!form.electricalDifficult)}
          style={{ width: "100%", background: form.electricalDifficult ? "#c84b4b22" : C.bg, border: `1px solid ${form.electricalDifficult ? C.red : C.border}`, borderRadius: 8, padding: "10px 14px", color: form.electricalDifficult ? C.red : C.muted, fontSize: 13, cursor: "pointer", textAlign: "left", marginBottom: 14 }}>
          ⚡ Difficult electrical access {form.electricalDifficult ? "— YES (flag for Caleb, +$75–$150)" : "— tap if cords/plug-ins are hard to hide"}
        </button>
        <Textarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Special requests, roof pitch, HOA restrictions…" rows={3} />
      </Card>
      {q && (
        <Card style={{ borderColor: C.goldDim }}>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: 2, fontFamily: "monospace", marginBottom: 12 }}>QUOTE SUMMARY</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: C.text, fontSize: 14 }}>Roofline ({q.ft} ft)</span>
            <span style={{ color: C.text, fontSize: 14 }}>${q.rooflineBase.toFixed(2)}</span>
          </div>
          {q.addonTotal > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: C.text, fontSize: 14 }}>Add-ons</span><span style={{ color: C.text, fontSize: 14 }}>${q.addonTotal.toFixed(2)}</span></div>}
          {form.electricalDifficult && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ color: C.red, fontSize: 14 }}>Electrical (⚑ Caleb reviews)</span><span style={{ color: C.red, fontSize: 14 }}>+$75–$150</span></div>}
          {q.hasCustom && <div style={{ color: C.red, fontSize: 13, marginBottom: 8 }}>⚑ Custom Decor — Caleb must quote separately</div>}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>Estimated Total</span>
            <span style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>${q.totalMin.toFixed(0)}{q.totalMax > q.totalMin ? `–$${q.totalMax.toFixed(0)}` : ""}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: C.muted }}>✦ Includes: quote → mockup → lights → install → fixes → removal → storage</div>
          <div style={{ marginTop: 4, fontSize: 12, color: C.greenBright }}>✦ 3-year agreement = rate locked forever</div>
        </Card>
      )}
      <Btn onClick={handleAsk} disabled={!form.client || !form.linearFt || loading}>{loading ? "Building proposal…" : "✦ Ask Claude — Write Proposal"}</Btn>
      <Btn variant="secondary" onClick={() => q && navigator.clipboard.writeText(buildPrompt(q))}>Copy Prompt for Claude</Btn>
      <ResponseBox response={response} loading={loading} />
    </div>
  );
};

// ─── SCREEN: INVOICE ──────────────────────────────────────────────────────────
const InvoiceScreen = () => {
  const [form, setForm] = useState({ client: "", services: "", notes: "" });
  const [response, setResponse] = useState(""); const [loading, setLoading] = useState(false);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const addonRef = Object.entries(PRICING.addons).map(([k, v]) => `${k}: ${v}`).join("\n");
  const buildPrompt = () => `Build Jobber-ready invoice line items for a HoffLawn client.\n\nClient: ${form.client}\nServices performed: ${form.services}\nNotes: ${form.notes || "none"}\n\nHoffLawn Add-On Pricing Reference:\n${addonRef}\n\nFormat as clean line items with descriptions, quantities, and prices ready to enter into Jobber. Flag anything that needs Caleb's review.`;
  const handleAsk = async () => { if (!form.client || !form.services) return; setLoading(true); const r = await askClaude(buildPrompt()); setResponse(r); setLoading(false); };
  return (
    <div>
      <div style={{ color: C.gold, fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Create Invoice</div>
      <Card>
        <Input label="Client Name" value={form.client} onChange={set("client")} placeholder="Mike Torres" />
        <Textarea label="Services Performed" value={form.services} onChange={set("services")} placeholder="Bi-weekly mow, hedge trim (3 hedges), Hofficide treatment…" rows={5} />
        <Textarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Any discounts, special situations…" rows={2} />
      </Card>
      <Card style={{ borderColor: C.border }}>
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: 2, fontFamily: "monospace", marginBottom: 10 }}>ADD-ON PRICE REFERENCE</div>
        {Object.entries(PRICING.addons).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
            <span style={{ color: C.text }}>{k}</span>
            <span style={{ color: C.gold }}>{v}</span>
          </div>
        ))}
      </Card>
      <Btn onClick={handleAsk} disabled={!form.client || !form.services || loading}>{loading ? "Building invoice…" : "✦ Ask Claude"}</Btn>
      <Btn variant="secondary" onClick={() => navigator.clipboard.writeText(buildPrompt())}>Copy Prompt for Claude</Btn>
      <ResponseBox response={response} loading={loading} />
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function HoffLawnApp() {
  const [screen, setScreen] = useState("home");
  const screenMap = {
    home:            <HomeScreen setScreen={setScreen} />,
    newClient:       <NewClientScreen />,
    installQuote:    <InstallQuoteScreen />,
    christmasLights: <ChristmasLightsScreen />,
    invoice:         <InvoiceScreen />,
  };
  const screenLabels = { home: "HoffLawn Ops", newClient: "New Client Setup", installQuote: "Installation Quote", christmasLights: "Christmas Lights", invoice: "Create Invoice" };
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Georgia', serif", color: C.text }}>
      <div style={{ background: C.bg, borderBottom: `2px solid ${C.gold}33`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
        {screen !== "home" && (
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 4 }}>←</button>
        )}
        <div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 22, color: C.gold, letterSpacing: 2, lineHeight: 1, fontWeight: 700 }}>HoffLawn</div>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: 2, marginTop: 2 }}>{screenLabels[screen].toUpperCase()}</div>
        </div>
      </div>
      <div style={{ padding: "24px 20px", maxWidth: 600, margin: "0 auto" }}>
        {screenMap[screen]}
      </div>
    </div>
  );
}
