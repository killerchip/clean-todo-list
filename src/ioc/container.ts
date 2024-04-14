import { Container } from 'inversify';

const container = new Container({
  autoBindInjectable: true,
  defaultScope: 'Transient',
});

export function getContainer() {
  return container;
}
