declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import { SVGAttributes } from 'react';
  const path: SVGAttributes<SVGElement>;
  export default path;
}

declare const __isServer__: boolean; // Replaced with DefinePlugin during build
