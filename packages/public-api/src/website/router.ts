import { z } from 'zod';
import { NotFoundError } from '../middleware/response';
import { StrictRouter } from '../middleware/strictRouter';
import { getRequestBody, getRequestParams } from '../middleware/validation';
import { getAffectingVulnerabilities } from '../vulnerabilities/vulnerabilities';
import {
  getPackagesByHostname,
  getWebPagesByHostname,
  requestWebPageParse,
  syncWebPage,
} from './service';

const hostnameRe =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;

const strictRouter = new StrictRouter();

strictRouter.get('/website/:hostname', async (req) => {
  const { hostname } = getRequestParams(req, { hostname: z.string().regex(hostnameRe) });

  const webpages = await getWebPagesByHostname(hostname);

  if (webpages.length === 0) {
    throw new NotFoundError();
  }

  // Sync webpages if status is not processed
  await Promise.all(webpages.map((webpage) => syncWebPage(webpage)));

  const packages = await getPackagesByHostname(hostname);
  const vulnerabilities = await getAffectingVulnerabilities(packages);

  return { webpages, packages, vulnerabilities };
});

strictRouter.post('/webpage', async (req) => {
  const { url } = getRequestBody(req, { url: z.string().url() });

  const webpage = await requestWebPageParse(url);

  return webpage;
});

export default strictRouter.router;
