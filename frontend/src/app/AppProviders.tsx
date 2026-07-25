import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Single place to compose app-wide providers (router, and later query
 * client / toast provider / etc. as they're introduced). Keeping this
 * separate from App.tsx means new providers don't clutter the root
 * component.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
