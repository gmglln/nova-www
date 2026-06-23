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

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui' }}>
      <h1>Nova Impulsa rebuild</h1>
      <ul>
        <li><a href="#/navbar">/navbar</a></li>
      </ul>
    </div>
  );
}
