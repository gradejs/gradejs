import { NotFoundError } from '../middleware/response';
import {
  getPackagesByHostname,
  getWebPagesByHostname,
  requestWebPageParse,
  syncWebPage,
} from './service';
import { getAffectingVulnerabilities } from '../vulnerabilities/vulnerabilities';
import { TypedRouter } from '../typed_router';

const router = new TypedRouter();

router.get('/website/:hostname', async (req) => {
  const { hostname } = req.params;
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

router.post('/webpage', async (req) => {
  const { url } = req.body;

  const webpage = await requestWebPageParse(url);

  return webpage;
});

export default router.expressRouter;
