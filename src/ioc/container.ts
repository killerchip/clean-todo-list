import { Container } from 'inversify';

import { ToDoGateway } from '../gateways/ToDoGateway';
import { ToDoStore } from '../stores/ToDoStore';

const container = new Container({
  autoBindInjectable: true,
  defaultScope: 'Transient',
});

// Stores and some gateways should be singletons
container.bind(ToDoGateway).toSelf().inSingletonScope();
container.bind(ToDoStore).toSelf().inSingletonScope();

export function getContainer() {
  return container;
}
