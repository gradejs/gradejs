import React, { useCallback, useState } from 'react';
import webpackIcon from 'assets/icons/webpack.svg';
import { Error, Home, Loading, Website } from 'components/layouts';

const baseUrl = process.env.API_ORIGIN;

type DetectionResponse = {
  bundle: {
    stats: {
      bytes: number;
      symbols: number;
    };
  };
  packages: Array<{ name: string; versionRange: string; approxSymbolsSize: number; }>
};

const toFixedDigits = (value: number, digits: number) => parseFloat(value.toFixed(digits));

export default function App() {
  const [isFailed, setFailed] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<Parameters<typeof Website>[0] | undefined>(
    undefined
  );

  const handleDetectStart = useCallback((data: { address: string }) => {
    setLoading(true);

    const host = new URL(data.address).hostname;

    fetch(`${baseUrl}/detect`, {
      method: 'POST',
      body: JSON.stringify({ url: data.address }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((response: DetectionResponse) => {
        const absoluteKByteSizeMultiplier = (response.bundle.stats.bytes / response.bundle.stats.symbols) / 1024;

        const newData = {
          host,
          highlights: [
            {
              description: 'Source build system',
              title: 'Webpack',
              icon: webpackIcon,
            },
          ],
          packages: response.packages.map((pkg) => {
            return {
              name: pkg.name,
              version: pkg.versionRange,
              relativeSize: toFixedDigits((pkg.approxSymbolsSize / response.bundle.stats.symbols) * 100, 2),
              absoluteSize: toFixedDigits(pkg.approxSymbolsSize * absoluteKByteSizeMultiplier, 2),
            };
          }),
        };

        // console.log(newData);
        setLoading(false);
        setWebsiteData(newData);
      })
      .catch((e) => {
        console.error(e);
        setFailed(host);
        setLoading(false);
      });
  }, []);

  if (isFailed) {
    return <Error host={isFailed} onRetry={() => setFailed('')} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (websiteData) {
    return <Website {...websiteData} />;
  }

  return <Home onSubmit={handleDetectStart} />;
}
