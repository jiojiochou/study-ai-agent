import { Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  scheModuleRegistr: SchedulerRegistry;

  async onApplicationBootstrap() {
    // 每秒执行一次
    // const job = new CronJob(CronExpression.EVERY_SECOND, () => {
    //   console.log('raaaa userJob')
    // })
    // this.scheModuleRegistr.addCronJob('userJob', job)
    // job.start()
  }
}
