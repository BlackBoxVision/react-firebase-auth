# React Firebase Auth [![npm version](https://badge.fury.io/js/%40blackbox-vision%2Freact-firebase-auth.svg)](https://badge.fury.io/js/%40blackbox-vision%2Freact-firebase-auth) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![Known Vulnerabilities](https://snyk.io/test/github/blackboxvision/react-firebase-auth/badge.svg)](https://snyk.io/test/github/blackboxvision/react-firebase-auth)

🥳 Firebase Auth Module with support for Translations. Check out the [demo](https://blackboxvision.github.io/react-firebase-auth/).

## Install

You can install this library via NPM or YARN.

### NPM

```bash
npm i @blackbox-vision/react-firebase-auth
```

### YARN

```bash
yarn add @blackbox-vision/react-firebase-auth
```

## Use case

Need to render Firebase Auth, but also need to load an specific translated version.

## Usage

The usage is really simple:

```javascript
// App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAuth } from '@blackbox-vision/react-firebase-auth';

class AuthModule extends React.Component {
  state = {
    uiConfig: null,
    firebase: null,
  };

  componentDidMount() {
    const firebase = require('firebase/app');
    require('firebase/auth');

    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: process.env.FIREBASE_API_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
      });
    }

    window.firebase = firebase;

    this.setState({
      firebase,
      uiConfig: {
        signInFlow: 'popup',
        // Redirect to 'url' after sign in is successful.
        signInSuccessUrl: `${window.location.href}`,
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          {
            provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            scopes: ['public_profile', 'email', 'user_likes', 'user_friends'],
          },
        ],
        callbacks: {
          signInSuccessWithAuthResult: (...args) => {
            return false;
          },
        },
      },
    });
  }

  render() {
    const { uiConfig, firebase } = this.state;

    return (
      <Fragment>
        {uiConfig && firebase && (
          <FirebaseAuth
            lng="es_419"
            version="3.4.1"
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </Fragment>
    );
  }
}

ReactDOM.render(<AuthModule />, document.getElementById('root'));
```

## Props

`FirebaseAuth` use the following props:

| Properties   | Types    | Default Value        | Description                                                                                                                                                      |
| ------------ | -------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id           | string   | firebaseui_container | Determines wheter to render Firebase UI.                                                                                                                         |
| lng          | string   | es_419               | Determines the specific lang to load. [Refer to Supported Languages for more info](https://github.com/BlackBoxVision/react-firebase-auth/blob/master/LANGUAGES). |
| version      | string   | 3.4.1                | Determines the specific version to load.                                                                                                                         |
| uiConfig     | object   | none                 | Determines the config for Firebase UI.                                                                                                                           |
| firebaseAuth | object   | none                 | Determines the firebase auth instance.                                                                                                                           |
| className    | string   | none                 | Determines className to apply to the container.                                                                                                                  |
| uiCallback   | function | none                 | Determines the callback to run when Firebase UI is available                                                                                                     |

## Issues

Please, open an [issue](https://github.com/BlackBoxVision/react-firebase-auth/issues) following one of the issues templates. We will do our best to fix them.

## Contributing

If you want to contribute to this project see [contributing](https://github.com/BlackBoxVision/react-firebase-auth/blob/master/CONTRIBUTING.md) for more information.

## License

Distributed under the **MIT license**. See [LICENSE](https://github.com/BlackBoxVision/react-firebase-auth/blob/master/LICENSE) for more information.
