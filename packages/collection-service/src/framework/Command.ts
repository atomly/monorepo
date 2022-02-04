import ValueObject from './ValueObject';

export default abstract class Command<AggregateIdentity extends ValueObject> {
  public aggregateId: AggregateIdentity;

  constructor(anIdentity: AggregateIdentity) {
    this.aggregateId = anIdentity;
  }
}
