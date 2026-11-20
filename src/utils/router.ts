export type ActivePage = 'home' | 'work' | 'services' | 'about' | 'contact' | 'admin';

export const PAGE_PATHS: Record<ActivePage, string> = {
  home: '/',
  work: '/work',
  services: '/services',
  about: '/about',
  contact: '/contact',
  admin: '/admin',
};

export interface RouteState {
  page: ActivePage;
  serviceParam?: string;
}

export function parseRouteFromLocation(): RouteState {
  const pathname = window.location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service') || undefined;

  const resolveToken = (token: string): ActivePage | null => {
    switch (token) {
      case '':
      case '/':
      case 'home':
      case 'top':
        return 'home';
      case '/work':
      case 'work':
      case '/projects':
      case 'projects':
        return 'work';
      case '/services':
      case 'services':
        return 'services';
      case '/about':
      case '/about-us':
      case 'about':
      case 'about-us':
        return 'about';
      case '/contact':
      case '/contact-us':
      case 'contact':
      case 'contact-us':
        return 'contact';
      case '/admin':
      case 'admin':
        return 'admin';
      default:
        return null;
    }
  };

  const fromPath = resolveToken(pathname);
  if (fromPath && fromPath !== 'home') {
    return { page: fromPath, serviceParam };
  }

  if (hash) {
    const fromHash = resolveToken(hash);
    if (fromHash) {
      return { page: fromHash, serviceParam };
    }
  }

  return { page: fromPath ?? 'home', serviceParam };
}

export function buildRouteUrl(page: ActivePage, options?: { service?: string }): string {
  const basePath = PAGE_PATHS[page];
  if (page === 'contact' && options?.service) {
    const query = new URLSearchParams({ service: options.service }).toString();
    return `${basePath}?${query}`;
  }
  return basePath;
}

export function pushRoute(page: ActivePage, options?: { service?: string }) {
  const nextUrl = buildRouteUrl(page, options);
  const currentUrl = `${window.location.pathname}${window.location.search}`;
  if (currentUrl !== nextUrl) {
    window.history.pushState({ page, service: options?.service }, '', nextUrl);
  }
}
