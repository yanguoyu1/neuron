export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 50

export enum Channel {
  App = 'app',
  Networks = 'networks',
  Wallets = 'wallets',
  Transactions = 'transactions',
}

export enum ResponseCode {
  Fail,
  Success,
}

export default {
  Channel,
  ResponseCode,
}