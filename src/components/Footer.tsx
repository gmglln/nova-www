const GRAY = 'text-[oklch(0.707_0.022_261.325)]';
const SOCIAL_BG = 'bg-[oklch(0.278_0.033_256.848)]';

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`lucide lucide-facebook w-5 h-5 ${GRAY}`}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${GRAY}`}>
      <path d="M22 7.5C22 8.88071 20.8807 10 19.5 10C18.1193 10 17 8.88071 17 7.5C17 6.11929 18.1193 5 19.5 5C20.8807 5 22 6.11929 22 7.5Z" fill="currentColor" />
      <path d="M19.5 11C17.567 11 16 12.567 16 14.5V21H23V14.5C23 12.567 21.433 11 19.5 11Z" fill="currentColor" />
      <circle cx="7" cy="7" r="4" fill="currentColor" />
      <path d="M3 14C3 12.3431 4.34315 11 6 11H8C9.65685 11 11 12.3431 11 14V21H3V14Z" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={`lucide lucide-instagram w-5 h-5 ${GRAY}`}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${GRAY}`}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}


function ArrowUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="lucide lucide-arrow-up w-5 h-5">
      <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
    </svg>
  );
}

const socialIcons = [
  { icon: <FacebookIcon />, label: 'Facebook' },
  { icon: <UsersIcon />, label: 'Users' },
  { icon: <InstagramIcon />, label: 'Instagram' },
  { icon: <GlobeIcon />, label: 'Globe' },
];

const enlaces = ['Inicio', 'Servicios', 'Nosotros', 'Características', 'Contáctanos'];
const producto = ['Resumen', 'Características', 'Tutoriales', 'Soluciones', 'Precios'];

export function Footer({ id }: { id?: string }) {
  return (
    <footer id={id} className="relative" style={{ backgroundColor: 'rgb(10, 10, 26)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://ranch-trade-51285426.figma.site/_assets/v11/6201b2698ea74d003d56e3eae6fb1a00124fa9ea.png"
                alt="Nova Impulsa Logo"
                className="h-12 w-auto"
              />
              <h3 className="text-white text-2xl font-bold">Nova Impulsa</h3>
            </div>
            <p className={`${GRAY} text-sm leading-relaxed mb-6`}>
              Empoderando a estudiantes en todo el mundo a través de educación en línea accesible y de alta calidad,
              diseñada para inspirar crecimiento, curiosidad y éxito continuo en todos los campos de estudio.
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ icon, label }) => (
                <a key={label} href="#" className={`w-10 h-10 rounded-[33554432px] ${SOCIAL_BG} flex items-center justify-center transition-colors hover:bg-gray-700`}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Enlaces</h3>
            <ul className="text-sm">
              {enlaces.map((item) => (
                <li key={item} className="mb-3 last:mb-0">
                  <a className={`${GRAY} hover:text-white transition-colors`} href="/">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Producto</h3>
            <ul className="text-sm">
              {producto.map((item) => (
                <li key={item} className="mb-3 last:mb-0">
                  <a className={`${GRAY} hover:text-white transition-colors`} href="/">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contacto</h3>
            <ul className={`text-sm ${GRAY}`}>
              <li className="mb-3 last:mb-0">
                <a href="mailto:info@email.com" className="hover:text-white transition-colors">info@email.com</a>
              </li>
              <li className="mb-3 leading-relaxed">
                Alemania —<br />
                785 15th Street, Oficina 47<br />
                Berlín, De 81566
              </li>
            </ul>
          </div>
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-[33554432px] bg-white text-[oklch(0.21_0.034_264.665)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon />
      </button>
    </footer>
  );
}
