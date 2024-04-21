import { interfaces } from 'inversify';
import { createContext, useContext as useContextReact, useState } from 'react';

import { getContainer } from './container';

export function useNewDependency<T>(
  identifier: interfaces.ServiceIdentifier<T>,
  init?: (dependency: T) => void,
): T {
  const container = getContainer();
  const [dependency] = useState(() => container.get<T>(identifier));
  if (init) {
    init(dependency);
  }

  return dependency;
}

export function createDependencyContext<T>() {
  const Context = createContext<T | null>(null);
  const useContext = () => {
    const presenter = useContextReact(Context);
    if (!presenter) {
      throw new Error(
        ['Context Value was not found', Context.displayName].join(' : '),
      );
    }

    return presenter;
  };

  return { Context, useContext };
}
