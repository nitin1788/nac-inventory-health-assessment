import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Central scroll behavior for the SPA. React Router doesn't reset scroll
 * position on navigation, so without this, links to a new page (e.g. a
 * footer "Company" link clicked from the bottom of a long page) land
 * wherever the previous page happened to be scrolled to, and hash links
 * to landing-page sections (e.g. "/#services") do nothing when clicked
 * from a different route.
 */
export function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [location.pathname, location.hash]);

  return null;
}
