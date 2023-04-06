# Wow Projection / Customer branch

## Localhost

### 1) Install Node.js

Download from https://nodejs.org/en/download/ and install

Check node and npm available at your system.
Run in terminal:

```bash
node -v
npm -v
```

Follow https://docs.npmjs.com/downloading-and-installing-node-js-and-npm in case of issues

### 2) Install Yarn

```
npm install --global yarn

# Check installation:
yarn --version
```

### 3) Download source code

Get required branch from this repository https://bitbucket.org/prasaanth_sab/wowprojection/src


### 4) Project setup

Run under the project folder

```bash
yarn install
```

#### 5) Compiles and hot-reloads for development

It will launch localhost server
Run under the project folder

```bash
yarn serve
```

### Compiles and minifies for production
Run under the project folder

```bash
yarn build
```

### Lints and fixes files
Run under the project folder

```bash
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Configure MQTT connection

Set initial params in ```src/assets/js/hooks/useMqtt.js```.