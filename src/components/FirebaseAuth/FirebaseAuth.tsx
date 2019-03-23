import React from 'react';
import { loadElement } from '../../utils';

export interface ExtendedWindow extends Window {
  firebase: any;
  firebaseui: any;
}

declare var window: ExtendedWindow;

export type SupportedLanguages =
  | 'ar'
  | 'bg'
  | 'ca'
  | 'zh_cn'
  | 'zh_tw'
  | 'hr'
  | 'cs'
  | 'da'
  | 'nl'
  | 'en'
  | 'en_gb'
  | 'fa'
  | 'fil'
  | 'fi'
  | 'fr'
  | 'de'
  | 'el'
  | 'iw'
  | 'hi'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'lv'
  | 'lt'
  | 'no'
  | 'pl'
  | 'pt_br'
  | 'pt_pt'
  | 'ro'
  | 'ru'
  | 'sr'
  | 'sk'
  | 'sl'
  | 'es'
  | 'es_419'
  | 'sv'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi';

export interface FirebaseAuthProps {
  /** Determines the id of the container */
  id?: string;
  /** Determines the translated version to load */
  lng?: SupportedLanguages;
  /** Determines the Firebase UI version to load */
  version?: string;
  /** Determines the className to apply styles to the root container */
  className?: string;
  /** Determines the config needed for Firebase UI */
  uiConfig: any;
  /** Determines the callback to be passed when Firebase UI gets initialized */
  uiCallback?: any;
  /** Determines the Firebase Auth instance to use in order to manage login */
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
      onLoad: this.handleLoad,
      type: 'script',
    });

    loadElement({
      src: `https://www.gstatic.com/firebasejs/ui/${version}/firebase-ui-auth.css`,
      type: 'link',
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
