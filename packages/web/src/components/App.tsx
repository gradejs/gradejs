import React, { useCallback, useState } from 'react';
import webpackIcon from 'assets/icons/webpack.svg';
import { Error, Home, Loading, Website } from 'components/layouts';

const baseUrl = process.env.API_ORIGIN;

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
      .then((response) => {
        const newData = {
          host,
          highlights: [
            {
              description: 'Source build system',
              title: 'Webpack',
              icon: webpackIcon,
            },
          ],
          packages: response.detected.map((item: string) => {
            const parts = item.split('@');
            const version = parts.pop();

            return { name: parts.join('@'), version };
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
