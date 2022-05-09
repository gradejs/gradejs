import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Error as ErrorLayout, Website } from 'components/layouts';

const baseUrl = process.env.API_ORIGIN;

async function fetchApi(hostname: string) {
  return fetch(`${baseUrl}/website/${hostname}`).then((response) => {
    if (response.status !== 200) {
      throw new Error();
    } else {
      return response.json();
    }
  });
}

export default function WebsiteHostnamePage() {
  const { hostname } = useParams();
  const [packages, setPackages] = useState([]);
  const [webpages, setWebpages] = useState<{ status: string }[]>([]);
  const [isError, setError] = useState(false);
  const [isProtected, setProtected] = useState(false);

  const isInvalidResult =
    packages.length === 0 &&
    webpages.length > 0 &&
    !webpages.find((item) => item.status === 'pending');

  useEffect(() => {
    if (hostname) {
      fetchApi(hostname)
        .then((response) => {
          setPackages(response.data.packages);
          setWebpages(response.data.webpages);
          if (response.data.status === 'protected') { // TODO: move website statuses to shared?
            setProtected(true);
          }
        })
        .catch(() => {
          setError(true);
        });
    }
  }, []);

  useEffect(() => {
    const hasPendingPages = !!webpages.find((item) => item.status === 'pending');

    if (hasPendingPages && hostname) {
      const timeoutId = setTimeout(() => {
        fetchApi(hostname)
          .then((response) => {
            setPackages(response.data.packages);
            setWebpages(response.data.webpages);
          })
          .catch(() => {
            setError(true);
          });
      }, 5000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [webpages]);

  if (!hostname || isError) {
    return <Navigate replace to='/' />;
  }

  if (isProtected) {
    return (
        <ErrorLayout
            message="It looks like the entered website is protected with anti-fraud, so we couldn't get script content."
            action='Would you like to try another URL or report an issue?'
            actionTitle='Try another URL'
            host={hostname}
            onRetry={() => {
              document.location = '/';
            }}
        />
    );
  } else if (isInvalidResult) {
    return (
      <ErrorLayout
        message='It looks like the entered website is not built with Webpack.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={hostname}
        onRetry={() => {
          document.location = '/';
        }}
      />
    );
  }

  return <Website webpages={webpages} packages={packages} host={hostname} />;
}
