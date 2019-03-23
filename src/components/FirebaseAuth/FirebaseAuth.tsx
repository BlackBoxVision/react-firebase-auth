import React from 'react';
import { loadElement } from '../../utils';

export interface ExtendedWindow extends Window {
  firebase: any;
  firebaseui: any;
}

declare var window: ExtendedWindow;

export interface FirebaseAuthProps {
  id?: string;
  lng?: string;
  version?: string;
  className?: string;
  uiConfig: any;
  uiCallback?: any;
  firebaseAuth: any;
}

let firebaseUiDeletion = Promise.resolve();

export default class FirebaseAuth extends React.Component<FirebaseAuthProps> {
  unregisterAuthObserver = () => {};

  firebaseUiWidget = null;

  userSignedIn = null;

  static defaultProps = {
    id: 'firebaseui_container',
    version: '3.4.1',
    lng: 'es_419',
  };

  componentDidMount() {
    const { lng, version } = this.props;

    loadElement({
      src: `https://www.gstatic.com/firebasejs/ui/${version}/firebase-ui-auth__${lng}.js`,
      onload: this.handleLoad,
      type: 'script',
    });

    loadElement({
      src: `https://www.gstatic.com/firebasejs/ui/${version}/firebase-ui-auth.css`,
      type: `link`,
    });
  }
  
  componentWillUnmount() {
    firebaseUiDeletion = firebaseUiDeletion.then(() => {
      this.unregisterAuthObserver();
      return this.firebaseUiWidget.delete();
    });

    return firebaseUiDeletion;
  }

  render() {
    const { className, id } = this.props;

    return <div id={id} className={className} />;
  }

  handleLoad = () => {
    const { uiCallback, uiConfig, firebaseAuth, id } = this.props;
    const { firebaseui } = window;

    return firebaseUiDeletion.then(() => {
      // Get or Create a firebaseUI instance.
      this.firebaseUiWidget =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebaseAuth);

      if (uiConfig.signInFlow === 'popup') {
        this.firebaseUiWidget.reset();
      }

      // We track the auth state to reset firebaseUi if the user signs out.
      this.userSignedIn = false;
      this.unregisterAuthObserver = firebaseAuth.onAuthStateChanged(user => {
        if (!user && this.userSignedIn) {
          this.firebaseUiWidget.reset();
        }

        this.userSignedIn = !!user;
      });

      // Trigger the callback if any was set.
      if (uiCallback) {
        uiCallback(this.firebaseUiWidget);
      }

      // Render the firebaseUi Widget.
      this.firebaseUiWidget.start(`#${id}`, uiConfig);
    });
  };
}
