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
  initialState,
  html,
}: {
  js: string[];
  css: string[];
  head: HelmetData;
  env: Record<string, string>;
  initialState: object;
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
        <link rel='icon' type='image/x-icon' href='/static/favicon.ico' />
        {/* TODO: preload all fonts and add icons after redesign
          <link rel="preload" href={} as="font" type="font/woff2"/>
          <link rel='icon' type='image/svg+xml' href={'TODO'} />
          <link rel='icon' type='image/png' href={'TODO'} />
        */}
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
        <script
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__ = ${sanitizeJSON(initialState)}`,
          }}
        />
        {js.map((jsFile) => (
          <script key={jsFile} src={jsFile} />
        ))}
      </body>
    </html>
  );
}
