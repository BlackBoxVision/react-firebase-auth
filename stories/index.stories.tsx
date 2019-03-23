import { FormControl, Grid, MenuItem, Select } from '@material-ui/core';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { FirebaseAuth } from '../src';

interface ExtendedWindow extends Window {
  firebase: any;
}

interface AuthModuleProps {
  languages: Array<any>;
}

declare var window: ExtendedWindow;

const getLanguages = () => [
  { value: 'vi', item: 'Vietnamese' },
  { value: 'uk', item: 'Ukrainian' },
  { value: 'tr', item: 'Turkish' },
  { value: 'th', item: 'Thai' },
  { value: 'sv', item: 'Swedish' },
  { value: 'es_419', item: 'Spanish (Latin America)' },
  { value: 'es', item: 'Spanish' },
  { value: 'sl', item: 'Slovenian' },
  { value: 'sk', item: 'Slovak' },
  { value: 'sr', item: 'Serbian' },
  { value: 'ru', item: 'Russian' },
  { value: 'ro', item: 'Romanian' },
  { value: 'pt_pt', item: 'ortuguese (Portugal)' },
  { value: 'pt_br', item: 'Portuguese (Brazil)' },
  { value: 'pl', item: 'Polish' },
  { value: 'no', item: 'Norwegian (Bokmal)' },
  { value: 'lt', item: 'Lithuanian' },
  { value: 'lv', item: 'Latvian' },
  { value: 'ko', item: 'Korean' },
  { value: 'ja', item: 'Japanese' },
  { value: 'it', item: 'Italian' },
  { value: 'id', item: 'Indonesian' },
  { value: 'hu', item: 'Hungarian' },
  { value: 'hi', item: 'Hindi' },
  { value: 'iw', item: 'Hebrew' },
  { value: 'el', item: 'Greek' },
  { value: 'de', item: 'German' },
  { value: 'fr', item: 'French' },
  { value: 'fi', item: 'Finnish' },
  { value: 'fil', item: 'Filipino' },
  { value: 'fa', item: 'Farsi' },
  { value: 'en_gb', item: 'English (UK)' },
  { value: 'en', item: 'English' },
  { value: 'nl', item: 'Dutch' },
  { value: 'da', item: 'Danish' },
  { value: 'cs', item: 'Czech' },
  { value: 'hr', item: 'Croatian' },
  { value: 'zh_tw', item: 'Chinese (Traditional)' },
  { value: 'zh_cn', item: 'Chinese (Simplified) ' },
  { value: 'ca', item: 'Catalan' },
  { value: 'bg', item: 'Bulgarian' },
  { value: 'ar', item: 'Arabic' },
];

class AuthModule extends React.Component<AuthModuleProps> {
  static defaultProps = {
    languages: getLanguages(),
  };

  state = {
    lng: 'es_419',
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

  handleChange = event => {
    this.setState({ lng: event.target.value });
  };

  render() {
    const { lng, uiConfig, firebase } = this.state;
    const { languages } = this.props;

    return (
      <>
        <Grid container>
          <Grid md={12} item>
            <FormControl>
              <Select value={lng} onChange={this.handleChange}>
                {languages.map(lang => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid md={12} item>
            {uiConfig && firebase && lng && (
              <FirebaseAuth
                lng={lng}
                version="3.4.1"
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            )}
          </Grid>
        </Grid>
      </>
    );
  }
}

storiesOf('Firebase Auth', module).add('Default', () => <AuthModule />);
