// src/pages/SimulacaoRH.tsx
import { Link } from 'react-router-dom'
import { scenarios } from '@/data/scenarios'

export default function SimulacaoRH() {
  const rh = scenarios.filter(s => s.track === 'rh')
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Simulação — RH</h1>

      {rh.map(s => (
        <div key={s.id} className="card p-6">
          <h3 className="text-xl font-semibold">{s.title}</h3>
          <p className="text-white/70 mt-2">{s.description}</p>

          {s.status === 'ready' ? (
            <Link
              to={s.route}
              className="mt-4 inline-flex rounded-2xl px-5 py-2 btn-primary"
            >
              Iniciar simulação
            </Link>
          ) : (
            <button
              disabled
              className="mt-4 inline-flex rounded-2xl px-5 py-2 bg-white/10 opacity-60 cursor-not-allowed"
            >
              Em breve
            </button>
          )}
        </div>
      ))}
    </div>
  )
}