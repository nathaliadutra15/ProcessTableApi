import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { TableProcessController } from './controller/table.process.controller';
import { TableProcessService } from './service/table.process.service';
import { ConfigModule } from '@nestjs/config';
import sqlConfig  from './configs/read.config'

@Module({
  imports: [ConfigModule.forRoot({
    load: [sqlConfig]
  })],
  controllers: [AppController, TableProcessController],
  providers: [AppService, DatabaseService, TableProcessService],
})
export class AppModule {}
