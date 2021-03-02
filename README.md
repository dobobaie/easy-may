# Service Easy May

> More details later...
> This project is a simple dumb "cloud" it will be removed later

## Requirement

### Hosts

> Create a new host mapping in the `hosts` file
> Add `local.api.easymay.fr 127.0.0.1`

### Environement

> Move `.env.example` to `.env`
> Edit variables inside

## Build Setup

```bash
# install dependencies
$ npm install
$ git submodule update --init --recursive

# initialize the project (SQL)
$ npm run init # ONLY IF TYPEORM IS NOT SYNC

# Generate routes
$ npm run routes

# serve with hot reload at localhost:3000
$ npm run watch
$ npm run serve
```

### Build Setup for production

```bash
# build for production and launch server
$ npm run build
$ npm run start
```

### Remettre à jour le projet

```bash
npm run git-reset
```

### Générer le fichier swagger

```bash
npm run swagger
```
