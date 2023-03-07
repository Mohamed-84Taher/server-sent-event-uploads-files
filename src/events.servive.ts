import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';

@Injectable()
export class EventsService {
  private readonly eventEmitter: EventEmitter;
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  subscribe(channel: string) {
    return fromEvent(this.eventEmitter, channel);
  }

  sendNotification(channel: string, data: object) {
    this.eventEmitter.emit(channel, { data });
  }
}
