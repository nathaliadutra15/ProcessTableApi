import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { DatabaseService } from 'src/database/database.service';
import { ISheet } from 'src/model/sheet.model';
const ExcelJS = require('exceljs');

@Injectable()
export class TableProcessService {
    constructor(
        @Inject(DatabaseService)
        private readonly databaseService: DatabaseService,
    ) { }

    async processTable() {
        try {
            //Busca pelo arquivo xlsx
            const sheet = readFileSync(process.env.XLSX_PATH as string);
            const workbook = new ExcelJS.Workbook();
            //Carga da tabela
            await workbook.xlsx.load(sheet);

            //Busca por cada tabela/aba
            workbook.eachSheet(async (worksheet, sheetId) => {
                let sheet = workbook.getWorksheet(worksheet.name);
                let rowQuantity = sheet.rowCount - 1; // Desconsiderando cabeçalho da contagem de registros na tabela
                let columnNames = sheet.getRow(1).values.filter(e => typeof e != "undefined");

                if (rowQuantity > 0) {
                    let rowNum = 2; // Linha inicial para buscar pelos registros
                    for (let i = 0; i < rowQuantity; i++) {
                        let rowValues = sheet.getRow(rowNum).values.filter(e => typeof e != "undefined");
                        // Realiza o envio do objeto para o banco de dados
                        await this.sendToSQL(this.buildJSON(columnNames, rowValues));
                        rowNum++;
                    }
                }
            });

        } catch (error) {
            throw error;
        }
    }

    private buildJSON(columnNames: string[], rowValues: any[]): ISheet {
        let obj = {};
        for (let i = 0; i < columnNames.length; i++) {
            obj[columnNames[i]] = rowValues[i].toString();
        }
        return obj;
    }

    private async sendToSQL(obj: ISheet) {
        await this.databaseService.connect();
        await this.databaseService.query(`INSERT INTO clientes VALUES (${this.buildInsert(obj)})`);
        await this.databaseService.disconnect();
    }

    private buildInsert(obj: ISheet): string {
        let queryValues = "";
        Object.keys(obj).map(key => {
            if (Object.keys(obj).indexOf(key) == (Object.keys(obj).length - 1)) { // se for o último campo a ser preenchido
                queryValues += `'${obj[key].toString()}'`
            } else {
                queryValues += `'${obj[key].toString()}',`
            }
        });
        return queryValues;
    }
}
