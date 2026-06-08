import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { CronExpression, ScheduleModule, SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron';
import { JobModule } from './job/job.module';
import { Job } from './job/entities/job.entity';
import { ToolModule } from './tool/tool.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '169414',
      database: 'hello',
      synchronize: true,
      logging: true,
      entities: [User, Job],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail_host'),
          port: Number(configService.get<string>('mail_port')),
          secure: configService.get<string>('mail_secure') === 'true',
          auth: {
            user: configService.get<string>('mail_user'),
            pass: configService.get<string>('mail_pass'),
          },
        },
        defaults: {
          from: configService.get<string>('mail_from'),
        },
      }),
    }),
    UsersModule,
    ToolModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  schedulerRegistry: SchedulerRegistry

  async onApplicationBootstrap() {
    const job = new CronJob(CronExpression.EVERY_SECOND, () => {
      console.log('run job')
    })
    this.schedulerRegistry.addCronJob('job1', job)
    job.start()
    setTimeout(() => {
      this.schedulerRegistry.deleteCronJob('job1')
    }, 5000)


    const intervalRef = setInterval(() => {
      console.log('run interval job')
    }, 1000)
    this.schedulerRegistry.addInterval('interval1', intervalRef)
    setTimeout(() => {
      this.schedulerRegistry.deleteInterval('interval1')
    }, 5000)


    const timeoutRef = setTimeout(() => {
      console.log('run timeout job')
    }, 3000)
    this.schedulerRegistry.addTimeout('timeout1', timeoutRef)
    setTimeout(() => {
      this.schedulerRegistry.deleteTimeout('timeout1')
    }, 5000)
  }
}
