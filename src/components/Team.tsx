const PLACEHOLDER_F = 'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTg2ODQ1MXww&ixlib=rb-4.1.0&q=80&w=400';
const PLACEHOLDER_M = 'https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBnbGFzc2VzJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTkwMzA3MHww&ixlib=rb-4.1.0&q=80&w=400';

const sedes = [
  { ciudad: 'Ciudad de México', estado: 'CDMX', sp: 'Líder Senior', p: 'Asesor Regional' },
  { ciudad: 'Guadalajara', estado: 'Jalisco', sp: 'Líder Senior', p: 'Asesor Regional' },
  { ciudad: 'Monterrey', estado: 'Nuevo León', sp: 'Líder Senior', p: 'Asesor Regional' },
  { ciudad: 'Puebla', estado: 'Puebla', sp: 'Líder Senior', p: 'Asesor Regional' },
  { ciudad: 'Tijuana', estado: 'Baja California', sp: 'Líder Senior', p: 'Asesor Regional' },
  { ciudad: 'León', estado: 'Guanajuato', sp: 'Líder Senior', p: 'Asesor Regional' },
  { ciudad: 'Mérida', estado: 'Yucatán', sp: 'Líder Senior', p: 'Asesor Regional' },
  { ciudad: 'Veracruz', estado: 'Veracruz', sp: 'Líder Senior', p: 'Asesor Regional' },
];

function DecoFlower() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FF9E03" transform="rotate(0 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FF9E03" transform="rotate(45 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FF9E03" transform="rotate(90 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FF9E03" transform="rotate(135 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FFA726" transform="rotate(22.5 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FFA726" transform="rotate(67.5 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FFA726" transform="rotate(112.5 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#FFA726" transform="rotate(157.5 60 60)" />
      <circle cx="60" cy="60" r="15" fill="#FFB74D" />
    </svg>
  );
}

export function Team({ id }: { id?: string }) {
  return (
    <section id={id ?? 'sedes'} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
              PRESENCIA NACIONAL
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold text-[oklch(0.21_0.034_264.665)] mb-6 leading-tight lg:leading-[75px]">
              Nuestras sedes
            </h2>
            <p className="text-lg text-[oklch(0.373_0.034_259.733)] leading-relaxed mb-8">
              8 sedes activas en la República Mexicana con líderes dedicados a acompañarte en tu proceso.
            </p>
            <div className="absolute -left-8 bottom-0 w-32 h-32 opacity-80">
              <DecoFlower />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-6">
              {sedes.map((s, i) => (
                <div key={s.ciudad} className="bg-[oklch(0.97_0.001_106.424)] rounded-[10px] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-[33554432px] overflow-hidden flex-shrink-0">
                      <img
                        src={i % 2 === 0 ? PLACEHOLDER_F : PLACEHOLDER_M}
                        alt={`Líder ${s.ciudad}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[oklch(0.21_0.034_264.665)]">{s.sp}</p>
                      <p className="text-xs text-[oklch(0.551_0.027_264.364)]">{s.p}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="text-[oklch(0.551_0.027_264.364)] flex-shrink-0">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-sm font-semibold text-[oklch(0.21_0.034_264.665)]">{s.ciudad}</p>
                    <span className="text-xs text-[oklch(0.551_0.027_264.364)]">· {s.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://wa.me/525669363221"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 text-white font-semibold transition-colors"
            style={{ backgroundColor: 'rgb(26, 26, 46)' }}
          >
            Encuentra tu sede más cercana
          </a>
        </div>
      </div>
    </section>
  );
}
