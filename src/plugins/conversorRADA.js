var Excel = require("exceljs");
const nanoid = require("nanoid");

var excel2Json = function(file) {
  console.log("Conversor", file);
  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    workbook.xlsx
      .load(file)
      .then(wb => {

        let RADA = {
          id: nanoid(),
          titulo: wb.getWorksheet(1).getRow(2).getCell(2).text,
          despachoAprovacao: null,
          dataAprovacao: null,
          despachoRevogacao: null,
          dataRevogacao: null,
          entRes: [wb.getWorksheet(1).getRow(3).getCell(2).text],
          RE: {
            entidadesProd: [
              [wb.getWorksheet(2).getRow(3).getCell(2).text]
            ],
            tipologiasProd: [],
            // dataInicial: "2020-01-02",
            // dataFinal: "2020-06-01",
            dataInicial: wb.getWorksheet(2).getRow(5).getCell(2).text,
            dataFinal: wb.getWorksheet(2).getRow(5).getCell(2).text,
            dimSuporte: {
              nSeries: null,
              nSubseries: null,
              nUI: null,
              medicaoUI_papel: null,
              medicaoUI_digital: null,
              medicaoUI_outros: null
            },
            hist_admin: wb.getWorksheet(2).getRow(9).getCell(2).text,
            hist_cust: wb.getWorksheet(2).getRow(10).getCell(2).text,
            sist_org: wb.getWorksheet(2).getRow(12).getCell(2).text,
            localizacao: wb.getWorksheet(2).getRow(14).getCell(2).text,
            est_conser: wb.getWorksheet(2).getRow(15).getCell(2).text
          },
          tsRada: {
            titulo: "Necessário adicionar título TS",
            UIs: [],
            classes: []
          }
        }
        // // Tratamento de Autos de Eliminação
        // // Os autos de eliminação vão ser carregados num array para validações
        // var index = -1;

        // //Array de Erros
        // var err = [];

        // var currentTime = new Date();
        // //Processamento dos Autos de Eliminação
        // var auto = {
        //   tipo: tipo,
        //   entidade: wb
        //     .getWorksheet(1)
        //     .getRow(1)
        //     .getCell(2).text,
        //   fundo: wb
        //     .getWorksheet(1)
        //     .getRow(3)
        //     .getCell(2).text,
        //   zonaControlo: []
        // };
        // , wb.getWorksheet(1).getRow(1).getCell(2).text
        resolve(RADA);
      })
      .catch(err => reject(new Error("Error no EXCEL", err)));
  });
};

export { excel2Json };