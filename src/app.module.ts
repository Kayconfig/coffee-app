import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { typeOrmConfig } from './config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
