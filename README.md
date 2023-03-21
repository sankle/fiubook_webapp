# FIUBOOK Webapp

## Run the webapp

1. Install `Node v18.12.1`. If you have `nvm` installed, you can simply run, on the root directory of the project:

```
nvm i
nvm use
```

2. Install the dependencies:

```
npm i
```

3. Configure the [FIUBOOK Core](https://github.com/nicomatex/fiubook_core) URL in both `codegen.ts` and `default.ts`:

- `codegen.ts`

```
const config: CodegenConfig = {
  schema: 'http://fiubook-core-ip:3000/graph',
  ...
};
```

- `default.ts`

```
const config = {
  graphqlServerUrl: 'http://fiubook-core-ip:3000/graph',
};
```

4. Start the service

```
npm start
```

5. Enjoy ;)

## Image API Key

1. Image uploading for services will not work as is. For this to work, you should update the API key for ImgBB in `imageUtils.ts`
