'use client'

import { useState } from 'react'

interface CountryData {
  code: string
  name: string
  flag: string
  visits: number
}

interface WorldMapWidgetProps {
  countries: CountryData[]
  totalCountries: number
}

/* Equirectangular centroids [lat, lng] */
const CENTROIDS: Record<string, [number, number]> = {
  AF:[33,65],AL:[41,20],DZ:[28,3],AO:[-12,18],AR:[-34,-64],AM:[40,45],AU:[-25,134],
  AT:[47,14],AZ:[40,48],BH:[26,51],BD:[24,90],BE:[51,4],BY:[54,28],BO:[-17,-65],
  BA:[44,17],BR:[-10,-55],BG:[43,25],KH:[13,105],CA:[60,-95],CL:[-30,-71],CN:[35,105],
  CO:[4,-73],HR:[45,16],CZ:[49,16],DK:[56,10],EG:[26,30],EE:[59,26],ET:[9,40],
  FI:[64,26],FR:[46,2],GE:[42,44],DE:[51,9],GH:[8,-2],GR:[39,22],GT:[15,-90],
  HK:[22,114],HN:[15,-87],HU:[47,19],IN:[21,78],ID:[-5,120],IR:[32,53],IQ:[33,44],
  IE:[53,-8],IL:[31,35],IT:[42,12],JP:[36,138],JO:[31,37],KZ:[48,68],KE:[-1,38],
  KR:[37,128],KW:[29,48],KG:[41,75],LA:[18,103],LV:[57,25],LB:[34,36],LY:[25,17],
  LT:[56,24],MK:[42,22],MY:[4,109],MV:[4,73],MX:[23,-102],MD:[47,29],MN:[46,105],
  MA:[32,-5],MM:[17,96],MZ:[-18,35],NL:[52,5],NZ:[-41,174],NP:[28,84],NG:[10,8],
  NO:[62,10],OM:[22,58],PK:[30,69],PE:[-10,-76],PH:[13,122],PL:[52,20],PT:[39,-8],
  QA:[25,51],RO:[46,25],RU:[61,100],SA:[24,45],SG:[1,104],SK:[49,19],SI:[46,15],
  ZA:[-30,25],ES:[40,-4],LK:[7,81],SE:[62,15],CH:[47,8],TW:[24,121],TJ:[39,71],
  TZ:[-6,35],TH:[15,101],TN:[34,9],TR:[39,35],TM:[40,60],UA:[49,32],AE:[24,54],
  GB:[54,-2],US:[38,-97],UY:[-33,-56],UZ:[41,64],VE:[8,-66],VN:[16,108],YE:[16,48],
  ZM:[-15,30],ZW:[-20,30],RS:[44,21],ME:[43,19],PG:[-6,147],CG:[-1,15],
}

const W = 1000
const H = 500

function ll(lat: number, lng: number): string {
  const x = ((lng + 180) / 360) * W
  const y = ((90 - lat) / 180) * H
  return `${x.toFixed(1)},${y.toFixed(1)}`
}

