export type SearchSuggestion = {
  type: string;
  title: string;
  subtitle: string;
  vulnerable?: boolean;
};

export const searchSuggestions: SearchSuggestion[] = [
  {
    title: 'reactjs.org',
    subtitle: '123 packages',
    vulnerable: true,
    type: 'scan',
  },
  {
    title: 'react',
    subtitle: 'React is a JavaScript library for building user interfaces.',
    type: 'package',
  },
  {
    title: 'react-dom',
    subtitle: 'React package for working with the DOM.',
    type: 'package',
  },
  {
    title: 'react-select',
    subtitle: 'A Select control built with and for ReactJS',
    type: 'package',
  },
];
