const IMG1 = 'https://images.unsplash.com/photo-1670852714979-f73d21652a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBob2xkaW5nJTIwdGFibGV0JTIwZHJhd2luZyUyMGNvbG9yc3xlbnwxfHx8fDE3NzE5MDI2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080';
const IMG2 = 'https://images.unsplash.com/photo-1765648684593-e3de4074ef1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JraW5nJTIwbGFwdG9wJTIwY29mZmVlJTIwZGVza3xlbnwxfHx8fDE3NzE5MDI2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080';

export function About({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="h-80 overflow-hidden">
            <img src={IMG1} alt="Estudiante con tablet" className="w-full h-full object-cover" />
          </div>
          <div className="h-80 overflow-hidden">
            <img src={IMG2} alt="Asesor trabajando" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-4">
              NUESTRA HISTORIA
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold text-[oklch(0.21_0.034_264.665)] leading-tight lg:leading-[75px]">
              Sobre nosotros
            </h2>
          </div>
          <div>
            <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed">
              Centro Educativo Nova Impulsa nació de la necesidad real que viven miles de jóvenes y adultos en
              México: la dificultad de terminar su preparatoria por falta de tiempo, recursos o flexibilidad. Somos
              un centro de enlace y capacitación especializado en la certificación de bachillerato en modalidad
              100% en línea.
            </p>
          </div>
          <div>
            <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed">
              Con presencia en 8 sedes a lo largo de la República Mexicana, acompañamos a cada alumno de inicio
              a fin con asesoría personalizada, horarios flexibles y un proceso confiable y accesible. Nuestro
              compromiso es que nadie se quede sin su certificado por falta de oportunidades.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-[10px]" style={{ backgroundColor: 'rgb(241, 238, 227)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-3">
              MISIÓN
            </p>
            <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed">
              Facilitar el acceso a la educación media superior a jóvenes y adultos en todo México, brindando
              un proceso de certificación rápido, confiable y con acompañamiento personalizado, sin importar
              sus circunstancias de vida.
            </p>
          </div>
          <div className="p-8 rounded-[10px]" style={{ backgroundColor: 'rgb(241, 238, 227)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.551_0.027_264.364)] mb-3">
              VISIÓN
            </p>
            <p className="text-base text-[oklch(0.446_0.03_256.802)] leading-relaxed">
              Ser el centro educativo de enlace más reconocido de México por transformar vidas a través de la
              educación virtual, expandiendo nuestra red de sedes y consolidándonos como referente de calidad,
              confianza y resultados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
