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
  // Register routes here as each wave lands:
  // if (route.startsWith('/your-slug')) return <YourComponentPage />;
  void route;

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui' }}>
      <h1>rebuild-base scaffold</h1>
      <p>
        Empty template. Start your first wave: capture a component from the
        live target with{' '}
        <code>tools/harness/src/capture-multi-bp.ts</code>, hand-write the
        TSX into <code>src/components/</code>, create an isolation route in{' '}
        <code>src/routes/</code>, register it above, then validate with{' '}
        <code>tools/harness/src/cli.ts validate fixtures/&lt;slug&gt;.json</code>.
      </p>
      <p>See <code>CLAUDE.md</code> for the methodology and recurring patterns.</p>
    </div>
  );
}
