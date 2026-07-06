export function Navbar({ id }: { id?: string }) {
  return (
    <header id={id} className="bg-transparent absolute top-4 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex justify-between items-center h-20">
          <a className="flex items-center gap-3 -ml-4" href="/">
            <img
              src="https://ranch-trade-51285426.figma.site/_assets/v11/6201b2698ea74d003d56e3eae6fb1a00124fa9ea.png"
              alt="Nova Impulsa Logo"
              className="h-16 w-auto"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/80">Centro Educativo</span>
              <span className="text-2xl font-bold text-white">Nova Impulsa</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 ml-auto mr-16">
            <a className="transition-colors font-semibold" style={{ color: 'rgb(255, 219, 33)' }} href="/">Inicio</a>
            <a className="transition-colors text-[oklab(0.999994_0.0000455678_0.0000200868_/_0.9)] hover:text-white" href="#servicios">Servicios</a>
            <a className="transition-colors text-[oklab(0.999994_0.0000455678_0.0000200868_/_0.9)] hover:text-white" href="#sedes">Sedes</a>
            <a className="transition-colors text-[oklab(0.999994_0.0000455678_0.0000200868_/_0.9)] hover:text-white" href="#beneficios">Beneficios</a>
            <a className="transition-colors text-[oklab(0.999994_0.0000455678_0.0000200868_/_0.9)] hover:text-white" href="#contacto">Contacto</a>
          </nav>
          <a
            className="hidden md:block text-white px-[30px] py-[15px] transition-colors font-medium -mr-14 bg-primary"
            href="https://wa.me/525669363221"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inscríbete ahora
          </a>
          <button className="md:hidden p-2 text-white">
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
              className="w-6 h-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
