import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Website, Loading } from 'components/layouts';

const baseUrl = process.env.API_ORIGIN;

export default function WebsiteHostnamePage() {
  const { hostname } = useParams();
  const [packages, setPackages] = useState([]);
  const [isReady, setReady] = useState(false);
  const [isError, setError] = useState(false);

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
        setReady(true);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  // if (isFailed) {
  //   return <Error host={isFailed} onRetry={() => setFailed('')} />;
  // }

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (!hostname || isError) {
    return <Navigate replace to='/' />;
  }

  if (isReady) {
    return <Website packages={packages} host={hostname} highlights={[]} />;
  }

  return <Loading />;
}
