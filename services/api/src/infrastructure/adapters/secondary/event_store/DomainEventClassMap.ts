import DomainEventClassMap from 'ddd-framework-core/src/utils/DomainEventClassMap';
import * as WalletEvents from '../../../../core/domain/wallet/Events';

const ClassMap = new DomainEventClassMap(
  WalletEvents.WalletConnected.V0,
  WalletEvents.UserRegistered.V0,
  WalletEvents.TermsOfServiceSigned.V0,
  WalletEvents.UserProfileUpdated.V0,
  WalletEvents.ApiKeysGenerated.V0
);

export default ClassMap;
