'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette, Type, Layout, Code2, Save, Eye, Copy, Check } from 'lucide-react'
import { saveDesignSettings } from '@/lib/admin/design-actions'

// ── Constants ─────────────────────────────────────────────────────────────────

const GOOGLE_FONTS: { label: string; value: string; disabled?: boolean }[] = [
  { label: '— Default (Inter / System) —', value: '' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Raleway', value: 'Raleway' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Work Sans', value: 'Work Sans' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { label: 'Outfit', value: 'Outfit' },
  { label: 'Figtree', value: 'Figtree' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Source Sans 3', value: 'Source Sans 3' },
  { label: 'Ubuntu', value: 'Ubuntu' },
  { label: '── Serif ──', value: '', disabled: true },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Libre Baskerville', value: 'Libre Baskerville' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { label: 'Lora', value: 'Lora' },
]

const BORDER_RADIUS = [
  { label: 'None', value: '0px', preview: '0' },
  { label: 'Sharp', value: '2px', preview: '2' },
  { label: 'Small', value: '4px', preview: '4' },
  { label: 'Medium', value: '6px', preview: '6' },
  { label: 'Default', value: '8px', preview: '8' },
  { label: 'Large', value: '12px', preview: '12' },
  { label: 'X-Large', value: '16px', preview: '16' },
  { label: '2X-Large', value: '24px', preview: '24' },
]

const CONTAINER_WIDTHS = [
  { label: 'Narrow (1024px)', value: '1024px' },
  { label: 'Standard (1280px)', value: '1280px' },
  { label: 'Wide (1400px)', value: '1400px' },
  { label: 'Full (1536px)', value: '1536px' },
]

const HEADING_WEIGHTS = [
  { label: 'Semi-Bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra Bold (800)', value: '800' },
  { label: 'Black (900)', value: '900' },
]

const SECTION_PADDING = [
  { label: 'Compact', value: 'sm' },
  { label: 'Normal', value: 'md' },
  { label: 'Spacious', value: 'lg' },
  { label: 'Extra Spacious', value: 'xl' },
]

// ── Helper ────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '').padEnd(6, '0')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

function safeHex(val: string, fallback: string): string {
  return /^#[0-9a-fA-F]{3,8}$/.test(val.trim()) ? val.trim() : fallback
}

// ── Inline color input ────────────────────────────────────────────────────────

function ColorInput({
  name, label, value, onChange, description,
}: {
  name: string; label: string; value: string; onChange: (v: string) => void; description?: string
}) {
  const [text, setText] = useState(value)
  useEffect(() => { setText(value) }, [value])

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
      <div className="flex items-center gap-3">
        <label className="block w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer shadow-sm hover:border-indigo-400 transition-colors shrink-0 overflow-hidden">
          <input
            type="color"
            value={value}
            onChange={(e) => { onChange(e.target.value); setText(e.target.value) }}
            className="w-12 h-12 cursor-pointer border-0 p-0 -m-1 opacity-0 absolute"
          />
          <span className="block w-full h-full" style={{ background: value }} />
        </label>
        <input
          type="text"
          value={text}
          maxLength={7}
          onChange={(e) => {
            setText(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value)
          }}
          onBlur={() => setText(value)}
          placeholder="#000000"
          className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
        />
        <div className="h-10 flex-1 rounded-lg border border-slate-200" style={{ background: value }} />
        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  )
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

type Tab = 'colors' | 'typography' | 'layout' | 'css'

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'colors', label: 'Colors', icon: <Palette size={15} /> },
    { key: 'typography', label: 'Typography', icon: <Type size={15} /> },
    { key: 'layout', label: 'Layout & Spacing', icon: <Layout size={15} /> },
    { key: 'css', label: 'Custom CSS', icon: <Code2 size={15} /> },
  ]
  return (
    <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`flex items-center gap-2 flex-1 justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            active === t.key
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  )
}

// ── Color Preview Widget ──────────────────────────────────────────────────────

function ColorPreview({ primary, secondary, navBg, navText, footerBg }: {
  primary: string; secondary: string; navBg: string; navText: string; footerBg: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden text-xs mb-6">
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: navBg }}>
        <span className="font-bold text-sm" style={{ color: navText }}>Your Brand</span>
        <div className="flex gap-3">
          {['Home', 'Services', 'Contact'].map((l) => (
            <span key={l} style={{ color: navText, opacity: 0.8 }}>{l}</span>
          ))}
        </div>
      </div>
      {/* Hero */}
      <div className="px-4 py-5 text-white" style={{ background: primary }}>
        <div className="text-base font-bold mb-1">Welcome to Your Site</div>
        <div className="opacity-80 mb-3">Transform your business with technology solutions.</div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded font-semibold text-white text-xs" style={{ background: secondary }}>Get Started</span>
          <span className="px-3 py-1 rounded font-semibold text-xs border border-white/40" style={{ color: 'white' }}>Learn More</span>
        </div>
      </div>
      {/* Content */}
      <div className="px-4 py-3 bg-white flex gap-3">
        {[1,2,3].map((i) => (
          <div key={i} className="flex-1 border border-slate-100 rounded p-2">
            <div className="w-6 h-6 rounded mb-1" style={{ background: primary, opacity: 0.15 }} />
            <div className="h-2 rounded bg-slate-200 mb-1 w-3/4" />
            <div className="h-1.5 rounded bg-slate-100 w-full" />
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="px-4 py-2.5 text-white/60 flex justify-between items-center" style={{ background: footerBg }}>
        <span>© 2026 Your Company</span>
        <span className="text-white/40 text-xs">Footer</span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  settings: Record<string, string>
}

export function DesignEditor({ settings }: Props) {
  const [tab, setTab] = useState<Tab>('colors')
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Colors
  const [primaryColor,   setPrimary]   = useState(settings['brand.primaryColor']   || '#1e3a8a')
  const [secondaryColor, setSecondary] = useState(settings['brand.secondaryColor'] || '#f97316')
  const [navColor,       setNavColor]  = useState(settings['brand.navColor']       || '#ffffff')
  const [navBgColor,     setNavBg]     = useState(settings['brand.navBgColor']     || '#1e3a8a')
  const [footerBgColor,  setFooterBg]  = useState(settings['brand.footerBgColor']  || '#1e293b')
  const [headingColor,   setHeading]   = useState(settings['brand.headingColor']   || '')
  const [bodyTextColor,  setBodyText]  = useState(settings['brand.bodyTextColor']  || '#111827')
  const [linkColor,      setLink]      = useState(settings['brand.linkColor']      || '')

  // Typography
  const [fontHeading,        setFontHeading]  = useState(settings['css.fontHeading']        || '')
  const [fontBody,           setFontBody]     = useState(settings['css.fontBody']           || '')
  const [fontHeadingWeight,  setHeadWeight]   = useState(settings['css.fontHeadingWeight']  || '700')

  // Layout
  const [borderRadius,      setBorderRadius] = useState(settings['css.borderRadius']      || '8px')
  const [containerMaxWidth, setContainer]    = useState(settings['css.containerMaxWidth'] || '1280px')
  const [sectionPadding,    setPadding]      = useState(settings['css.sectionPadding']    || 'md')

  // Custom CSS
  const [customCss, setCustomCss] = useState(settings['css.custom'] || '')

  // Live preview style injection into <head>
  useEffect(() => {
    const id = 'orion-design-preview'
    let el = document.getElementById(id) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = id
      document.head.appendChild(el)
    }
    const rgb = (hex: string) => hexToRgb(safeHex(hex, '#000000'))
    el.textContent = `:root {
      --brand-primary: ${primaryColor};
      --brand-primary-rgb: ${rgb(primaryColor)};
      --brand-secondary: ${secondaryColor};
      --brand-secondary-rgb: ${rgb(secondaryColor)};
      --brand-nav: ${navColor};
      --brand-nav-rgb: ${rgb(navColor)};
      --brand-nav-bg: ${navBgColor};
      --brand-nav-bg-rgb: ${rgb(navBgColor)};
      --brand-footer-bg: ${footerBgColor};
    }`
    return () => {}
  }, [primaryColor, secondaryColor, navColor, navBgColor, footerBgColor])

  // CSS textarea tab-key handler
  function handleCssKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const start = ta.selectionStart
      const end = ta.selectionEnd
      const newVal = customCss.substring(0, start) + '  ' + customCss.substring(end)
      setCustomCss(newVal)
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2 })
    }
  }

  const lineCount = customCss.split('\n').length

  async function handleCopy() {
    await navigator.clipboard.writeText(customCss)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <form ref={formRef} action={saveDesignSettings} className="space-y-0">
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">Changes apply to your entire website after saving.</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Eye size={14} /> Preview Site
          </a>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      <TabBar active={tab} onChange={setTab} />

      {/* ── COLORS TAB ──────────────────────────────────────────────────────── */}
      {tab === 'colors' && (
        <div className="space-y-6">
          {/* Live preview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Live Preview</h3>
            <ColorPreview
              primary={primaryColor}
              secondary={secondaryColor}
              navBg={navBgColor}
              navText={navColor}
              footerBg={footerBgColor}
            />
          </div>

          {/* Brand colors */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Brand Colors</h3>
            <p className="text-xs text-slate-400 mb-5">Core identity colors used across the site.</p>
            <div className="space-y-5">
              <ColorInput name="brand.primaryColor" label="Primary Color" description="Hero sections, buttons, headings, borders." value={primaryColor} onChange={setPrimary} />
              <ColorInput name="brand.secondaryColor" label="Secondary / Accent Color" description="CTA buttons, highlights, icons, badges." value={secondaryColor} onChange={setSecondary} />
            </div>
          </div>

          {/* Navigation colors */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Navigation</h3>
            <p className="text-xs text-slate-400 mb-5">Header / nav bar colors.</p>
            <div className="space-y-5">
              <ColorInput name="brand.navBgColor" label="Nav Background" value={navBgColor} onChange={setNavBg} />
              <ColorInput name="brand.navColor" label="Nav Text / Icon Color" value={navColor} onChange={setNavColor} />
            </div>
          </div>

          {/* Content colors */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Content Colors</h3>
            <p className="text-xs text-slate-400 mb-5">Typography and link colors across all pages.</p>
            <div className="space-y-5">
              <ColorInput name="brand.bodyTextColor" label="Body Text Color" description="Paragraph and general text." value={bodyTextColor} onChange={setBodyText} />
              <ColorInput name="brand.headingColor" label="Heading Color" description="H1–H6 headings. Leave blank to use Primary color." value={headingColor || '#111827'} onChange={setHeading} />
              <ColorInput name="brand.linkColor" label="Link Color" description="Inline link color. Leave blank to inherit from Primary." value={linkColor || primaryColor} onChange={setLink} />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Footer</h3>
            <div className="space-y-5 mt-4">
              <ColorInput name="brand.footerBgColor" label="Footer Background" value={footerBgColor} onChange={setFooterBg} />
            </div>
          </div>
        </div>
      )}

      {/* ── TYPOGRAPHY TAB ──────────────────────────────────────────────────── */}
      {tab === 'typography' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Fonts</h3>
            <p className="text-xs text-slate-400 mb-5">Uses Google Fonts — no extra configuration needed.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Body Font</label>
                <p className="text-xs text-slate-400 mb-2">Used for all paragraph and body text.</p>
                <select
                  name="css.fontBody"
                  value={fontBody}
                  onChange={(e) => setFontBody(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {GOOGLE_FONTS.map((f) => (
                    <option key={f.label} value={f.value} disabled={f.disabled}>{f.label}</option>
                  ))}
                </select>
                {fontBody && (
                  <p className="mt-2 text-xs text-indigo-600">
                    Will load: <span className="font-mono">{fontBody}</span> from Google Fonts
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Heading Font</label>
                <p className="text-xs text-slate-400 mb-2">H1–H6 headings. Leave blank to match body font.</p>
                <select
                  name="css.fontHeading"
                  value={fontHeading}
                  onChange={(e) => setFontHeading(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {GOOGLE_FONTS.map((f) => (
                    <option key={`h-${f.label}`} value={f.value} disabled={f.disabled}>{f.label}</option>
                  ))}
                </select>
                {fontHeading && (
                  <p className="mt-2 text-xs text-indigo-600">
                    Headings: <span className="font-mono">{fontHeading}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Heading Style</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Heading Weight</label>
              <div className="flex gap-3 flex-wrap">
                {HEADING_WEIGHTS.map((w) => (
                  <label key={w.value} className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border text-sm transition-colors ${fontHeadingWeight === w.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      name="css.fontHeadingWeight"
                      value={w.value}
                      checked={fontHeadingWeight === w.value}
                      onChange={() => setHeadWeight(w.value)}
                      className="sr-only"
                    />
                    <span style={{ fontWeight: parseInt(w.value) }}>{w.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Font preview */}
          {(fontBody || fontHeading) && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Font Preview</h3>
              <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                <p className="text-2xl text-slate-900" style={{ fontFamily: fontHeading ? `'${fontHeading}', sans-serif` : undefined, fontWeight: parseInt(fontHeadingWeight) }}>
                  The quick brown fox
                </p>
                <p className="text-base text-slate-600" style={{ fontFamily: fontBody ? `'${fontBody}', sans-serif` : undefined }}>
                  Transforms business through innovative software development, cloud solutions, and digital transformation.
                </p>
              </div>
              <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                Font preview requires saving and reloading to load from Google Fonts.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── LAYOUT TAB ──────────────────────────────────────────────────────── */}
      {tab === 'layout' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Border Radius</h3>
            <p className="text-xs text-slate-400 mb-5">Controls the roundness of all buttons, cards, and inputs.</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BORDER_RADIUS.map((r) => (
                <label key={r.value} className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-all ${borderRadius === r.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="css.borderRadius"
                    value={r.value}
                    checked={borderRadius === r.value}
                    onChange={() => setBorderRadius(r.value)}
                    className="sr-only"
                  />
                  <span
                    className="w-8 h-8 bg-indigo-500 block"
                    style={{ borderRadius: r.value }}
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Container Width</h3>
            <p className="text-xs text-slate-400 mb-5">Maximum width of the main content area.</p>
            <div className="grid sm:grid-cols-4 gap-3">
              {CONTAINER_WIDTHS.map((c) => (
                <label key={c.value} className={`cursor-pointer flex flex-col gap-1 p-4 rounded-xl border text-sm font-medium transition-all ${containerMaxWidth === c.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="css.containerMaxWidth"
                    value={c.value}
                    checked={containerMaxWidth === c.value}
                    onChange={() => setContainer(c.value)}
                    className="sr-only"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Section Padding</h3>
            <p className="text-xs text-slate-400 mb-5">Vertical padding for each section on the page.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SECTION_PADDING.map((p) => (
                <label key={p.value} className={`cursor-pointer flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${sectionPadding === p.value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  <input
                    type="radio"
                    name="css.sectionPadding"
                    value={p.value}
                    checked={sectionPadding === p.value}
                    onChange={() => setPadding(p.value)}
                    className="sr-only"
                  />
                  <span className="flex flex-col gap-0.5 w-8">
                    <span className="h-1 w-full bg-slate-300 rounded" />
                    <span className={`w-full bg-indigo-400 rounded ${p.value === 'sm' ? 'h-2' : p.value === 'md' ? 'h-3' : p.value === 'lg' ? 'h-4' : 'h-5'}`} />
                    <span className="h-1 w-full bg-slate-300 rounded" />
                  </span>
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          {/* Layout preview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Layout Preview</h3>
            <div className="flex justify-center">
              <div className="w-full max-w-xs bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <div className="h-3 bg-slate-300 rounded-t-xl" />
                <div className="flex flex-col items-center p-2 gap-1.5">
                  <div
                    className="w-full bg-indigo-500 flex items-center justify-center text-white text-xs"
                    style={{
                      borderRadius: borderRadius,
                      padding: sectionPadding === 'sm' ? '8px' : sectionPadding === 'md' ? '12px' : sectionPadding === 'lg' ? '16px' : '20px',
                    }}
                  >
                    Hero Section
                  </div>
                  <div className="flex gap-1 w-full">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex-1 bg-white border border-slate-200 text-xs text-slate-400 flex items-center justify-center" style={{ borderRadius: borderRadius, padding: '6px 4px' }}>
                        Card
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM CSS TAB ──────────────────────────────────────────────────── */}
      {tab === 'css' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Custom CSS</h3>
                <p className="text-xs text-slate-400 mt-0.5">Injected into every public page after all other styles. Use this to override anything.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{lineCount} line{lineCount !== 1 ? 's' : ''}</span>
                <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors">
                  {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* CSS editor hints */}
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 text-xs text-amber-700 space-y-1">
              <p><strong>Available CSS variables:</strong> <code>--brand-primary</code>, <code>--brand-secondary</code>, <code>--brand-nav-bg</code>, <code>--brand-footer-bg</code>, <code>--font-heading</code>, <code>--font-body-custom</code>, <code>--border-radius-base</code></p>
              <p>Use <strong>Tab</strong> key to indent. Press <strong>Save Changes</strong> to apply.</p>
            </div>

            {/* Snippet helpers */}
            <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap gap-2">
              {[
                { label: '+ Hide element', code: '/* Hide an element */\n.my-selector {\n  display: none;\n}\n' },
                { label: '+ Custom button', code: '.btn-custom {\n  background: var(--brand-secondary);\n  color: white;\n  border-radius: var(--border-radius-base);\n  padding: 0.75rem 1.5rem;\n  font-weight: 600;\n}\n' },
                { label: '+ Section override', code: '/* Override a section */\n.section-hero {\n  min-height: 80vh;\n  padding: 5rem 0;\n}\n' },
                { label: '+ Font override', code: 'h1, h2, h3 {\n  font-family: var(--font-heading, inherit);\n  letter-spacing: -0.025em;\n}\n' },
                { label: '+ Card style', code: '.card {\n  border-radius: var(--border-radius-base);\n  box-shadow: 0 4px 24px rgba(0,0,0,0.08);\n  border: 1px solid #e2e8f0;\n}\n' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setCustomCss((prev) => prev + (prev && !prev.endsWith('\n') ? '\n' : '') + s.code)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 font-medium transition-colors"
                >
                  {s.label}
                </button>
              ))}
              {customCss && (
                <button
                  type="button"
                  onClick={() => { if (confirm('Clear all custom CSS?')) setCustomCss('') }}
                  className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-xs text-red-600 font-medium transition-colors ml-auto"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Editor */}
            <div className="relative">
              <textarea
                name="css.custom"
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                onKeyDown={handleCssKeyDown}
                rows={24}
                spellCheck={false}
                placeholder={`/* Write any custom CSS here */\n\n/* Examples: */\n.hero {\n  min-height: 90vh;\n}\n\nbody {\n  letter-spacing: 0.01em;\n}\n\n.btn-primary {\n  border-radius: 999px; /* pill buttons */\n}`}
                className="w-full font-mono text-sm bg-slate-950 text-slate-100 px-5 py-4 resize-none focus:outline-none leading-relaxed placeholder-slate-600"
                style={{ tabSize: 2 }}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-700">
            <strong>Pro tip:</strong> Custom CSS can use any CSS variable set in Colors or Layout tabs. For example:<br />
            <code className="text-xs bg-blue-100 px-1 rounded mt-1 inline-block">a {'{ color: var(--brand-primary); }'}</code>
          </div>
        </div>
      )}
    </form>
  )
}
