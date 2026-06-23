const STAR_PATH = 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z';

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="lucide lucide-star w-4 h-4 text-[oklch(0.852_0.199_91.936)]">
      <path d={STAR_PATH} />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="lucide lucide-calendar w-4 h-4">
      <path d="M8 2v4" /><path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

const INSTRUCTOR_IMG = 'https://images.unsplash.com/photo-1544972917-3529b113a469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0cnVjdG9yJTIwdGVhY2hlciUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTkwMjg4M3ww&ixlib=rb-4.1.0&q=80&w=1080';

const courses = [
  {
    title: 'Fundamentos de diseño gráfico',
    hours: '8 horas',
    gradient: 'bg-gradient-to-br from-orange-200 via-pink-200 to-yellow-200',
    img: 'https://images.unsplash.com/photo-1589829100333-e215933ccd67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwY29sb3JmdWwlMjBjcmVhdGl2ZSUyMHdvcmt8ZW58MXx8fHwxNzcxOTAyODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Graphic design essentials',
    instructor: 'Mark Thompson',
  },
  {
    title: 'Fundamentos de marketing digital',
    hours: '6 horas',
    gradient: 'bg-gradient-to-br from-blue-200 via-cyan-200 to-teal-200',
    img: 'https://images.unsplash.com/photo-1709281847802-9aef10b6d4bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwd29ya3NwYWNlJTIwbGFwdG9wfGVufDF8fHx8MTc3MTkwMjg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Digital marketing fundamentals',
    instructor: 'Mark Thompson',
  },
  {
    title: 'Introducción al desarrollo web',
    hours: '5 horas',
    gradient: 'bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400',
    img: 'https://images.unsplash.com/photo-1637937459053-c788742455be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZyUyMGNvbXB1dGVyJTIwc2NyZWVufGVufDF8fHx8MTc3MTkwMjg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    imgAlt: 'Web development introduction',
    instructor: 'Mark Thompson',
  },
];

export function Courses({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 relative overflow-hidden" style={{ backgroundColor: 'rgb(241, 238, 227)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)]">
            COMIENZA A APRENDER AHORA
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[oklch(0.21_0.034_264.665)] max-w-xl text-right">
            Explora nuestros cursos en línea populares
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {courses.map((c) => (
            <div key={c.title} className="bg-[oklch(0.985_0.002_247.839)] rounded-[10px] overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className={`relative h-56 overflow-hidden ${c.gradient}`}>
                <img src={c.img} alt={c.imgAlt} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex gap-1 mb-3">
                  {[0,1,2,3,4].map((i) => <StarIcon key={i} />)}
                </div>
                <h3 className="text-xl font-bold text-[oklch(0.21_0.034_264.665)] mb-3">{c.title}</h3>
                <div className="flex items-center gap-2 text-sm text-[oklch(0.446_0.03_256.802)] mb-4">
                  <CalendarIcon />
                  <span>{c.hours}</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-[33554432px] overflow-hidden">
                    <img src={INSTRUCTOR_IMG} alt={c.instructor} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm text-[oklch(0.446_0.03_256.802)]">Por {c.instructor}</span>
                </div>
                <button
                  className="w-full py-3 border-2 text-center font-semibold transition-colors"
                  style={{ borderColor: 'rgb(255, 158, 3)', color: 'rgb(255, 158, 3)' }}
                >
                  Comenzar a aprender
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            className="px-12 py-4 text-white font-semibold transition-colors"
            style={{ backgroundColor: 'rgb(26, 26, 46)' }}
          >
            Comenzar
          </button>
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
