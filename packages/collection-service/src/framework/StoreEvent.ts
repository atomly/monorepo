type Serialized = string;

/**
 * Holds the serialized DomainEvent. They are meant to be persisted
 * into the EventStore.
 */
export default abstract class StoreEvent<StoreEventId = string> {
  /**
   * Each StoredEvent instance gets a unique sequence value autogenerated
   * by the database and set as its eventId.
   */
  public abstract eventId: StoreEventId;

  /**
   * Its eventBody contains the serialization of the DomainEvent.
   * E.g. possible serialization to be used is JSON using the, or it
   * could use another form.
   */
  public eventBody: Serialized;

  /**
   * Copy of the same occurredOn in the DomainEvent.
   */
  public occurredOn: Date;

  /**
   * Holds the name of the concrete class of the corresponding DomainEvent.
   * Could also hold a string that is mapped to the corresponding DomainEvent.
   */
  public typeName: string;

  constructor(aTypeName: string, anOccurredOn: Date, anEventBody: Serialized) {
    this.eventBody = anEventBody;
    this.occurredOn = anOccurredOn;
    this.typeName = aTypeName;
  }
}
