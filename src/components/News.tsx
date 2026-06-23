const posts = [
  {
    img: 'https://images.unsplash.com/photo-1710438598615-f59b1c0c006b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGFwdG9wJTIwbGlicmFyeSUyMHN0dWR5aW5nfGVufDF8fHx8MTc3MTkwMzMwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Student with laptop',
    imgH: 'h-48',
    title: 'Evaluando la calidad de los cursos en línea para una educación confiable',
    comments: 'Sin Comentarios',
  },
  {
    img: 'https://images.unsplash.com/photo-1715347783356-ebe14b1b9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwc3R1ZGVudCUyMGRpc2N1c3Npb24lMjBsZWFybmluZ3xlbnwxfHx8fDE3NzE5MDMzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Teacher and student discussion',
    imgH: 'h-72',
    title: 'El impacto de la tecnología en las experiencias de aprendizaje en línea',
    comments: '2 Comentarios',
  },
  {
    img: 'https://images.unsplash.com/photo-1646385987161-5fc32bc7a539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjByZWFkaW5nJTIwYm9vayUyMG5vdGVib29rJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzcxOTAzMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Person reading book',
    imgH: 'h-56',
    title: 'Navegando el mundo de los MOOCs y certificaciones en línea',
    comments: 'Sin Comentarios',
  },
  {
    img: 'https://images.unsplash.com/photo-1608048608477-30389696fdc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwY29tcHV0ZXIlMjBkZXNrJTIwd29ya2luZ3xlbnwxfHx8fDE3NzE5MDMzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Student working at computer',
    imgH: 'h-56',
    title: 'Eligiendo el curso en línea correcto para tus metas profesionales',
    comments: 'Sin Comentarios',
  },
];

export function News({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[oklch(0.21_0.034_264.665)]">Noticias y actualizaciones</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((p) => (
            <div key={p.title} className="group cursor-pointer">
              <div className={`relative ${p.imgH} overflow-hidden mb-5`}>
                <img
                  src={p.img}
                  alt={p.imgAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-xs font-semibold mb-3 uppercase tracking-wider text-[oklch(0.446_0.03_256.802)]">
                APOYO ESTUDIANTIL
              </div>
              <h3 className="text-xl font-bold text-[oklch(0.21_0.034_264.665)] mb-3 leading-tight">{p.title}</h3>
              <div className="text-sm text-[oklch(0.551_0.027_264.364)]">7 Jul, 2025 • {p.comments}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
