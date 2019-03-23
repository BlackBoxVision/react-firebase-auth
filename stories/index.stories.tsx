import { Button, Dialog, DialogTitle, Grow } from '@material-ui/core';
import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';
import { FirebaseAuth } from '../src';

interface ExtendedWindow extends Window {
  firebase: any;
}

declare var window: ExtendedWindow;

class AuthDialog extends React.Component {
  state = {
    open: false,
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

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  render() {
    const { open, uiConfig, firebase } = this.state;

    return (
      <Fragment>
        <Button
          variant="contained"
          onClick={open ? this.handleClose : this.handleOpen}
        >
          {open ? 'Close Auth Dialog' : 'Open Auth Dialog'}
        </Button>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle id="dialog-title">Ingresar con: </DialogTitle>
          <Grow>
            {uiConfig && firebase && (
              <FirebaseAuth
                lng="es_419"
                version="3.4.1"
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            )}
          </Grow>
        </Dialog>
      </Fragment>
    );
  }
}

storiesOf('Firebase Auth', module).add('Default', () => <AuthDialog />);
