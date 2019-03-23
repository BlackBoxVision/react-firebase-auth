import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/react';

addParameters({
  options: {
    brandTitle: '@blackbox-visiosn/react-firebase-auth',
    //theme: themes.light,
  },
});

addDecorator(withKnobs);
addDecorator(withInfo({ inline: true, header: false }));

const req = require.context('../stories', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
