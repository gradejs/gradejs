import Plausible from 'plausible-tracker';
import ReactGA from 'react-ga';

export type CustomEventProperties = {
  label?: string;
  value?: number;
};

let plausible: ReturnType<typeof Plausible>;

export function initAnalytics() {
  if (process.env.PLAUSIBLE_DOMAIN) {
    plausible = Plausible({
      apiHost: window.location.origin,
      domain: process.env.PLAUSIBLE_DOMAIN,
      trackLocalhost: true,
    });
  }

  if (process.env.GA_ID) {
    ReactGA.initialize(process.env.GA_ID);
  }

  return (url?: string | URL | null) =>
    pageView(url ? (typeof url === 'string' ? url : url.pathname) : window.location.pathname);
}

export function pageView(url?: string, referrer?: string) {
  if (!plausible) {
    return;
  }

  if (!url) {
    url = window.location.pathname;
  }

  if (process.env.PLAUSIBLE_DOMAIN) {
    plausible.trackPageview({
      url: window.location.origin + url,
      referrer: referrer ?? document.referrer,
      deviceWidth: window.innerWidth,
    });
  }

  if (process.env.GA_ID) {
    ReactGA.pageview(url);
  }

  if (process.env.DUMP_ANALYTICS) {
    console.log('[analytics] PageView', url, referrer);
  }
}

export function trackCustomEvent(category: string, action: string, props?: CustomEventProperties) {
  if (!plausible) {
    return;
  }

  if (process.env.PLAUSIBLE_DOMAIN) {
    plausible.trackEvent(`${category}_${action}`, { props });
  }

  if (process.env.GA_ID) {
    ReactGA.event({ category, action, ...props });
  }

  if (process.env.DUMP_ANALYTICS) {
    console.log('[analytics] CustomEvent', category, action, props);
  }
}
