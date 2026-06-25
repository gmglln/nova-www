const steps = [
  {
    num: '01',
    title: 'Regístrate en línea',
    desc: 'Llena el formulario en minutos o escríbenos por WhatsApp. Te orientamos desde el primer mensaje.',
  },
  {
    num: '02',
    title: 'Estudia a tu ritmo',
    desc: 'Accede al material en cualquier momento. Sin horarios fijos, sin dejar tu trabajo ni tu familia.',
  },
  {
    num: '03',
    title: 'Obtén tu certificado',
    desc: 'Culmina el proceso y recibe tu certificado de bachillerato con validez oficial en toda la República.',
  },
];

export function LectureHall({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 relative overflow-hidden" style={{ backgroundColor: 'rgb(10, 10, 26)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgb(255, 219, 33)' }}>
            EL PROCESO
          </p>
          <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight lg:leading-[75px]">
            Cómo funciona
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px z-0" style={{ backgroundColor: 'rgba(255,219,33,0.3)' }} />
              )}
              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-[33554432px] flex items-center justify-center mb-6 text-2xl font-bold"
                  style={{ backgroundColor: 'rgb(255, 219, 33)', color: 'rgb(10, 10, 26)' }}
                >
                  {num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://wa.me/525669363221"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 text-white font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Comienza tu proceso hoy
          </a>
        </div>
      </div>
    </section>
  );
}
