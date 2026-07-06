function DecoFlowerPink() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#EC407A" transform="rotate(0 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#EC407A" transform="rotate(45 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#EC407A" transform="rotate(90 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#EC407A" transform="rotate(135 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#F48FB1" transform="rotate(22.5 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#F48FB1" transform="rotate(67.5 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#F48FB1" transform="rotate(112.5 60 60)" />
      <ellipse cx="60" cy="30" rx="18" ry="35" fill="#F48FB1" transform="rotate(157.5 60 60)" />
      <circle cx="60" cy="60" r="15" fill="#FCE4EC" />
    </svg>
  );
}

export function Newsletter({ id }: { id?: string }) {
  return (
    <section id={id ?? 'contacto'} className="py-20 relative overflow-hidden" style={{ backgroundColor: 'rgb(255, 219, 33)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.278_0.033_256.848)] mb-4">
              CONTÁCTANOS
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[oklch(0.21_0.034_264.665)] leading-tight lg:leading-[60px] mb-4">
              ¿Listo para obtener tu certificado?
            </h2>
            <p className="text-base text-[oklch(0.278_0.033_256.848)] leading-relaxed">
              Atención virtual vía Zoom y WhatsApp
            </p>
          </div>
          <div className="lg:w-1/2 w-full flex flex-col gap-4">
            <a
              href="https://wa.me/525669363221"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 px-8 text-white font-semibold text-lg transition-all hover:scale-105 rounded-sm"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Habla por WhatsApp
            </a>
            <a
              href="tel:+525669363221"
              className="flex items-center justify-center gap-3 py-4 px-8 font-semibold text-lg transition-all hover:scale-105 rounded-sm border-2"
              style={{ borderColor: 'rgb(26, 26, 46)', color: 'rgb(26, 26, 46)', backgroundColor: 'transparent' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Llámanos: 5669 363 221
            </a>
          </div>
        </div>
      </div>

      <div className="absolute top-10 right-10 w-32 h-32 opacity-80">
        <DecoFlowerPink />
      </div>
      <div className="absolute bottom-10 right-24 flex gap-2">
        <div className="w-3 h-3 rounded-[33554432px] bg-[oklch(0.21_0.034_264.665)]" />
        <div className="w-3 h-3 rounded-[33554432px] bg-[oklch(0.21_0.034_264.665)]" />
        <div className="w-3 h-3 rounded-[33554432px] bg-[oklch(0.21_0.034_264.665)]" />
        <div className="w-3 h-3 rounded-[33554432px] bg-[oklch(0.21_0.034_264.665)]" />
      </div>
    </section>
  );
}
