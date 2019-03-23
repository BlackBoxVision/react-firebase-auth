import { FirebaseAuth } from '@blackbox-vision/react-firebase-auth';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';

// Configure Firebase.
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
};

firebase.initializeApp(config);
window.firebase = firebase;

const uiConfig = {
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
};

export interface AuthDialogProps {
  open: boolean;
  onClose?: any;
  uiConfig: any;
  firebaseAuth: any;
}

const AuthDialog: React.FunctionComponent<AuthDialogProps> = ({
  open,
  onClose,
  uiConfig,
  firebaseAuth,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle id="dialog-title">Ingresar con: </DialogTitle>
    <FirebaseAuth
      lng="es_419"
      version="3.4.1"
      uiConfig={uiConfig}
      firebaseAuth={firebaseAuth}
    />
  </Dialog>
);

storiesOf('Firebase Auth', module).add('Default', () => {
  return (
    <AuthDialog
      uiConfig={uiConfig}
      firebaseAuth={firebase.auth()}
      open={boolean('Enable', false)}
    />
  );
});
