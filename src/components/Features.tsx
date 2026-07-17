const ICON_BG = 'rgb(255, 232, 229)';
const ICON_COLOR = 'rgb(255, 158, 3)';

const ICON_ATTRS = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'w-8 h-8',
  style: { color: ICON_COLOR },
};

const features = [
  {
    icon: (
      <svg {...ICON_ATTRS}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Termina en 12 semanas',
    desc: 'Más rápido que el sistema tradicional. Obtén tu certificado en solo 3 meses.',
  },
  {
    icon: (
      <svg {...ICON_ATTRS}>
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
    title: 'Sin horarios fijos',
    desc: 'Estudia cuando puedas. Sin dejar de trabajar ni descuidar a tu familia.',
  },
  {
    icon: (
      <svg {...ICON_ATTRS}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Asesoría personalizada',
    desc: 'Acompañamiento real de inicio a fin. Siempre hay alguien disponible para apoyarte.',
  },
  {
    icon: (
      <svg {...ICON_ATTRS}>
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Certificado oficial',
    desc: 'Validez oficial nacional y en el extranjero. Abre puertas a estudios superiores y trabajo.',
  },
];

export function Features({ id }: { id?: string }) {
  return (
    <section id={id ?? 'beneficios'} className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
                POR QUÉ ELEGIRNOS
              </p>
              <h2 className="text-5xl lg:text-6xl font-bold text-[oklch(0.21_0.034_264.665)] leading-tight lg:leading-[75px]">
                Estudia a tu ritmo, certifícate con nosotros
              </h2>
              <img
                src="/images/elvis-academico.webp"
                alt="Elvis, la mascota del centro, estudiando"
                className="hidden lg:block absolute -top-4 right-0 w-24 h-24 rounded-[33554432px] object-cover object-[50%_15%] border-4 border-white shadow-lg rotate-6"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed mb-6">
                Somos un centro de enlace y capacitación especializado en ayudar a jóvenes y adultos a terminar su
                preparatoria en modalidad virtual, de forma rápida, accesible y con acompañamiento personalizado.
              </p>
              <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed mb-6">
                Sabemos que detrás de cada inscripción hay una historia, un esfuerzo y un deseo de superarse. Por eso
                trabajamos con responsabilidad y empatía para garantizar un proceso confiable y efectivo.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon, title, desc }) => (
            <div key={title}>
              <div className="mb-4 inline-block p-4 rounded-[10px]" style={{ backgroundColor: ICON_BG }}>
                {icon}
              </div>
              <h3 className="text-xl font-bold text-[oklch(0.21_0.034_264.665)] mb-3">{title}</h3>
              <p className="text-sm text-[oklch(0.446_0.03_256.802)]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
