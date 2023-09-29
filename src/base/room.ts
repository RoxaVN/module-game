export class BaseGameRoom<T> {
  maxUsers = Infinity;
  users: Array<string> = [];

  constructor(
    public readonly id: string,
    public state: T
  ) {}
}
