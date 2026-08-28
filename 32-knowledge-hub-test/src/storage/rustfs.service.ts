import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RustfsService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  onModuleInit() {}
}
