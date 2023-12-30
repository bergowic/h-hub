import Pdfparser, { Output } from "pdf2json";
import request from "request";

export const getPdfFromFile = (filePath: string): Promise<Output> => {
    return new Promise(async (success, fail) => {
      const pdfParser = new Pdfparser();
  
      pdfParser.on('pdfParser_dataError', errData => {
        fail(errData);
      });
  
      pdfParser.on('pdfParser_dataReady', pdfData => {
        success(pdfData);
      });
  
      try {
        await pdfParser.loadPDF(filePath)
      } catch (e) {
        fail(e)
      }
    });
  }

export const getPdfFromUrl = (url: string): Promise<Output> => {
    return new Promise((success, fail) => {
        const pdfParser = new Pdfparser();
    
        pdfParser.on('pdfParser_dataError', errData => {
            fail(errData);
        });
    
        pdfParser.on('pdfParser_dataReady', pdfData => {
            success(pdfData);
        });
    
        request({url: url, encoding: null}, (err, response, buffer) => {
            pdfParser.parseBuffer(buffer);
        });
    });
}