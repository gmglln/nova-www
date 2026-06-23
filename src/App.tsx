/**
 * Hash-based routing — zero deps. Lets the harness target a specific
 * component-in-isolation page via /#/<slug>.
 *
 * Routes are wired one at a time as components are captured + validated.
 * Pattern: each captured component gets a `src/routes/<slug>.tsx` and a
 * hash route registered below.
 *
 * Order matters: more-specific routes must be registered before less-
 * specific ones (matching uses `startsWith`). Example:
 *   if (route.startsWith('/post-card-image')) return <PostCardImagePage />;
 *   if (route.startsWith('/post-card')) return <PostCardPage />;
 */
import { useEffect, useState } from 'react';
import { NavbarPage } from './routes/navbar';
import { HeroPage } from './routes/hero';
import { FeaturesPage } from './routes/features';
import { AboutPage } from './routes/about';
import { CoursesPage } from './routes/courses';
import { LectureHallPage } from './routes/lecture-hall';
import { TeamPage } from './routes/team';
import { MarqueePage } from './routes/marquee';
import { TestimonialPage } from './routes/testimonial';
import { NewsPage } from './routes/news';
import { NewsletterPage } from './routes/newsletter';
import { FooterPage } from './routes/footer';

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '#/');
  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash.replace(/^#/, '');
}

export function App() {
  const route = useHashRoute();
  if (route.startsWith('/navbar')) return <NavbarPage />;
  if (route.startsWith('/hero')) return <HeroPage />;
  if (route.startsWith('/features')) return <FeaturesPage />;
  if (route.startsWith('/about')) return <AboutPage />;
  if (route.startsWith('/courses')) return <CoursesPage />;
  if (route.startsWith('/lecture-hall')) return <LectureHallPage />;
  if (route.startsWith('/team')) return <TeamPage />;
  if (route.startsWith('/marquee')) return <MarqueePage />;
  if (route.startsWith('/testimonial')) return <TestimonialPage />;
  if (route.startsWith('/newsletter')) return <NewsletterPage />;
  if (route.startsWith('/news')) return <NewsPage />;
  if (route.startsWith('/footer')) return <FooterPage />;

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui' }}>
      <h1>Nova Impulsa rebuild</h1>
      <ul>
        <li><a href="#/navbar">/navbar</a></li>
        <li><a href="#/hero">/hero</a></li>
        <li><a href="#/features">/features</a></li>
        <li><a href="#/about">/about</a></li>
        <li><a href="#/courses">/courses</a></li>
        <li><a href="#/lecture-hall">/lecture-hall</a></li>
        <li><a href="#/team">/team</a></li>
        <li><a href="#/marquee">/marquee</a></li>
        <li><a href="#/testimonial">/testimonial</a></li>
        <li><a href="#/news">/news</a></li>
        <li><a href="#/newsletter">/newsletter</a></li>
        <li><a href="#/footer">/footer</a></li>
      </ul>
    </div>
  );
}