/* Continent land paths — equirectangular 1000×500 */
const CONTINENTS = [
  // North America
  `M${ll(71,-163)} L${ll(55,-165)} L${ll(58,-137)} L${ll(49,-124)} L${ll(38,-122)} L${ll(32,-117)} L${ll(23,-110)} L${ll(16,-96)} L${ll(8,-78)} L${ll(10,-83)} L${ll(15,-88)} L${ll(22,-90)} L${ll(26,-97)} L${ll(30,-90)} L${ll(25,-80)} L${ll(30,-81)} L${ll(35,-76)} L${ll(42,-70)} L${ll(47,-53)} L${ll(52,-55)} L${ll(58,-64)} L${ll(62,-78)} L${ll(63,-92)} L${ll(68,-95)} L${ll(72,-125)} L${ll(70,-141)} L${ll(71,-160)} Z`,
  // Greenland
  `M${ll(60,-44)} L${ll(76,-18)} L${ll(83,-36)} L${ll(77,-68)} L${ll(62,-50)} Z`,
  // South America
  `M${ll(12,-72)} L${ll(4,-78)} L${ll(-2,-80)} L${ll(-18,-71)} L${ll(-30,-72)} L${ll(-56,-68)} L${ll(-52,-58)} L${ll(-35,-57)} L${ll(-24,-47)} L${ll(-4,-38)} L${ll(6,-58)} L${ll(10,-62)} L${ll(12,-70)} Z`,
  // Europe
  `M${ll(38,-9)} L${ll(36,-5)} L${ll(43,5)} L${ll(38,16)} L${ll(38,23)} L${ll(37,36)} L${ll(46,34)} L${ll(52,32)} L${ll(56,38)} L${ll(61,59)} L${ll(70,30)} L${ll(71,26)} L${ll(68,18)} L${ll(60,11)} L${ll(56,10)} L${ll(54,8)} L${ll(53,5)} L${ll(51,2)} L${ll(54,-8)} L${ll(58,-5)} L${ll(51,-9)} L${ll(38,-9)} Z`,
  // Africa
  `M${ll(35,-6)} L${ll(37,10)} L${ll(33,25)} L${ll(31,32)} L${ll(15,51)} L${ll(11,51)} L${ll(-24,35)} L${ll(-35,19)} L${ll(-29,16)} L${ll(-17,12)} L${ll(-2,9)} L${ll(5,3)} L${ll(5,-1)} L${ll(15,-17)} L${ll(21,-17)} L${ll(35,-6)} Z`,
  // Asia (mainland + Middle East)
  `M${ll(37,36)} L${ll(40,43)} L${ll(42,50)} L${ll(51,60)} L${ll(66,80)} L${ll(73,110)} L${ll(72,140)} L${ll(64,177)} L${ll(58,163)} L${ll(42,140)} L${ll(35,129)} L${ll(28,121)} L${ll(23,113)} L${ll(15,108)} L${ll(8,100)} L${ll(2,104)} L${ll(7,80)} L${ll(8,77)} L${ll(19,73)} L${ll(25,62)} L${ll(22,59)} L${ll(13,45)} L${ll(23,37)} L${ll(32,35)} L${ll(40,26)} L${ll(37,36)} Z`,
  // Australia
  `M${ll(-12,131)} L${ll(-11,142)} L${ll(-28,153)} L${ll(-34,151)} L${ll(-38,145)} L${ll(-35,139)} L${ll(-32,116)} L${ll(-22,114)} L${ll(-12,131)} Z`,
  // New Zealand (North + South islands rough)
  `M${ll(-36,175)} L${ll(-39,177)} L${ll(-41,174)} L${ll(-38,175)} Z M${ll(-45,169)} L${ll(-46,167)} L${ll(-43,172)} L${ll(-44,171)} Z`,
  // Japan (simplified)
  `M${ll(43,141)} L${ll(40,141)} L${ll(34,136)} L${ll(31,131)} L${ll(34,132)} L${ll(43,141)} Z`,
  // UK (simplified)
  `M${ll(51,1)} L${ll(53,0)} L${ll(57,-4)} L${ll(58,-4)} L${ll(54,-1)} L${ll(51,1)} Z`,
  // Iceland
  `M${ll(65,-23)} L${ll(64,-14)} L${ll(63,-18)} L${ll(64,-22)} Z`,
  // Sri Lanka
  `M${ll(9,81)} L${ll(6,80)} L${ll(7,81)} Z`,
  // Taiwan
  `M${ll(25,122)} L${ll(22,121)} L${ll(23,121)} Z`,
]

