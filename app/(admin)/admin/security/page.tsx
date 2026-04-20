import { auth } from '@/lib/auth'
import { AdminTopBar } from '@/components/admin/AdminTopBar'
import { runSecurityAudit, SecurityRule, RuleSeverity } from '@/lib/security-audit'
import { ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react'

const SEVERITY_COLORS: Record<RuleSeverity, string> = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-slate-100 text-slate-600',
}

const OWASP_COLORS: Record<string, string> = {
  'A01:2021': 'bg-rose-50 text-rose-700 border-rose-200',
  'A02:2021': 'bg-orange-50 text-orange-700 border-orange-200',
  'A03:2021': 'bg-amber-50 text-amber-700 border-amber-200',
  'A04:2021': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'A05:2021': 'bg-lime-50 text-lime-700 border-lime-200',
  'A06:2021': 'bg-green-50 text-green-700 border-green-200',
  'A07:2021': 'bg-teal-50 text-teal-700 border-teal-200',
  'A08:2021': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'A09:2021': 'bg-blue-50 text-blue-700 border-blue-200',
  'A10:2021': 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

function StatusIcon({ rule }: { rule: SecurityRule }) {
  if (rule.status === 'pass') return <ShieldCheck size={16} className="text-green-500 shrink-0" />
  if (rule.status === 'warn') return <AlertTriangle size={16} className="text-yellow-500 shrink-0" />
  return <ShieldX size={16} className="text-red-500 shrink-0" />
}

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 90 ? '#22c55e' : score >= 75 ? '#f97316' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={70} cy={70} r={r} fill="none" stroke="#e2e8f0" strokeWidth={12} />
        <circle
          cx={70} cy={70} r={r} fill="none"
          stroke={color} strokeWidth={12}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x={70} y={66} textAnchor="middle" fontSize={28} fontWeight={700} fill="#1e293b">{score}</text>
        <text x={70} y={84} textAnchor="middle" fontSize={12} fill="#64748b">/ 100</text>
      </svg>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold" style={{ color }}>{grade}</span>
        <span className="text-sm text-slate-500">Security Grade</span>
      </div>
    </div>
  )
}

export default async function SecurityPage() {
  const session = await auth()
  const audit   = runSecurityAudit()

  const categories = Object.entries(audit.byCategory)
  const passing  = audit.rules.filter(r => r.status === 'pass').length
  const warnings = audit.rules.filter(r => r.status === 'warn').length
  const failing  = audit.rules.filter(r => r.status === 'fail').length

  return (
    <>
      <AdminTopBar title="Security Audit" user={session!.user} />
      <div className="p-6 space-y-6">

        {/* Score + summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ScoreGauge score={audit.score} grade={audit.grade} />
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">OWASP Top 10 Security Audit</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Evaluated against the OWASP Top 10 (2021 edition). Score is weighted by rule severity.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{passing}</p>
                  <p className="text-xs text-green-700 font-medium mt-0.5">Passing</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{warnings}</p>
                  <p className="text-xs text-yellow-700 font-medium mt-0.5">Warnings</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">{failing}</p>
                  <p className="text-xs text-red-700 font-medium mt-0.5">Failing</p>
                </div>
              </div>

              {/* Category progress bars */}
              <div className="space-y-2">
                {categories.map(([cat, val]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-44 shrink-0 truncate" title={cat}>{cat}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${(val.pass / val.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-10 text-right shrink-0">{val.pass}/{val.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rules by status — failures first */}
        {[
          { label: 'Failing',  icon: <ShieldX size={15} className="text-red-500" />,    bg: 'bg-red-50',    items: audit.rules.filter(r => r.status === 'fail') },
          { label: 'Warnings', icon: <AlertTriangle size={15} className="text-yellow-500" />, bg: 'bg-yellow-50', items: audit.rules.filter(r => r.status === 'warn') },
          { label: 'Passing',  icon: <ShieldCheck size={15} className="text-green-500" />, bg: 'bg-green-50',  items: audit.rules.filter(r => r.status === 'pass') },
        ].filter(g => g.items.length > 0).map(group => (
          <div key={group.label} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`flex items-center gap-2 px-5 py-3 border-b border-slate-100 ${group.bg}`}>
              {group.icon}
              <h3 className="font-semibold text-slate-800 text-sm">{group.label} ({group.items.length})</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {group.items.map(rule => (
                <div key={rule.id} className="px-5 py-4 flex items-start gap-4">
                  <StatusIcon rule={rule} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-medium text-slate-800">{rule.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[rule.severity]}`}>
                        {rule.severity}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded border text-xs font-medium ${OWASP_COLORS[rule.owasp] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {rule.owasp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{rule.description}</p>
                    {rule.detail && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-1 inline-block">
                        {rule.detail}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{rule.category}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </>
  )
}
