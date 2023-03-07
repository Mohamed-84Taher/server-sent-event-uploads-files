import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsService } from './events.servive';
import { FileModule } from './file/file.module';

@Module({
  imports: [FileModule],
  controllers: [AppController],
  providers: [AppService, EventsService],
})
export class AppModule {}
