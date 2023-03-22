# FIUBOOK Webapp

**FIUBOOK** is a university booking system that allows service offerers to publish their services (such as _books_, _classrooms_, _projectors_, etc.) and requestors to book those services. Services bookings can be automatically confirmed or manually confirmed by the service owner, and they can be flagged as returnable (if they are physical objects, such as projectors) or not. It is a role-based system, so services can be configured to be booked by a subset of useres that have certain roles. 

It also provides an Administrator console that enables management of services, bookings, users, and displays system usage metrics.

Developed on assignment "(75.61) Programming Workshop III" - Faculty of Engineering, Buenos Aires University

| **Student**               | **Student ID** | **Github User**                                 |
|---------------------------|----------------|-------------------------------------------------|
| Aguerre, Nicolás Federico |     102145     |    [@nicomatex](https://github.com/nicomatex)   |
| Klein, Santiago           |     102192     |     [@sankle](https://github.com/sankle)        |

[Here](https://github.com/nicomatex/fiubook_core) you can find the backend repository.

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
  ...
};
```

4. Add [ImgBB](https://imgbb.com/) (service we use to store images) API key in `imageUtils.ts`.

- `default.ts`

```
const config = {
  ...
  imgBBApiKey: 'your-api-key',
};
```

5. Start the service

```
npm start
```

6. Enjoy ;)
