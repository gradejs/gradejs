import Plausible from 'plausible-tracker';
import ReactGA from 'react-ga';

export type CustomEventProperties = {
  label?: string;
  value?: number;
};

let plausible: ReturnType<typeof Plausible>;

function trackHistory() {
  const trackPageView = (url?: string | URL | null) =>
    pageView(
      url ? (typeof url === 'string' ? url : url.pathname) : window.location.pathname,
      window.location.pathname
    );
  const popstateListener = () => trackPageView();
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;
  if (originalPushState) {
    window.history.pushState = function (data, title, url) {
      originalPushState.apply(this, [data, title, url]);
      trackPageView(url);
    };
    window.history.replaceState = function (data, title, url) {
      originalReplaceState.apply(this, [data, title, url]);
      trackPageView(url);
    };
    window.addEventListener('popstate', popstateListener);
  }
  trackPageView();
  return function cleanup() {
    if (originalPushState) {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', popstateListener);
    }
  };
}

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

  return trackHistory();
}

export function pageView(url: string = window.location.pathname, referrer?: string) {
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
