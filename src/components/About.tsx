const IMG1 = 'https://images.unsplash.com/photo-1670852714979-f73d21652a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBob2xkaW5nJTIwdGFibGV0JTIwZHJhd2luZyUyMGNvbG9yc3xlbnwxfHx8fDE3NzE5MDI2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG2 = 'https://images.unsplash.com/photo-1765648684593-e3de4074ef1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JraW5nJTIwbGFwdG9wJTIwY29mZmVlJTIwZGVza3xlbnwxfHx8fDE3NzE5MDI2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080';

const partners = [
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10H70V30H10V10Z" fill="#9CA3AF" />
    <text x="40" y="25" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">PARTNER</text>
  </svg>,
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="20" rx="35" ry="15" stroke="#9CA3AF" strokeWidth="3" />
    <text x="40" y="25" fontSize="14" fill="#9CA3AF" textAnchor="middle" fontWeight="bold">SWD</text>
  </svg>,
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 20L25 10L35 20L25 30L15 20Z" fill="#9CA3AF" />
    <text x="50" y="25" fontSize="14" fill="#9CA3AF" textAnchor="middle" fontWeight="bold">zimba</text>
  </svg>,
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15L30 10L40 15V25L30 30L20 25V15Z" fill="#9CA3AF" />
    <text x="50" y="25" fontSize="12" fill="#9CA3AF" textAnchor="middle" fontWeight="bold">SENA</text>
  </svg>,
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="40" y="25" fontSize="16" fill="#9CA3AF" textAnchor="middle" fontWeight="bold">moodle</text>
  </svg>,
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="20" r="12" fill="#9CA3AF" />
    <text x="50" y="25" fontSize="14" fill="#9CA3AF" textAnchor="middle" fontWeight="bold">TECH</text>
  </svg>,
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="40" y="25" fontSize="16" fill="#9CA3AF" textAnchor="middle" fontWeight="bold" fontStyle="italic">arfit</text>
  </svg>,
];

export function About({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="h-80 overflow-hidden">
            <img src={IMG1} alt="Learning on tablet" className="w-full h-full object-cover" />
          </div>
          <div className="h-80 overflow-hidden">
            <img src={IMG2} alt="Working on laptop" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
              EMPODERANDO ESTUDIANTES
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold text-[oklch(0.21_0.034_264.665)] leading-tight lg:leading-[75px]">
              Sobre nosotros
            </h2>
          </div>
          <div>
            <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed">
              Nova Impulsa es un proveedor líder de cursos en línea y recursos educativos, dedicado a empoderar a
              estudiantes en todo el mundo. Nuestra misión es hacer que la educación de calidad sea accesible para
              todos, sin importar su origen o ubicación.
            </p>
          </div>
          <div>
            <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed">
              Fundada en 2020, Nova Impulsa comenzó como una pequeña startup con la visión de revolucionar el
              aprendizaje en línea. Nuestro compromiso con la excelencia nos ha permitido expandir nuestra oferta de
              cursos y construir alianzas con expertos de la industria.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
            {partners.map((svg, i) => (
              <div key={i} className="opacity-40 hover:opacity-60 transition-opacity">
                {svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
