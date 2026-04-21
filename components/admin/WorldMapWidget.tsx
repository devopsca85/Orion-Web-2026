'use client'

import { useRef, useState } from 'react'

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

/* ── Country centroids (lat, lng) ──────────────────────────────────────── */
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

const W = 800
const H = 400

function latLngToXY(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * W
  const y = ((90 - lat) / 180) * H
  return [x, y]
}

/* Simplified world land outline paths (equirectangular projection 800×400) */
const LAND_PATH = `
M200,100 L180,110 L160,130 L150,160 L155,185 L170,200 L165,220 L150,240
L140,265 L145,285 L160,300 L175,310 L185,295 L195,280 L210,265 L215,250
L225,240 L230,220 L220,200 L225,180 L235,165 L250,155 L255,140 L245,125
L230,110 L215,100 Z
M230,90 L240,85 L260,80 L275,75 L290,80 L310,90 L320,100 L315,115
L300,120 L285,115 L270,120 L255,115 L240,105 Z
M245,130 L260,125 L280,130 L295,140 L310,155 L320,170 L315,185 L300,195
L285,190 L270,185 L255,175 L245,160 L240,145 Z
M310,80 L325,75 L345,70 L370,68 L395,70 L415,78 L430,90 L435,105
L425,118 L410,125 L390,128 L370,125 L350,118 L335,108 L318,95 Z
M330,125 L350,120 L370,125 L390,130 L405,145 L410,160 L405,178
L390,188 L370,190 L350,185 L335,175 L325,160 L320,145 Z
M380,68 L400,60 L420,55 L445,58 L465,65 L480,78 L490,95 L485,112
L470,120 L450,118 L430,110 L415,100 L400,88 L385,78 Z
M440,55 L465,48 L490,45 L515,48 L535,58 L545,72 L540,88 L525,98
L505,100 L485,95 L468,85 L455,72 Z
M490,75 L510,68 L535,70 L555,80 L568,95 L570,112 L560,128 L545,135
L525,132 L508,122 L496,108 L488,92 Z
M530,65 L555,58 L578,60 L598,72 L610,88 L608,105 L595,115 L575,118
L555,112 L540,100 L532,85 Z
M570,88 L590,82 L615,85 L635,98 L645,115 L640,132 L625,142 L605,140
L585,132 L572,118 L565,103 Z
M600,80 L620,72 L645,75 L665,88 L675,105 L670,122 L655,132 L635,130
L618,120 L606,105 L598,90 Z
M640,70 L665,62 L695,65 L715,80 L722,98 L715,115 L700,122 L678,120
L660,110 L648,95 Z
M670,65 L700,58 L730,62 L748,78 L752,96 L745,112 L728,120 L710,118
L692,108 L678,93 Z
M710,60 L740,55 L766,60 L780,76 L782,94 L775,110 L758,118 L740,116
L722,106 L710,90 Z
M750,70 L775,62 L798,68 L800,85 L798,100 L785,110 L768,108
L752,98 L742,83 Z
M138,110 L155,105 L170,112 L178,128 L175,145 L162,152 L148,148
L138,135 L132,120 Z
M420,150 L440,145 L460,150 L472,165 L470,182 L455,190 L438,188
L422,178 L414,163 Z
M442,188 L462,183 L480,190 L488,206 L485,223 L470,230 L452,228
L438,218 L432,202 Z
M455,228 L475,223 L492,230 L498,248 L494,265 L478,272 L460,268
L448,256 L444,240 Z
M462,268 L482,262 L500,270 L505,288 L500,306 L484,312 L466,308
L454,296 L452,278 Z
M455,310 L474,304 L492,312 L496,330 L490,348 L474,353 L456,348
L445,335 L444,317 Z
M72,122 L92,115 L110,120 L118,138 L115,155 L100,163 L85,160
L74,148 L68,133 Z
M95,155 L115,148 L132,155 L140,172 L136,190 L120,197 L104,194
L92,182 L88,165 Z
M100,195 L120,188 L138,196 L144,214 L140,232 L124,238 L108,234
L98,222 L96,205 Z
M108,235 L128,228 L145,236 L150,254 L145,272 L130,278 L114,274
L104,262 L102,245 Z
`

