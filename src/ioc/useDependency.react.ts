import { interfaces } from 'inversify';
import { useState } from 'react';

import { getContainer } from './container';

export function useInject<T>(identifier: interfaces.ServiceIdentifier<T>): T {
  const container = getContainer();
  const [dependency] = useState(() => container.get<T>(identifier));

  return dependency;
}
