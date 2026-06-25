const HERO_IMG = 'https://images.unsplash.com/photo-1589829100333-e215933ccd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY29sb3JmdWwlMjBjcmVhdGl2ZSUyMHdvcmt8ZW58MXx8fHwxNzcxOTAyODgyfDA&ixlib=rb-4.1.0&q=80&w=1080';

const attributes = [
  { icon: '⏱', label: '12 semanas' },
  { icon: '💻', label: '100% en línea' },
  { icon: '🏛', label: 'Validez oficial' },
  { icon: '🗓', label: 'Sin horarios fijos' },
];

export function Courses({ id }: { id?: string }) {
  return (
    <section id={id ?? 'servicios'} className="py-20 relative overflow-hidden" style={{ backgroundColor: 'rgb(241, 238, 227)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)]">
            LO QUE OFRECEMOS
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[oklch(0.21_0.034_264.665)] max-w-xl text-right">
            Un programa diseñado para ti
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-[10px] overflow-hidden">
            <img src={HERO_IMG} alt="Certificación en bachillerato" className="w-full h-80 object-cover" />
          </div>

          <div className="bg-white rounded-[10px] p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-3">
              PROGRAMA PRINCIPAL
            </p>
            <h3 className="text-3xl font-bold text-[oklch(0.21_0.034_264.665)] mb-4 leading-tight">
              Certificación en Bachillerato
            </h3>
            <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed mb-8">
              Obtén tu certificado de preparatoria con validez oficial en toda la República Mexicana. Estudia a
              tu ritmo, sin horarios fijos, con el acompañamiento personalizado de nuestros asesores.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {attributes.map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm font-semibold text-[oklch(0.21_0.034_264.665)]">{label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <p className="text-2xl font-bold text-[oklch(0.21_0.034_264.665)]">
                Inscripción desde <span style={{ color: 'rgb(255, 158, 3)' }}>$700</span>
              </p>
              <p className="text-sm text-[oklch(0.551_0.027_264.364)] mt-1">
                Mensualidades accesibles · Pregunta por las becas disponibles
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/525669363221"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 text-white font-semibold text-center transition-colors rounded-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: '#25D366' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Habla por WhatsApp
              </a>
              <a
                href="#contacto"
                className="flex-1 py-4 font-semibold text-center transition-colors rounded-sm border-2"
                style={{ borderColor: 'rgb(26, 26, 46)', color: 'rgb(26, 26, 46)' }}
              >
                Más información
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 w-48 h-32 opacity-70 pointer-events-none">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 60Q30 20 60 30T90 60Q90 100 120 90T150 60Q150 20 180 30" stroke="#4169E1" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M40 80Q60 90 80 80" stroke="#4169E1" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M160 50L160 90" stroke="#4169E1" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