export function WorldMapWidget({ countries, totalCountries }: WorldMapWidgetProps) {
  const [hovered, setHovered] = useState<CountryData | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const maxVisits = countries[0]?.visits ?? 1

  function getDotRadius(visits: number): number {
    const normalized = visits / maxVisits
    return 4 + normalized * 14
  }

  function handleMouseMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const graticuleLines: string[] = []
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * W
    graticuleLines.push(`M${x},0 L${x},${H}`)
  }
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = ((90 - lat) / 180) * H
    graticuleLines.push(`M0,${y} L${W},${y}`)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Global Reach</h3>
          <p className="text-xs text-slate-400 mt-0.5">Visitor countries · last 30 days</p>
        </div>
        {totalCountries > 0 && (
          <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            {totalCountries} {totalCountries === 1 ? 'country' : 'countries'}
          </div>
        )}
      </div>

      {countries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15 15 0 0 0 0 20M12 2a15 15 0 0 1 0 20M2 12h20" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500">No location data yet</p>
          <p className="text-xs text-slate-400 mt-1">Country data populates once visitor traffic arrives</p>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row">
          {/* Map */}
          <div
            className="relative flex-1 bg-slate-900 overflow-hidden"
            style={{ minHeight: 260 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
              style={{ display: 'block' }}
            >
              <defs>
                <radialGradient id="mapBg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
                <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Background */}
              <rect width={W} height={H} fill="url(#mapBg)" />

              {/* Graticule grid */}
              {graticuleLines.map((d, i) => (
                <path key={i} d={d} stroke="#1e3a5f" strokeWidth="0.5" fill="none" opacity="0.5" />
              ))}

              {/* Land silhouette */}
              <path d={LAND_PATH} fill="#1e3a5f" fillOpacity="0.6" stroke="#2d4a6e" strokeWidth="0.5" />

              {/* Equator highlight */}
              <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#ffffff" strokeWidth="0.3" opacity="0.2" />

              {/* Country dots */}
              {countries.map((c, i) => {
                const centroid = CENTROIDS[c.code]
                if (!centroid) return null
                const [x, y] = latLngToXY(centroid[0], centroid[1])
                const r = getDotRadius(c.visits)
                const isTop3 = i < 3
                const isHovered = hovered?.code === c.code

                return (
                  <g key={c.code} style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHovered(c)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Outer pulse ring for top 3 */}
                    {isTop3 && (
                      <circle cx={x} cy={y} r={r + 8} fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.3">
                        <animate attributeName="r" values={`${r + 4};${r + 16};${r + 4}`} dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* Glow halo */}
                    <circle cx={x} cy={y} r={r + 4} fill="#6366f1" opacity={isHovered ? 0.3 : 0.12} />
                    {/* Main dot */}
                    <circle
                      cx={x} cy={y} r={r}
                      fill={isHovered ? '#a5b4fc' : isTop3 ? '#818cf8' : '#4f46e5'}
                      opacity={isHovered ? 1 : 0.9}
                      filter={isTop3 ? 'url(#glow)' : undefined}
                    />
                    {/* Inner highlight */}
                    <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="white" opacity="0.3" />
                  </g>
                )
              })}
            </svg>

            {/* Tooltip */}
            {hovered && (
              <div
                className="absolute pointer-events-none z-10 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-slate-600 whitespace-nowrap"
                style={{
                  left: Math.min(mousePos.x + 12, 340),
                  top: Math.max(mousePos.y - 36, 8),
                }}
              >
                <span className="mr-1.5">{hovered.flag}</span>
                <span className="font-medium">{hovered.name}</span>
                <span className="text-indigo-300 ml-2">{hovered.visits.toLocaleString()} visits</span>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" /> Low
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-indigo-400" /> Med
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-4 h-4 rounded-full bg-indigo-300" /> High
              </span>
            </div>
          </div>

          {/* Country list */}
          <div className="xl:w-52 border-t xl:border-t-0 xl:border-l border-slate-100">
            <div className="p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Top Countries</p>
              <ul className="space-y-0.5">
                {countries.slice(0, 10).map((c, i) => {
                  const pct = Math.round((c.visits / maxVisits) * 100)
                  return (
                    <li
                      key={c.code}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-default"
                      onMouseEnter={() => setHovered(c)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span className="text-xs font-medium text-slate-400 w-4 text-right shrink-0">{i + 1}</span>
                      <span className="text-base leading-none">{c.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-slate-700 font-medium truncate">{c.name}</span>
                          <span className="text-xs text-slate-400 shrink-0 ml-1">{c.visits.toLocaleString()}</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: i === 0
                                ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                                : i < 3
                                ? 'linear-gradient(90deg, #4f46e5, #6366f1)'
                                : '#818cf8',
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
