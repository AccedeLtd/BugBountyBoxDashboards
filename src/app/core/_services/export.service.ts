import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor() { }

  exportCsv(data: any, fileName: string) {
    const replacer = (key: any, value: any) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, `${fileName}.csv`);
  }
  
  exportUnorderedListCsv(tableClass: string, fileName: string) {
    let csv = [];
    let pastPayments = document.querySelectorAll(tableClass);
    let pastPaymentsNode = pastPayments[0];
    let items = pastPaymentsNode.querySelectorAll('.table-item');
    
    for (const row of Object.values(items)) {
  //    console.log(row);
      const cells = row.querySelectorAll('.data-item');
      const rowText = Array.from(cells).map(cell => cell.textContent?.replace(',', ' '));//replace comma in amount cell
      csv.push(rowText.join(','));
    }

    const csvFile = new Blob([csv.join('\n')], {type: "text/csv;charset=utf-8;"});
    saveAs(csvFile, `${fileName}.csv`);
  }

}
