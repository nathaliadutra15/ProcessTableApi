import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConnectionPool, Request } from 'mssql';
import * as sql from 'mssql';


@Injectable()
export class DatabaseService {
  private pool: ConnectionPool;

  constructor(
    private configService: ConfigService,
  ) {
    this.pool = new sql.ConnectionPool(configService.get('sqlConfig'));
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
    } catch (error) {
      throw new Error(`Failed to connect to the database: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.close();
    } catch (error) {
      throw new Error(`Failed to disconnect from the database: ${error}`);
    }
  }

  async query(queryString: string, params?: any[]): Promise<any> {
    try {
      const request = new Request(this.pool);
      if (params && params.length > 0) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
      }
      const result = await request.query(queryString);
      return result.recordset;
    } catch (error) {
      throw new Error(`Failed to execute query: ${error}`);
    }
  }
}