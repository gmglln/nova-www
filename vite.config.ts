import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite scaffold for the rebuild — provisional. Stack choice still owned by
// the team architecture group; this is here so the fidelity-harness can run
// against real TSX components instead of static HTML duplicates.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
