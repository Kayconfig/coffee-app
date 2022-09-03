import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoffeesModule } from './coffees/coffees.module';
import { typeOrmConfig } from './config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
