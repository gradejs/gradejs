import { Router } from 'express';
import j from 'joi';
import { wrapTryCatch } from '../middleware/common';
import { NotFoundError, respond } from '../middleware/response';
import { parseBody, parseSlug } from '../middleware/validation';
import {
  getPackagesByHostname,
  getWebPagesByHostname,
  requestWebPageParse,
  syncWebPage,
} from './service';

const router = Router();

router.get(
  '/website/:hostname',
  wrapTryCatch(async (req, res) => {
    const hostname = parseSlug(req, 'hostname', j.string().required().hostname());
    const webpages = await getWebPagesByHostname(hostname);

    if (webpages.length === 0) {
      throw new NotFoundError();
    }

    // Sync webpages if status is not processed
    await Promise.all(webpages.map((webpage) => syncWebPage(webpage)));

    const packages = await getPackagesByHostname(hostname);

    respond(res, { webpages, packages });
  })
);

router.post(
  '/webpage',
  wrapTryCatch(async (req, res) => {
    const urlOptions = { scheme: ['http', 'https'] };
    const url = parseBody(req, 'url', j.string().required().uri(urlOptions));

    const webpage = await requestWebPageParse(url);

    respond(res, webpage);
  })
);

export default router;
