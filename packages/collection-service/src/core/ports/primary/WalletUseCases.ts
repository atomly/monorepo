import * as Commands from '../../domain/wallet/Commands';

export namespace ConnectWallet {
  export type Input = Commands.ConnectWallet.V0;

  export type Output = void;

  export interface UseCase {
    connect(input: Input): PromiseLike<Output>;
  }
}

export namespace RegisterUser {
  export type Input = Commands.RegisterUser.V0;

  export type Output = void;

  export interface UseCase {
    register(input: Input): PromiseLike<Output>;
  }
}
