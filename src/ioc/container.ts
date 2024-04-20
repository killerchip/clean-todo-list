import { Container } from 'inversify';

import { ToDoGateway } from '../gateways/ToDoGateway';

const container = new Container({
  autoBindInjectable: true,
  defaultScope: 'Transient',
});

// Stores and some gateways should be singletons
container.bind(ToDoGateway).toSelf().inSingletonScope();

export function getContainer() {
  return container;
}
