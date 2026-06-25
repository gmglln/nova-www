const IMG = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHJlZCUyMHN3ZWF0ZXIlMjBwb3J0cmFpdCUyMHNtaWxpbmd8ZW58MXx8fHwxNzcyNTA1NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080';

function DecoWaves() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 100 Q 60 60, 100 100" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M 40 120 Q 80 80, 120 120" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M 60 140 Q 100 100, 140 140" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M 20 140 Q 50 110, 80 140" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Testimonial({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-[oklch(0.97_0.001_106.424)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative overflow-hidden">
              <img src={IMG} alt="Kate Neville" className="w-full h-[500px] object-cover" />
            </div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 pointer-events-none">
              <DecoWaves />
            </div>
          </div>

          <div className="bg-white p-12 rounded-[10px] shadow-sm">
            <blockquote className="text-xl lg:text-2xl text-[oklch(0.21_0.034_264.665)] mb-8 leading-relaxed lg:leading-[39px]">
              Pensé que nunca terminaría la prepa. Hoy ya tengo mi certificado gracias a Nova Impulsa. El proceso fue
              rápido, sencillo y con mucho apoyo en todo momento.
            </blockquote>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-[oklch(0.21_0.034_264.665)]">María García</p>
                <p className="text-sm text-[oklch(0.551_0.027_264.364)]">Egresada 2024</p>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-[33554432px] bg-[oklch(0.872_0.01_258.338)]" />
                <div className="w-2 h-2 rounded-[33554432px] bg-[oklch(0.872_0.01_258.338)]" />
                <div className="w-2 h-2 rounded-[33554432px] bg-[oklch(0.546_0.245_262.881)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
