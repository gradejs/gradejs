import { addDecorator } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
import { createApplicationStore } from '../src/store';
import '../src/styles/global.scss';

const store = createApplicationStore();

// Some elements, like <Link> may not work without a router context
addDecorator((story) => <MemoryRouter>{story()}</MemoryRouter>);
addDecorator((story) => <Provider store={store}>{story()}</Provider>);

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
