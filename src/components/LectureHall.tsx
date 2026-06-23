const IMG = 'https://images.unsplash.com/photo-1758413350815-7b06dbbfb9a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGVjdHVyZSUyMGhhbGwlMjBtb2Rlcm58ZW58MXx8fHwxNzcxODgwOTg5fDA&ixlib=rb-4.1.0&q=80&w=1080';

export function LectureHall({ id }: { id?: string }) {
  return (
    <section id={id} className="relative h-96 overflow-hidden">
      <img src={IMG} alt="Lecture hall" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />
    </section>
  );
}
