import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Error as ErrorLayout, Website } from 'components/layouts';

const baseUrl = process.env.API_ORIGIN;

export default function WebsiteHostnamePage() {
  const { hostname } = useParams();
  const [packages, setPackages] = useState([]);
  const [webpages, setWebpages] = useState<{ status: string }[]>([]);
  const [isError, setError] = useState(false);

  const isInvalidResult =
    packages.length === 0 &&
    webpages.length > 0 &&
    !webpages.find((item) => item.status === 'pending');

  useEffect(() => {
    fetch(`${baseUrl}/website/${hostname}`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error();
        } else {
          return response.json();
        }
      })
      .then((response) => {
        setPackages(response.data.packages);
        setWebpages(response.data.webpages);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (!hostname || isError) {
    return <Navigate replace to='/' />;
  }

  if (isInvalidResult) {
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
