'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

const inputClass = 'block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

const HEIGHT_PRESETS = ['100vh', '90vh', '80vh', '70vh', '600px', '700px', '800px', '500px']

const POSITION_OPTIONS = [
  { value: 'center center', label: 'Center' },
  { value: 'top center',    label: 'Top Center' },
  { value: 'bottom center', label: 'Bottom Center' },
  { value: 'center left',   label: 'Center Left' },
  { value: 'center right',  label: 'Center Right' },
  { value: 'top left',      label: 'Top Left' },
  { value: 'top right',     label: 'Top Right' },
  { value: 'bottom left',   label: 'Bottom Left' },
  { value: 'bottom right',  label: 'Bottom Right' },
]

interface Props {
  defaultUrl:      string
  defaultOpacity:  string
  defaultHeight:   string
  defaultPosition: string
}

export function HeroImageInput({ defaultUrl, defaultOpacity, defaultHeight, defaultPosition }: Props) {
  const [url,      setUrl]      = useState(defaultUrl)
  const [opacity,  setOpacity]  = useState(defaultOpacity)
  const [height,   setHeight]   = useState(defaultHeight || '100vh')
  const [position, setPosition] = useState(defaultPosition || 'center center')
  const [imgOk,    setImgOk]    = useState(true)

  return (
    <div className="space-y-4">
      {/* Row 1: URL + Opacity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label htmlFor="home.hero.backgroundImage" className="block text-sm font-medium text-slate-700">
            Background Image URL
          </label>
          <input
            id="home.hero.backgroundImage"
            name="home.hero.backgroundImage"
            type="text"
            value={url}
            onChange={e => { setUrl(e.target.value); setImgOk(true) }}
            placeholder="https://... or /assets/images/hero-bg.jpg"
            className={inputClass}
          />
          <p className="text-xs text-slate-400">Paste a full URL or public path. Leave blank to use the colour gradient.</p>
        </div>
        <div className="space-y-1">
          <label htmlFor="home.hero.overlayOpacity" className="block text-sm font-medium text-slate-700">
            Overlay Opacity (0–1)
          </label>
          <input
            id="home.hero.overlayOpacity"
            name="home.hero.overlayOpacity"
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={opacity}
            onChange={e => setOpacity(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-slate-400">Higher = darker overlay.</p>
        </div>
      </div>

      {/* Row 2: Height + Image Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="home.hero.height" className="block text-sm font-medium text-slate-700">
            Section Height
          </label>
          <input
            id="home.hero.height"
            name="home.hero.height"
            type="text"
            value={height}
            onChange={e => setHeight(e.target.value)}
            placeholder="100vh"
            className={inputClass}
          />
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {HEIGHT_PRESETS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setHeight(p)}
                className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                  height === p
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="home.hero.imagePosition" className="block text-sm font-medium text-slate-700">
            Image Focus Point
          </label>
          <select
            id="home.hero.imagePosition"
            name="home.hero.imagePosition"
            value={position}
            onChange={e => setPosition(e.target.value)}
            className={inputClass}
          >
            {POSITION_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400">Which part of the image stays visible when cropped.</p>
        </div>
      </div>

      {/* Live preview */}
      {url ? (
        <div
          className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900"
          style={{ minHeight: '176px', height: '176px' }}
        >
          {imgOk && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: position }}
              onError={() => setImgOk(false)}
            />
          )}
          <div
            className="absolute inset-0 bg-[#1e3a8a]"
            style={{ opacity: Math.min(1, Math.max(0, parseFloat(opacity) || 0.65)) }}
          />
          {!imgOk && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
              <ImageIcon size={24} />
              <span className="text-xs">Image could not be loaded — check the URL</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 text-white/60 text-xs font-medium">Preview · {height} · {position}</div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 h-44 bg-gradient-to-br from-primary-950 via-primary to-primary-800 flex items-center justify-center">
          <span className="text-white/50 text-xs">No image — gradient will be used</span>
        </div>
      )}
    </div>
  )
}
