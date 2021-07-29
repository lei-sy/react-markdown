import React from 'react';
import { MDXProvider, Components } from '@mdx-js/react';
import Highlight from 'components/highlight/highlight';
import { H2, Li, P } from 'components/highlight/styles';

const components: Components = {
  h2: (props) => <H2 {...props} />,
  li: (props) => <Li {...props} />,
  p: (props) => <P {...props} />,
  code: (props: any) => <Highlight {...props} />,
};

const HighlightLayout: React.FC = ({ children }) => (
  <MDXProvider components={components}>
    {children}
  </MDXProvider>
);

export default HighlightLayout;
