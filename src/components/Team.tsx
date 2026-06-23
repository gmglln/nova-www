const members = [
  {
    name: 'James Robinson',
    role: 'Desarrollo de Negocios',
    img: 'https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBnbGFzc2VzJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTkwMzA3MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Emily Carter',
    role: 'Consultoría Estratégica',
    img: 'https://images.unsplash.com/photo-1770235622504-3851a96ac6ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwc3VpdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTg0OTEzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Sofia Martínez',
    role: 'Diseño de Producto',
    img: 'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTg2ODQ1MXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Maria Chen',
    role: 'Innovación Tecnológica',
    img: 'https://images.unsplash.com/photo-1629507313712-f21468afdf2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTgyNjc0MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
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
    <section id={id} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
              CONOCE A NUESTRO EQUIPO
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold text-[oklch(0.21_0.034_264.665)] mb-6 leading-tight lg:leading-[75px]">
              Nuestro equipo
            </h2>
            <p className="text-lg text-[oklch(0.373_0.034_259.733)] leading-relaxed mb-8">
              Somos más de 120 personas de todo el mundo impulsadas por ideas audaces
            </p>
            <div className="absolute -left-8 bottom-0 w-32 h-32 opacity-80">
              <DecoFlower />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-8">
              {members.map((m) => (
                <div key={m.name} className="group">
                  <div className="relative rounded-[10px] overflow-hidden mb-4" style={{ height: '420px' }}>
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[oklch(0.21_0.034_264.665)] mb-2">{m.name}</h3>
                  <p className="text-base text-[oklch(0.551_0.027_264.364)]">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
