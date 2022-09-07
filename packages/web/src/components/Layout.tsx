import * as React from 'react';
import { HelmetData } from 'react-helmet';

const escapedCharacterRegexp = /[<>\/\u2028\u2029]/g;
const escapedCharacterMap = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

export default function sanitizeJSON(value: any) {
  return JSON.stringify(value).replace(
    escapedCharacterRegexp,
    (character) => escapedCharacterMap[character as keyof typeof escapedCharacterMap]
  );
}

export function Layout({
  js,
  css,
  head,
  env,
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  initialState,
  html,
}: {
  js: string[];
  css: string[];
  head: HelmetData;
  env: Record<string, string>;
  initialState: any;
  html: string; // pre-rendered components
}) {
  return (
    <html lang='en'>
      <head>
        {head.title.toComponent()}
        {head.meta.toComponent()}
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='mobile-web-app-capable' content='yes' />
        {/* TODO: preload all fonts after redesign
          <link rel="preload" href={} as="font" type="font/woff2"/>
        */}
        <link rel='icon' type='image/svg+xml' href={'TODO'} />
        <link rel='icon' type='image/png' href={'TODO'} />
        {css.map((cssFile) => (
          <link key={cssFile} rel='stylesheet' href={cssFile} />
        ))}
      </head>

      <body {...head.bodyAttributes.toComponent()}>
        <div
          id='app'
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />

        <script
          type='text/javascript'
          dangerouslySetInnerHTML={{ __html: `window.process = ${sanitizeJSON({ env })}` }}
        />
        {/* TODO: pass minimal initial state here
          <script
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `window.__initialState__ = ${sanitizeJSON(initialState)}`,
          }}
        />
          */}
        {js.map((jsFile) => (
          <script key={jsFile} src={jsFile} />
        ))}
      </body>
    </html>
  );
}
