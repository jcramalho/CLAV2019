var Excel = require("exceljs");

var excel2Json = function(file, tipo) {
  return new Promise(function(resolve, reject) {
    var workbook = new Excel.Workbook();
    workbook.xlsx
      .load(file)
      .then(function(wb) {
        // Tratamento de Autos de Eliminação
        // Os autos de eliminação vão ser carregados num array para validações
        var index = -1;

        //Array de Erros
        var err = [];

        var currentTime = new Date();
        //Processamento dos Autos de Eliminação
        var auto = {
          tipo: tipo,
          entidade: wb
            .getWorksheet(1)
            .getRow(1)
            .getCell(2).text,
          fundo: wb
            .getWorksheet(1)
            .getRow(3)
            .getCell(2).text,
          zonaControlo: []
        };
        if (tipo !== "RADA")
          auto.legislacao =
            "Portaria " +
            wb
              .getWorksheet(1)
              .getRow(2)
              .getCell(2).text;
        else
          auto.legislacao = wb
            .getWorksheet(1)
            .getRow(2)
            .getCell(2).text;

        var autos = wb.getWorksheet(2);
        autos.eachRow(function(row, rowNumber) {
          if (rowNumber > 1) {
            //Formatação do array dos AE
            index++;
            var conservacao;
            var codigo = row.getCell(1).text;
            if (tipo === "PGD_LC") {
              auto.zonaControlo.push({
                codigo: row.getCell(1).text,
                titulo: row.getCell(2).text,
                prazoConservacao: row.getCell(3).text,
                destino: row.getCell(4).text,
                dataInicio: row.getCell(5).text,
                dataFim: row.getCell(6).text,
                uiPapel: row.getCell(8).text,
                uiDigital: row.getCell(9).text,
                uiOutros: row.getCell(10).text,
                agregacoes: []
              });
              conservacao = row.getCell(3).text;
            } else {
              auto.zonaControlo.push({
                codigo: row.getCell(1).text,
                referencia: row.getCell(2).text,
                titulo: row.getCell(3).text,
                prazoConservacao: row.getCell(4).text,
                destino: row.getCell(5).text,
                dataInicio: row.getCell(6).text,
                dataFim: row.getCell(7).text,
                uiPapel: row.getCell(9).text,
                uiDigital: row.getCell(10).text,
                uiOutros: row.getCell(11).text,
                agregacoes: []
              });
              var referencia = row.getCell(2).text;
              conservacao = row.getCell(4).value;
            }

            var agreg = wb.getWorksheet(3);
            var dataContagem;
            var res;
            agreg.eachRow(function(ag, agNumber) {
              if (tipo === "PGD_LC") {
                if (agNumber > 1 && ag.getCell(1).text === codigo) {
                  //Invariante da data de Conservacao
                  dataContagem = ag.getCell(4).value;
                  res = parseInt(conservacao) + parseInt(dataContagem);
                  if (res < currentTime.getFullYear()) {
                    auto.zonaControlo[index].agregacoes.push({
                      codigo: ag.getCell(2).text.replace(/[ -.,!/]/g, "_"),
                      titulo: ag.getCell(3).text,
                      dataContagem: ag.getCell(4).text,
                      ni: ag.getCell(5).text
                    });
                  } else {
                    err.push({
                      codigo: codigo,
                      agregacao: ag.getCell(2).text
                    });
                  }
                }
              } else {
                if (
                  agNumber > 1 &&
                  (ag.getCell(1).text === codigo &&
                    ag.getCell(2).text === referencia)
                ) {
                  //Invariante da data de Conservacao
                  dataContagem = ag.getCell(5).value;
                  res = parseInt(conservacao) + parseInt(dataContagem);
                  if (res < currentTime.getFullYear()) {
                    auto.zonaControlo[index].agregacoes.push({
                      codigo: ag.getCell(3).text.replace(/[ -.,!/]/g, "_"),
                      titulo: ag.getCell(4).text,
                      dataContagem: ag.getCell(5).text
                    });
                  } else {
                    err.push({
                      codigo: codigo,
                      referencia: referencia,
                      agregacao: ag.getCell(3).text
                    });
                  }
                }
              }
            });
          }
        });
        resolve({ auto: auto, error: err });
      })
      .catch(() => reject(new Error("Error")));
  });
};

var csv2Json = function(fileSerie, fileAgreg, tipo) {
  return new Promise(function(resolve, reject) {
    var enc = new TextDecoder("utf-8");
    var series = enc.decode(fileSerie).split("\n")
    var agregacoes = enc.decode(fileAgreg).split("\n")
    series.shift()
    agregacoes.shift()
    var auto = {
      tipo: tipo,
      zonaControlo: []
    };
    series.forEach(s => {

      var serie = s.split(/[;,]/)
      if(serie[0]) {
        var zc = {
          codigo: serie[0],
          referencia: serie[1],
          titulo: serie[2],
          dataInicio: serie[3],
          dataFim: serie[4],
          uiPapel: serie[6],
          uiDigital: serie[7],
          uiOutros: serie[8],
          agregacoes: []
        }
        agregacoes.forEach(a => {
          var agregacao = a.split(/[;,]/)
          if(agregacao[0]==zc.codigo && agregacao[1]==zc.referencia) {
            var ag = {
              codigo: agregacao[2].replace(/[ -.,!/]/g, "_"),
              titulo: agregacao[3],
              dataContagem: agregacao[4],
              ni: agregacao[5]
            }
            zc.agregacoes.push(ag)
          }
        })
        auto.zonaControlo.push(zc)
      }
      else return;
    })
    resolve({auto: auto})
  });
};

export { csv2Json };