export function WorldMapWidget({ countries, totalCountries }: WorldMapWidgetProps) {
  const [hovered, setHovered] = useState<CountryData | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const maxVisits = countries[0]?.visits ?? 1
  function handleMouseMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Global Reach</h3>
          <p className="text-xs text-slate-400">Visitor countries · last 30 days</p>
        </div>
        {totalCountries > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            {totalCountries} {totalCountries === 1 ? 'country' : 'countries'}
          </span>
        )}
      </div>

      {countries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center px-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" /><path d="M12 2a15 15 0 0 0 0 20M12 2a15 15 0 0 1 0 20M2 12h20" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-400">No location data yet</p>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row">
          {/* Map */}
          <div
            className="relative flex-1 overflow-hidden"
            style={{ height: 200, background: 'linear-gradient(135deg,#e0f2fe 0%,#dbeafe 100%)' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
              style={{ display: 'block' }}
            >
              {/* Graticule */}
              {Array.from({ length: 13 }, (_, i) => {
                const lng = -180 + i * 30
                const x = ((lng + 180) / 360) * W
                return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#bfdbfe" strokeWidth="0.5" opacity="0.8" />
              })}
              {Array.from({ length: 7 }, (_, i) => {
                const lat = -90 + i * 30
                const y = ((90 - lat) / 180) * H
                return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#bfdbfe" strokeWidth="0.5" opacity="0.8" />
              })}

              {/* Equator */}
              <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#93c5fd" strokeWidth="1" opacity="0.6" />

              {/* Land */}
              {CONTINENTS.map((d, i) => (
                <path key={i} d={d} fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" fillOpacity="0.9" />
              ))}

              {/* Country dots */}
              {countries.map((c, i) => {
                const centroid = CENTROIDS[c.code]
                if (!centroid) return null
                const x = ((centroid[1] + 180) / 360) * W
                const y = ((90 - centroid[0]) / 180) * H
                const norm = c.visits / maxVisits
                const r = 5 + norm * 16
                const isTop = i < 3
                const isHov = hovered?.code === c.code

                return (
                  <g key={c.code} style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHovered(c)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {isTop && (
                      <circle cx={x} cy={y} r={r + 8} fill="none" stroke="#6366f1" strokeWidth="1.5" opacity="0.25">
                        <animate attributeName="r" values={`${r+4};${r+16};${r+4}`} dur="2.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.35;0;0.35" dur="2.8s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={x} cy={y} r={r + 3} fill="#6366f1" opacity={isHov ? 0.25 : 0.1} />
                    <circle
                      cx={x} cy={y} r={r}
                      fill={isHov ? '#4f46e5' : isTop ? '#6366f1' : '#818cf8'}
                      opacity={0.9}
                    />
                    <circle cx={x - r*0.3} cy={y - r*0.3} r={r*0.3} fill="white" opacity="0.4" />
                  </g>
                )
              })}
            </svg>

            {/* Tooltip */}
            {hovered && (
              <div
                className="absolute pointer-events-none z-10 bg-white text-slate-700 text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-200 whitespace-nowrap"
                style={{ left: Math.min(mousePos.x + 14, 380), top: Math.max(mousePos.y - 38, 6) }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://flagcdn.com/w20/${hovered.code.toLowerCase()}.png`} alt="" className="inline-block w-4 h-3 object-cover rounded-sm mr-1.5 align-middle" />
                <span className="font-semibold">{hovered.name}</span>
                <span className="text-indigo-500 font-medium ml-2">{hovered.visits.toLocaleString()} visits</span>
              </div>
            )}
          </div>

          {/* Country list */}
          <div className="xl:w-56 border-t xl:border-t-0 xl:border-l border-slate-100 overflow-y-auto" style={{ maxHeight: 200 }}>
            <div className="p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Top Countries</p>
              <ul className="space-y-0.5">
                {countries.slice(0, 12).map((c, i) => {
                  const pct = Math.round((c.visits / maxVisits) * 100)
                  return (
                    <li
                      key={c.code}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-default"
                      onMouseEnter={() => setHovered(c)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span className="text-[10px] font-medium text-slate-400 w-4 text-right shrink-0">{i + 1}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} alt={c.code} className="w-5 h-3.5 object-cover rounded-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-slate-700 font-medium truncate">{c.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">{c.visits.toLocaleString()}</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: i === 0 ? '#6366f1' : i < 3 ? '#818cf8' : '#a5b4fc',
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
