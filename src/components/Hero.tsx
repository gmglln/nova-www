const HERO_BG = 'https://images.unsplash.com/photo-1589696709085-58e1b5e18338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwdW5pdmVyc2l0eSUyMHN0dWRlbnQlMjB3b21hbnxlbnwxfHx8fDE3NzE5MDA0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080';

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODU5NjUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1615712278090-a935af124081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcHJvZmVzc29yJTIwZ2xhc3NlcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTg0MDg5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1674928286503-facfe61eb634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjB0ZWFjaGVyJTIwcG9ydHJhaXQlMjBzbWlsZXxlbnwxfHx8fDE3NzE5MDA0OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
];

// TODO: reemplazar con la foto real de Elvis (mascota del centro) cuando el cliente la envíe
const CARD_IMG = 'https://placehold.co/400x300?text=Elvis';

export function Hero({ id }: { id?: string }) {
  return (
    <section id={id} className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="Estudiante" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute -left-4 sm:-left-2 lg:-left-4 top-1/2 -translate-y-[78%] max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 lg:mb-8 leading-tight [letter-spacing:-0.02em]">
            Formamos mentes,<br />
            construimos futuros
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-lg leading-relaxed lg:hidden">
            Termina tu preparatoria en 12 semanas, 100% virtual, con acompañamiento personalizado.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              className="text-white px-8 py-4 font-semibold transition-colors inline-flex items-center justify-center gap-2 rounded-sm"
              style={{ backgroundColor: '#25D366' }}
              href="https://wa.me/525669363221"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Habla por WhatsApp
            </a>
            <a
              className="text-white px-8 py-4 font-semibold transition-colors inline-flex items-center justify-center gap-2 bg-primary rounded-sm"
              href="#servicios"
            >
              Inscríbete ahora
            </a>
          </div>
        </div>

        <div className="hidden lg:block absolute top-60 -right-6 max-w-sm">
          <p className="text-base text-[oklab(0.999994_0.0000455678_0.0000200868_/_0.9)] leading-relaxed text-right">
            Ayudamos a jóvenes mayores de 17 años<br />
            y adultos a terminar su preparatoria<br />
            en modalidad virtual, rápida y accesible.
          </p>
        </div>

        <div className="absolute bottom-8 -left-8 sm:-left-6 lg:-left-8 right-4 sm:right-6 lg:right-8 flex items-end justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {AVATAR_URLS.map((url, i) => (
                <div key={i} className="w-12 h-12 rounded-[33554432px] border-2 border-white overflow-hidden">
                  <img src={url} alt="Asesor" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-white">
              <div className="text-xl lg:text-2xl font-bold">8 Sedes</div>
              <div className="text-xs lg:text-sm text-[oklab(0.999994_0.0000455677_0.0000200868_/_0.8)]">República Mexicana</div>
            </div>
          </div>

          <div className="hidden lg:block -mr-14">
            <div className="bg-white rounded-[10px] shadow-2xl p-5 w-80">
              <div className="mb-4 rounded-[10px] overflow-hidden">
                <img src={CARD_IMG} alt="Elvis — mascota del centro" className="w-full h-40 object-cover" />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#25D366' }} />
                <span className="text-xs font-semibold text-[oklch(0.551_0.027_264.364)] uppercase tracking-wide">100% virtual</span>
              </div>
              <h3 className="text-lg font-bold text-[oklch(0.21_0.034_264.665)] leading-tight">
                Certifícate en 12 semanas · Sin horarios fijos
              </h3>
              <p className="mt-2 text-xs text-[oklch(0.551_0.027_264.364)]">
                Con Elvis, la mascota del centro 🐾
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
