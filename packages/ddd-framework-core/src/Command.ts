import Identity from './Identity';

/**
 * Command contracts follow the same semantics as Events and can be shared
 * across systems in a similar fashion.
 */
export default abstract class Command<AggregateIdentity extends Identity> {
  public aggregateId: AggregateIdentity;

  constructor(anIdentity: AggregateIdentity) {
    this.aggregateId = anIdentity;
  }
}
