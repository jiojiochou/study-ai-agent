import { forwardRef, Module } from '@nestjs/common';
import { ToolService } from './tool.service';
import { UsersModule } from 'src/users/users.module';
import { JobModule } from 'src/job/job.module';

@Module({
  imports: [UsersModule, forwardRef(() => JobModule)],
  controllers: [],
  providers: [ToolService],
})
export class ToolModule { }
