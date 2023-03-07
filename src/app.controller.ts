import { Controller, Get, Post, Sse, Param } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { AppService } from './app.service';
import { EventsService } from './events.servive';

interface NotificationMessage {
  data: string | object;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private eventsService: EventsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('event')
  sendMessage(): Observable<NotificationMessage> {
    return interval(1000).pipe(
      map((num: number) => ({
        data: `Hello ${num}`,
      })),
    );
  }

  @Sse('send-notification')
  sendNotification(): Observable<any> {
    const list = ['a', 'b', 'c'];
    return new Observable((subscriber) => {
      while (list.length) {
        subscriber.next(list.pop());
      }
      if (!list.length) subscriber.complete();
    });
  }
  @Sse('notification/:id')
  notifications(@Param('id') id: string) {
    return this.eventsService.subscribe('notification/' + id);
  }

  @Post('create-verification')
  createVerification() {
    this.eventsService.sendNotification('notification/2', {
      msg: 'student 1 sent verification',
    });
    return { ok: true };
  }
}
