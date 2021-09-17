import React, { useCallback, useState } from 'react';
import webpackIcon from 'assets/icons/webpack.svg';
import { Home, Loading, Website } from 'components/layouts';

const baseUrl = 'https://staging-gradejs.fpjs.sh';

export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<Parameters<typeof Website>[0] | undefined>(
    undefined
  );

  const handleDetectStart = useCallback((data: { address: string }) => {
    setLoading(true);

    fetch(`${baseUrl}/detect`, {
      method: 'POST',
      body: JSON.stringify({ url: data.address }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((response) => {
        const newData = {
          host: new URL(data.address).hostname,
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
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (websiteData) {
    return <Website {...websiteData} />;
  }

  return <Home onSubmit={handleDetectStart} />;
}
