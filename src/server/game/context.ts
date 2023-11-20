import { ContextDecorator } from '@roxavn/core/server';
import { makeSocketContextDecorator } from '@roxavn/module-socket/server';

export const GameName: ContextDecorator<string> = (
  target,
  propertyKey,
  parameterIndex
) => {
  makeSocketContextDecorator(target, propertyKey, parameterIndex, (context) => {
    // remove first character "/" in namespace
    return context.namespace.name.slice(1);
  });
};
