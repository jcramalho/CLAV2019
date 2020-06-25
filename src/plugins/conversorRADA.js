var Excel = require("exceljs");

var excel2Json = function(file) {
  return new Promise((resolve, reject) => {
    var workbook = new Excel.Workbook();
    workbook.xlsx
      .load(file)
      .then(wb => {
          console.log(wb)
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
        resolve('tranki');
      })
      .catch(ERR => reject(new Error("Error no EXCEL", ERR)));
  });
};

export { excel2Json };