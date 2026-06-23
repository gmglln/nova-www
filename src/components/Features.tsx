const DECO_IMG = 'https://ranch-trade-51285426.figma.site/_assets/v11/ef1d33f213015b813d890fe55317d95f47bba706.png';

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
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
      </svg>
    ),
    title: 'Cursos en línea',
    desc: 'Aprende a programar y construir soluciones digitales reales.',
  },
  {
    icon: (
      <svg {...ICON_ATTRS}>
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>
    ),
    title: 'Empoderando estudiantes',
    desc: 'Gana habilidades para prosperar en una carrera lista para el futuro.',
  },
  {
    icon: (
      <svg {...ICON_ATTRS}>
        <path d="M2 10s3-3 3-8" />
        <path d="M22 10s-3-3-3-8" />
        <path d="M10 2c0 4.4-3.6 8-8 8" />
        <path d="M14 2c0 4.4 3.6 8 8 8" />
        <path d="M2 10s2 2 2 5" />
        <path d="M22 10s-2 2-2 5" />
        <path d="M8 15h8" />
        <path d="M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
        <path d="M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    title: 'Cursos innovadores',
    desc: 'Nos especializamos en aprendizaje en línea y desarrollo de habilidades.',
  },
  {
    icon: (
      <svg {...ICON_ATTRS}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    title: 'Formación personalizada',
    desc: 'Domina idiomas globales con práctica del mundo real.',
  },
];

export function Features({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
                POTENCIADO POR LA EDUCACIÓN
              </p>
              <h2 className="text-5xl lg:text-6xl font-bold text-[oklch(0.21_0.034_264.665)] leading-tight lg:leading-[75px]">
                Mejora tus habilidades a través del aprendizaje
              </h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed mb-6">
                En Nova Impulsa, estamos comprometidos a proporcionar educación en línea accesible y de alta calidad. Nuestros diversos cursos están diseñados para empoderar a los estudiantes y fomentar el amor por el conocimiento. Cada curso está elaborado con cuidado, asegurando una experiencia de aprendizaje atractiva y efectiva.
              </p>
              <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed mb-6">
                Al aprovechar métodos de enseñanza innovadores, ayudamos a los estudiantes a alcanzar sus objetivos educativos y prepararse para sus futuras carreras.
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

      <div className="absolute top-10 right-10 w-32 h-32 opacity-60 pointer-events-none">
        <img src={DECO_IMG} alt="" className="w-full h-full object-contain" />
      </div>
    </section>
  );
}
