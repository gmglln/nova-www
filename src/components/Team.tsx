import { useEffect, useState } from 'react';

// TODO: reemplazar con los datos reales de cada Senior/Partner cuando el cliente los envíe
// (nombre, profesión, teléfono, WhatsApp personal, biografía, video de bienvenida y fotos).
type Sede = {
  ciudad: string;
  estado: string;
  senior: {
    nombre: string;
    profesion: string;
    telefono: string;
    whatsapp: string;
    foto: string;
    bio: string;
    video: string;
  };
  partner: {
    nombre: string;
    foto: string;
  };
};

const FOTO_SENIOR = 'https://placehold.co/400x400?text=Senior';
const FOTO_PARTNER = 'https://placehold.co/400x400?text=Partner';
const VIDEO_THUMB = 'https://placehold.co/640x360?text=Video+de+bienvenida';
const WA_GENERAL = 'https://wa.me/525669363221';

const bioPlaceholder = (ciudad: string) =>
  `Director de la sede ${ciudad}. Acompaña a cada alumno de inicio a fin en su proceso de certificación, con atención personalizada vía Zoom y WhatsApp.`;

const sedes: Sede[] = [
  { ciudad: 'Ciudad de México', estado: 'CDMX' },
  { ciudad: 'Guadalajara', estado: 'Jalisco' },
  { ciudad: 'Monterrey', estado: 'Nuevo León' },
  { ciudad: 'Puebla', estado: 'Puebla' },
  { ciudad: 'Tijuana', estado: 'Baja California' },
  { ciudad: 'León', estado: 'Guanajuato' },
  { ciudad: 'Mérida', estado: 'Yucatán' },
  { ciudad: 'Veracruz', estado: 'Veracruz' },
].map(({ ciudad, estado }) => ({
  ciudad,
  estado,
  senior: {
    nombre: 'Nombre del Director',
    profesion: 'Profesión',
    telefono: '55 0000 0000',
    whatsapp: WA_GENERAL,
    foto: FOTO_SENIOR,
    bio: bioPlaceholder(ciudad),
    video: VIDEO_THUMB,
  },
  partner: {
    nombre: 'Nombre del Partner',
    foto: FOTO_PARTNER,
  },
}));

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

