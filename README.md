# Bonbon

Charts based on everyday criteria. **Trying out some React/Redux + Node.js structures**.

## Technologies
- [React 15.3.2](https://facebook.github.io/react/)
- [Redux](https://github.com/reactjs/redux)
- [Node.js](https://nodejs.org/)
- [Webpack](https://webpack.github.io/docs/)
- [Docker](https://www.docker.com/)

## Client features

- Use [normalizr](https://github.com/paularmstrong/normalizr)
- Actions are automatically bound to store `dispatch` function, no `bindActionCreator` needed
- Google auth
- Use of models (basically client equivalent of server MongoDB schemas)
- Actions and helpers are bound to models (app scoped)
- Reducers are bound to pages (domain scoped)
- Selectors are bound to reducers (domain scoped)
- Domains are groups of pages (ex: *statistics* is a domain, and has the page *Overview*)
- Most of the repetitive tasks (form management, server errors management, loading management, UI state management, etc.) are caught by app scoped middleware
- Full Immutable JS app

## Client structure

- **common**: App scoped and **redux** related, used everywhere in client
- **components**: App scoped and **react** related, reused components (like forms components)
- **middlewares**: Utilities used for form management + API calls automation
- **models**: Models related to server MongoDB schemas, used for actions and helpers
- **reducers**: Templates of reducers reused in the app by domains + global reducers declaration
- **store**: Store initialization
- Others folders are domain folders which contain pages (ex: *criteria* is a domain, and has pages *List* and *Form*) and domain scoped reducers and selectors

## Redux state structure

- **entities**: Store entities (see [normalizr](https://github.com/paularmstrong/normalizr))
- **loading**: Store loading state of each actions triggered in the app
- **ui**: **[Redux UI](https://github.com/tonyhb/redux-ui)** for UI state management
- **form**: **[Redux Form](http://redux-form.com/)** for forms state management
- **routing**: **[Redux Router](https://github.com/ReactTraining/react-router)** for routing management
- Others branches are domain branches (ex: *criteria* is a domain)

## Commands
### Development

```
docker-compose run -p 3000:3000 --rm web npm run serve-dev
```

### Production

1. Install dependencies (seeing inside)

```
docker-compose run -p HOST_PORT:3000 --rm web npm install
```
and

```
docker-compose run -p HOST_PORT:3000 --rm web npm install --only=dev
```

- **HOST_PORT**: `3000` if not already taken (or `3001`, `3002`, etc.)

2. Webpack (seeing inside)

```
docker-compose run -p HOST_PORT:3000 --rm web npm run build
```

3. Run (detached mode)

```
docker-compose run -p HOST_PORT:3000 -d web npm run serve
```

### Other commands
#### Get container id

```
docker ps
```

#### Print output

```
docker logs -f <container id>
```

#### Enter in container

```
docker exec -it <container id> /bin/bash
```

#### Remove all stopped containers

```
docker rm $(docker ps -q -f status=exited)
```

#### Remove all untagged images

```
docker rmi $(docker images -q -f dangling=true)
```

## Images

<img width="700" src="https://cloud.githubusercontent.com/assets/4401230/21498798/316832b8-cc30-11e6-8fff-31f91b187b73.png">
<img width="700" src="https://cloud.githubusercontent.com/assets/4401230/21498799/3182193a-cc30-11e6-8076-2c7f6d79d77a.png">
<img width="700" src="https://cloud.githubusercontent.com/assets/4401230/21498800/31950554-cc30-11e6-95e5-5547ba77d57c.png">
<img width="1025" src="https://cloud.githubusercontent.com/assets/4401230/21498803/3acc170c-cc30-11e6-9040-e55557cc7954.png">
