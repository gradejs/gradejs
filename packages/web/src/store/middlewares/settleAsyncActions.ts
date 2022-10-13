import { Middleware } from '@reduxjs/toolkit';

export function createSettleAsyncActionsMiddleware() {
  let trackedPromises: Array<Promise<any>> | null = null;

  async function settleAsyncActions<T>(cb: () => Promise<T>) {
    if (trackedPromises !== null) {
      throw new Error('Cannot be ran concurrently');
    }

    trackedPromises = [];

    const result = await cb();

    // TODO: Filter out promises which resolve on next tick
    await Promise.allSettled(trackedPromises);

    const resolvedActionCount = trackedPromises.length;
    trackedPromises = null;

    return { result, resolvedActionCount };
  }

  const trackAsyncActionsMiddleware: Middleware = (_store) => (next) => (action) => {
    const actionResult = next(action);

    if (trackedPromises && actionResult instanceof Promise) {
      trackedPromises.push(actionResult);
    }

    return actionResult;
  };

  return { trackAsyncActionsMiddleware, settleAsyncActions };
}
