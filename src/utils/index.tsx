export interface LoadElementProps {
  src: string;
  type: string;
  onLoad?: any;
}

export const loadElement = (props: LoadElementProps) => {
  const element: any = document.createElement(props.type);

  if (props.type === 'link') {
    element.href = props.src;
    element.type = `text/css`;
    element.rel = 'stylesheet';
  } else {
    element.src = props.src;
    element.type = `text/javascript`;

    element.async = true;
    element.defer = true;
  }

  if (props.onLoad) {
    element.addEventListener('load', props.onLoad);
  }

  document.head.appendChild(element);
};
