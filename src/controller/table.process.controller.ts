import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TableProcessService } from 'src/service/table.process.service';

@Controller('process')
export class TableProcessController {
  constructor(
    private tableProcessService: TableProcessService
  ) {}

  @Post()
  async processTable(@Res() res: Response): Promise<any> {
    try {
      await this.tableProcessService.processTable();
      res.status(201).send();
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
