import { Controller, Post } from '@nestjs/common';
import { TableProcessService } from 'src/service/table.process.service';

@Controller('process')
export class TableProcessController {
  constructor(
    private tableProcessService: TableProcessService
  ) {}

  @Post()
  async processTable(): Promise<any> {
    return this.tableProcessService.processTable();
  }
}
