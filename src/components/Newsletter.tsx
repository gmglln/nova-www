const COFFEE_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cellipse cx='50' cy='40' rx='30' ry='20' fill='%23D84315'/%3E%3Cellipse cx='50' cy='38' rx='28' ry='18' fill='%23FF6B35'/%3E%3Cpath d='M25 35 Q30 20 35 35' stroke='%23FFF3E0' stroke-width='2' fill='none'/%3E%3Cpath d='M40 35 Q45 20 50 35' stroke='%23FFF3E0' stroke-width='2' fill='none'/%3E%3Cpath d='M55 35 Q60 20 65 35' stroke='%23FFF3E0' stroke-width='2' fill='none'/%3E%3Cellipse cx='50' cy='65' rx='25' ry='18' fill='%23D84315'/%3E%3Cellipse cx='50' cy='50' rx='28' ry='8' fill='%23FFAB91'/%3E%3Cpath d='M75 50 Q85 50 85 60 Q85 70 75 70' stroke='%23D84315' stroke-width='3' fill='none'/%3E%3C/svg%3E`;

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
    <section id={id} className="py-20 relative overflow-hidden" style={{ backgroundColor: 'rgb(255, 219, 33)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex items-start gap-6 lg:w-1/2">
            <div className="w-20 h-20 flex-shrink-0">
              <img src={COFFEE_SVG} alt="Coffee cup" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[oklch(0.21_0.034_264.665)] leading-tight lg:leading-[60px]">
              ¡Suscríbete para las últimas actualizaciones!
            </h2>
          </div>
          <div className="lg:w-1/2 w-full">
            <form>
              <div className="flex gap-3 mb-4">
                <input
                  type="email"
                  placeholder="Tu Dirección de Correo"
                  className="flex-1 px-6 py-4 text-[oklch(0.21_0.034_264.665)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ backgroundColor: 'rgb(251, 249, 245)' }}
                />
                <button
                  type="submit"
                  className="px-8 py-4 text-white font-semibold transition-colors whitespace-nowrap"
                  style={{ backgroundColor: 'rgb(255, 92, 42)' }}
                >
                  Comenzar
                </button>
              </div>
              <div className="flex items-start gap-3 text-left">
                <input type="checkbox" id="agree" className="mt-1 w-4 h-4 accent-orange-500" />
                <label htmlFor="agree" className="text-sm font-medium text-[oklch(0.278_0.033_256.848)]">
                  I agree that my submitted data is being{' '}
                  <span className="text-[oklch(0.646_0.222_41.116)] font-semibold">collected and stored</span>.
                </label>
              </div>
            </form>
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
