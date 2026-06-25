const graduates = [
  {
    img: 'https://images.unsplash.com/photo-1710438598615-f59b1c0c006b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGFwdG9wJTIwbGlicmFyeSUyMHN0dWR5aW5nfGVufDF8fHx8MTc3MTkwMzMwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Egresada con certificado',
    name: 'Ana Rodríguez',
    sede: 'Ciudad de México',
    year: '2024',
  },
  {
    img: 'https://images.unsplash.com/photo-1715347783356-ebe14b1b9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwc3R1ZGVudCUyMGRpc2N1c3Npb24lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzE5MDMzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Egresado feliz',
    name: 'Carlos Morales',
    sede: 'Guadalajara',
    year: '2025',
  },
  {
    img: 'https://images.unsplash.com/photo-1646385987161-5fc32bc7a539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMG5vdGVib29rJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzcxOTAzMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Egresada estudiando',
    name: 'Laura Vázquez',
    sede: 'Monterrey',
    year: '2025',
  },
  {
    img: 'https://images.unsplash.com/photo-1608048608477-30389696fdc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY29tcHV0ZXIlMjBkZXNrJTIwd29ya2luZ3xlbnwxfHx8fDE3NzE5MDMzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Egresado con computadora',
    name: 'Miguel Hernández',
    sede: 'Puebla',
    year: '2024',
  },
];

export function News({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
            NUESTROS EGRESADOS
          </p>
          <h2 className="text-5xl font-bold text-[oklch(0.21_0.034_264.665)]">Historias de éxito</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {graduates.map((g) => (
            <div key={g.name} className="group cursor-pointer">
              <div className="relative h-56 overflow-hidden mb-5 rounded-[10px]">
                <img
                  src={g.img}
                  alt={g.imgAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-sm text-white"
                    style={{ backgroundColor: 'rgb(255, 219, 33)', color: 'rgb(10, 10, 26)' }}
                  >
                    Egresado {g.year}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[oklch(0.21_0.034_264.665)] mb-1">{g.name}</h3>
              <div className="flex items-center gap-1 text-sm text-[oklch(0.551_0.027_264.364)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Sede {g.sede}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
