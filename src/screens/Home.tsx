import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { About } from '../components/About';
import { Courses } from '../components/Courses';
import { LectureHall } from '../components/LectureHall';
import { Team } from '../components/Team';
import { Marquee } from '../components/Marquee';
import { Testimonial } from '../components/Testimonial';
import { News } from '../components/News';
import { Newsletter } from '../components/Newsletter';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar is absolute — must share a positioned block with Hero so it overlays it */}
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <Features />
      <About />
      <Courses />
      <LectureHall />
      <Team />
      <Marquee />
      <Testimonial />
      <News />
      <Newsletter />
      <Footer />
    </div>
  );
}
