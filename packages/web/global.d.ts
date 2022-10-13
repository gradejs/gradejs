declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import { SVGAttributes } from 'react';
  const path: SVGAttributes<SVGElement>;
  export default path;
}

declare const __IS_SERVER__: boolean; // Replaced with DefinePlugin during build

interface Window {
  __INITIAL_STATE__?: object;
}
