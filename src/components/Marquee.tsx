const TEXT = 'CERTIFÍCATE EN 12 SEMANAS • MODALIDAD 100% VIRTUAL • VÁLIDO EN MÉXICO Y EN EL EXTRANJERO • INSCRIPCIÓN GRATIS • ASESORÍA PERSONALIZADA •';

export function Marquee({ id }: { id?: string }) {
  return (
    <section id={id} className="py-20 bg-white overflow-hidden">
      <div className="relative whitespace-nowrap">
        <div className="inline-block animate-ticker">
          <h2 className="inline-block text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 leading-tight lg:leading-[120px] px-8">
            {TEXT}
          </h2>
          <h2 className="inline-block text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 leading-tight lg:leading-[120px] px-8">
            {TEXT}
          </h2>
        </div>
      </div>
      <style>{`
          @keyframes ticker {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-ticker {
            animation: ticker 30s linear infinite;
          }
        `}</style>
    </section>
  );
}
