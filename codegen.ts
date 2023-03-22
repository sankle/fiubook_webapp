import { CodegenConfig } from '@graphql-codegen/cli';
import config from './config/default';

const codegenConfig: CodegenConfig = {
  schema: config.graphqlServerUrl,
  documents: ['src/**/*.tsx'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default codegenConfig;
