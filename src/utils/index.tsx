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
    element.href = props.src;
    element.type = `text/css`;
    element.rel = 'stylesheet';
  }

  if (props.onLoad) {
    element.addEventListener('load', props.onLoad);
  }

  document.head.appendChild(element);
};
