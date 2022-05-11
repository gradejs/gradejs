import { getRepository } from 'typeorm';
import { WebPage, WebPagePackage, internalApi, Internal } from '@gradejs-public/shared';

export async function requestWebPageParse(url: string) {
  const [cached, internal] = await Promise.all([
    getRepository(WebPage).findOne({ url }),
    internalApi.initiateUrlProcessing(url),
    // Clear cached results
    getRepository(WebPagePackage).delete({ hostname: getHostnameFromUrl(url) }),
  ]);

  // Insert or update database entry
  return getRepository(WebPage).save({
    url: internal.url,
    hostname: getHostnameFromUrl(internal.url),
    status: mapInternalWebsiteStatus(internal.status),
    ...(cached ? { id: cached.id } : {}),
  });
}

export async function syncWebPage(webpage: WebPage) {
  // Skip sync for processed items
  if (webpage.status !== WebPage.Status.Pending) {
    return;
  }

  const internal = await internalApi.fetchUrlPackages(webpage.url);
  const nextStatus = mapInternalWebsiteStatus(internal.status);

  // Save updated status if changed
  if (webpage.status !== nextStatus) {
    webpage.status = nextStatus;
    await webpage.save();
  }

  // Save packages if ready
  if (webpage.status === WebPage.Status.Processed && internal.packages.length > 0) {
    await getRepository(WebPagePackage).upsert(
      internal.packages.map((pkg) => ({
        latestUrl: internal.url,
        hostname: getHostnameFromUrl(internal.url),
        package: pkg,
      })),
      ['hostname', 'package']
    );
  }
}

export function getWebPagesByHostname(hostname: string) {
  return getRepository(WebPage).find({ hostname });
}

export function getPackagesByHostname(hostname: string) {
  return getRepository(WebPagePackage).find({ hostname });
}

function mapInternalWebsiteStatus(status: Internal.WebsiteStatus) {
  switch (status) {
    case Internal.WebsiteStatus.Invalid:
      return WebPage.Status.Unsupported;
    case Internal.WebsiteStatus.InProgress:
      return WebPage.Status.Pending;
    default:
      return WebPage.Status.Processed;
  }
}

function getHostnameFromUrl(url: string) {
  return new URL(url).hostname;
}
