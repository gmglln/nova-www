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

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${GRAY}`}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
  { icon: <FacebookIcon />, label: 'Facebook', href: 'https://www.facebook.com/share/1Ji19w9Lt4/' },
  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://www.instagram.com/novaimpulsa' },
  { icon: <WhatsAppIcon />, label: 'WhatsApp', href: 'https://wa.me/525669363221' },
];

const enlaces = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Sedes', href: '#sedes' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Contacto', href: '#contacto' },
];

const programa = [
  { label: 'Certificación en Bachillerato', href: '#servicios' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Egresados', href: '#egresados' },
  { label: 'Modalidad 100% virtual', href: '#beneficios' },
  { label: 'Inscribirse ahora', href: 'https://wa.me/525669363221' },
];

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
              Centro Educativo Nova Impulsa — Certificación en bachillerato 100% virtual. Formamos mentes,
              construimos futuros en toda la República Mexicana.
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-[33554432px] ${SOCIAL_BG} flex items-center justify-center transition-colors hover:bg-gray-700`}
                  aria-label={label}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Navegación</h3>
            <ul className="text-sm">
              {enlaces.map(({ label, href }) => (
                <li key={label} className="mb-3 last:mb-0">
                  <a className={`${GRAY} hover:text-white transition-colors`} href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Programa</h3>
            <ul className="text-sm">
              {programa.map(({ label, href }) => (
                <li key={label} className="mb-3 last:mb-0">
                  <a className={`${GRAY} hover:text-white transition-colors`} href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Contacto</h3>
            <ul className={`text-sm ${GRAY} space-y-3`}>
              <li>
                <a href="https://wa.me/525669363221" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2">
                  <span>WhatsApp: 5669 363 221</span>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/1Ji19w9Lt4/" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors">
                  Facebook: Nova Impulsa
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/novaimpulsa" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition-colors">
                  Instagram: @novaimpulsa
                </a>
              </li>
              <li className="leading-relaxed">
                Atención virtual vía Zoom y WhatsApp
              </li>
              <li>Modalidad 100% virtual</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className={`${GRAY} text-sm`}>
            © 2025 Centro Educativo Nova Impulsa · Todos los derechos reservados
          </p>
        </div>
      </div>

      <button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-[33554432px] bg-white text-[oklch(0.21_0.034_264.665)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpIcon />
      </button>
    </footer>
  );
}
