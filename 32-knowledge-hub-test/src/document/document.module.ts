import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DocumentContent,
  DocumentContentSchema,
} from './schemas/document-content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentContent.name, schema: DocumentContentSchema },
    ]),
  ],
  controllers: [DocumentController],
  // 声明能被nestjs依赖注入系统管理的对象和服务
  // DocumentService能被实例化并注入到其他地方使用了(本模块其他Controller和本模块其他Service)
  providers: [DocumentService],
  // 供其他模块导入使用
  exports: [DocumentService],
})
export class DocumentModule {}
