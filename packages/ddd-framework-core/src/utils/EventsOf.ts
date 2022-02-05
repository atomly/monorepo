import EventMap from './EventMap';

export type EventsOf<Map extends typeof EventMap> =
  InstanceType<Map>[keyof InstanceType<Map>];
