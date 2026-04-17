'use client'

import { useState } from 'react'

interface ColorPickerProps {
  name: string
  label: string
  defaultValue?: string
}

export function ColorPicker({ name, label, defaultValue = '#000000' }: ColorPickerProps) {
  const [color, setColor] = useState(defaultValue)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Only update the color swatch when it's a valid hex
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setColor(val)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {/* Native color picker */}
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="sr-only"
            id={`color-picker-${name}`}
            tabIndex={-1}
          />
          <label
            htmlFor={`color-picker-${name}`}
            className="block w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer shadow-sm hover:border-indigo-400 transition-colors"
            style={{ backgroundColor: color }}
            title="Click to open color picker"
          />
        </div>

        {/* Hex text input */}
        <input
          type="text"
          value={color}
          onChange={handleTextChange}
          pattern="^#[0-9a-fA-F]{6}$"
          placeholder="#000000"
          maxLength={7}
          className="block w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
        />

        {/* Color swatch preview */}
        <div
          className="h-10 w-24 rounded-lg border border-slate-200 shadow-inner"
          style={{ backgroundColor: color }}
          title="Color preview"
        />

        {/* Hidden input with the name for form submission */}
        <input type="hidden" name={name} value={color} />
      </div>
    </div>
  )
}
