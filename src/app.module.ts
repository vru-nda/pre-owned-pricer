import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
const cookieSession = require('cookie-session');

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Report } from './reports/report.entity';
import { User } from './users/user.entity';

import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Sqlite setup
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    ReportsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Validation Pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  // Middlware setup for routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: ['awrfwew'],
      }),
    ).forRoutes("*");
  }
}
