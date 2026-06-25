const HERO_BG = 'https://images.unsplash.com/photo-1589696709085-58e1b5e18338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjB3b21hbnxlbnwxfHx8fDE3NzE5MDA0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080';

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODU5NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1615712278090-a935af124081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZmVzc29yJTIwZ2xhc3NlcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTg0MDg5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1674928286503-facfe61eb634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0ZWFjaGVyJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NzE5MDA0OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
];

const CARD_IMG = 'https://images.unsplash.com/photo-1728023881214-1d71a7a30a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNvbGxhYm9yYXRpdmUlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzcxOTAwNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080';

export function Hero({ id }: { id?: string }) {
  return (
    <section id={id} className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="Student" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute -left-4 sm:-left-2 lg:-left-4 top-1/2 -translate-y-[78%] max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 lg:mb-8 leading-tight whitespace-nowrap [letter-spacing:-0.02em]">
            Aprende en<br />
            cualquier momento<br />
            en cualquier lugar
          </h1>
          <a
            className="text-white px-8 py-4 font-semibold transition-colors inline-flex items-center justify-center gap-2 bg-primary"
            href="/programs"
          >
            Comenzar
          </a>
        </div>

        <div className="hidden lg:block absolute top-60 -right-6 max-w-sm">
          <p className="text-base text-[oklab(0.999994_0.0000455678_0.0000200868_/_0.9)] leading-relaxed text-right">
            Obtén habilidades del mundo real<br />
            con cursos mejor calificados.<br />
            Aprende en línea y toma control de tu futuro
          </p>
        </div>

        <div className="absolute bottom-8 -left-8 sm:-left-6 lg:-left-8 right-4 sm:right-6 lg:right-8 flex items-end justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATAR_URLS.map((url, i) => (
                <div key={i} className="w-12 h-12 rounded-[33554432px] border-2 border-white overflow-hidden">
                  <img src={url} alt="Customer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-white">
              <div className="text-xl lg:text-2xl font-bold">23M+</div>
              <div className="text-xs lg:text-sm text-[oklab(0.999994_0.0000455677_0.0000200868_/_0.8)]">Nuestros clientes</div>
            </div>
          </div>

          <div className="hidden lg:block -mr-14">
            <div className="bg-white rounded-[10px] shadow-2xl p-5 w-80">
              <div className="mb-4 rounded-[10px] overflow-hidden">
                <img src={CARD_IMG} alt="Learning" className="w-full h-40 object-cover" />
              </div>
              <button className="mb-3 p-2.5 bg-[oklch(0.967_0.003_264.542)] hover:bg-gray-200 transition-colors rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <h3 className="text-lg font-bold text-[oklch(0.21_0.034_264.665)] leading-tight">
                Aprende en línea y crece en cualquier momento
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
