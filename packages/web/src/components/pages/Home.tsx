import React from 'react';
import { Home } from 'components/layouts';

const suggestions = ['twitch.tv', 'reddit.com', 'trello.com', 'npmjs.com', 'starbucks.com'];

export function HomePage() {
  return <Home suggestions={suggestions} />;
}