// Mapa de cobertura estilizado: 8 nodos (uno por sede) conectados entre sí
// con líneas curvas de ida y vuelta. Decorativo, detrás del grid de directores.
function CoverageMap() {
  // Posiciones pseudo-geográficas de las 8 ciudades sobre un lienzo 800x500
  const nodes = [
    { x: 420, y: 330 }, // CDMX
    { x: 330, y: 300 }, // Guadalajara
    { x: 400, y: 180 }, // Monterrey
    { x: 470, y: 340 }, // Puebla
    { x: 90, y: 80 },   // Tijuana
    { x: 380, y: 280 }, // León
    { x: 680, y: 330 }, // Mérida
    { x: 520, y: 310 }, // Veracruz
  ];
  const links: Array<[number, number]> = [
    [4, 2], [2, 1], [1, 5], [5, 0], [0, 3], [3, 7], [7, 6], [0, 6], [2, 0], [1, 0],
  ];
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }, lift: number) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - lift;
    return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  };
  return (
    <svg
      viewBox="0 0 800 500"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {links.map(([from, to], i) => (
        <g key={i} stroke="rgb(255, 158, 3)" fill="none" strokeWidth="1.5" opacity="0.25">
          {/* ida y vuelta: dos curvas con arco opuesto */}
          <path d={curve(nodes[from], nodes[to], 40)} />
          <path d={curve(nodes[from], nodes[to], -40)} strokeDasharray="6 6" />
        </g>
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="10" fill="rgb(255, 158, 3)" opacity="0.15" />
          <circle cx={n.x} cy={n.y} r="4" fill="rgb(255, 158, 3)" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

function WhatsAppBadge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function SedeModal({ sede, onClose }: { sede: Sede; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Director de la sede ${sede.ciudad}`}
    >
      <div
        className="bg-white rounded-[10px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-[33554432px] bg-[oklch(0.97_0.001_106.424)] flex items-center justify-center text-[oklch(0.21_0.034_264.665)] hover:bg-gray-200 transition-colors font-medium block"
          aria-label="Cerrar"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-[33554432px] overflow-hidden flex-shrink-0">
            <img src={sede.senior.foto} alt={sede.senior.nombre} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-lg leading-[27px] font-bold text-[oklch(0.21_0.034_264.665)]">{sede.senior.nombre}</h3>
            <p className="text-sm text-[oklch(0.551_0.027_264.364)]">{sede.senior.profesion}</p>
            <p className="text-sm text-[oklch(0.551_0.027_264.364)]">Tel: {sede.senior.telefono}</p>
            <p className="text-xs font-semibold text-[oklch(0.551_0.027_264.364)] uppercase tracking-wide mt-1">
              Sede {sede.ciudad} · {sede.estado}
            </p>
          </div>
        </div>

        <p className="text-sm text-[oklch(0.446_0.03_256.802)] leading-relaxed mb-6">{sede.senior.bio}</p>

        <div className="relative rounded-[10px] overflow-hidden mb-6 cursor-pointer group">
          <img src={sede.senior.video} alt="Video de bienvenida" className="w-full aspect-video object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-[33554432px] bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                className="w-6 h-6 ml-1 text-[oklch(0.21_0.034_264.665)]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-[oklch(0.97_0.001_106.424)] rounded-[10px] p-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-3">
            Partner de esta sede
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[33554432px] overflow-hidden flex-shrink-0">
              <img src={sede.partner.foto} alt={sede.partner.nombre} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-[oklch(0.21_0.034_264.665)]">{sede.partner.nombre}</p>
              <p className="text-xs text-[oklch(0.551_0.027_264.364)]">Partner · Sede {sede.ciudad}</p>
            </div>
          </div>
        </div>

        <a
          href={sede.senior.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 text-white font-semibold rounded-sm transition-all hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          <WhatsAppBadge />
          WhatsApp directo — Sede {sede.ciudad}
        </a>
      </div>
    </div>
  );
}

export function Team({ id }: { id?: string }) {
  const [selected, setSelected] = useState<Sede | null>(null);

  return (
    <section id={id ?? 'sedes'} className="py-20 bg-white relative overflow-hidden">
      <CoverageMap />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
              PRESENCIA NACIONAL
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold text-[oklch(0.21_0.034_264.665)] mb-6 leading-tight lg:leading-[75px]">
              Nuestras sedes
            </h2>
            <p className="text-lg text-[oklch(0.373_0.034_259.733)] leading-relaxed mb-8">
              8 sedes activas en la República Mexicana con directores dedicados a acompañarte en tu proceso.
              Toca la foto de cada director para conocerlo.
            </p>
            <div className="absolute -left-8 bottom-0 w-32 h-32 opacity-80">
              <DecoFlower />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-6">
              {sedes.map((s) => (
                <div
                  key={s.ciudad}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(s)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected(s);
                    }
                  }}
                  className="bg-[oklch(0.97_0.001_106.424)] rounded-[10px] p-6 text-left transition-shadow hover:shadow-md cursor-pointer"
                  aria-label={`Ver información del director de la sede ${s.ciudad}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-[33554432px] overflow-hidden">
                        <img src={s.senior.foto} alt={`Director ${s.ciudad}`} className="w-full h-full object-cover" />
                      </div>
                      <a
                        href={s.senior.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-[33554432px] flex items-center justify-center"
                        style={{ backgroundColor: '#25D366' }}
                        aria-label={`WhatsApp del director de ${s.ciudad}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[oklch(0.21_0.034_264.665)]">{s.senior.nombre}</p>
                      <p className="text-xs text-[oklch(0.551_0.027_264.364)]">Director Senior</p>
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
      </div>

      {selected && <SedeModal sede={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
