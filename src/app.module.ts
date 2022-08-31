import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { typeOrmConfig } from './config';

@Module({
  imports: [CoffeesModule, TypeOrmModule.forRootAsync(typeOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
