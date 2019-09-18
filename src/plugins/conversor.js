var Excel = require('exceljs')

var excel2Json = function (file) {
    return new Promise(function(resolve,reject){
        var workbook = new Excel.Workbook();
        workbook.xlsx.load(file)
        .then(function(wb) {
            // Tratamento de Autos de Eliminação
            // Os autos de eliminação vão ser carregados num array para validações
            var index = -1
            
            //Array de Erros
            var err = []

            var currentTime = new Date()
            //Processamento dos Autos de Eliminação
            var auto = {
                entidade: wb.getWorksheet(1).getRow(1).getCell(2).text.replace(/-/g," "),
                legislacao: wb.getWorksheet(1).getRow(2).getCell(2).text,
                fundo: wb.getWorksheet(1).getRow(3).getCell(2).text,
                zonaControlo: []
            }

            var autos = wb.getWorksheet(2);
            autos.eachRow(function(row, rowNumber) {
                if(rowNumber > 1) {
                    //Formatação do array dos AE
                    index++;
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
                    })
                    var conservacao = row.getCell(4).value
                    var codigo = row.getCell(1).text

                    var agreg = wb.getWorksheet(3)
                    agreg.eachRow(function(ag, agNumber) {
                        if(agNumber>1 && ag.getCell(1).text === codigo) {
                            //Invariante da data de Conservacao
                            var dataContagem = ag.getCell(5).value
                            var res = parseInt(conservacao) + parseInt(dataContagem)
                            if(res <= currentTime.getFullYear()) {
                                auto.zonaControlo[index].agregacoes.push({
                                    codigo: ag.getCell(3).text.replace(/[ -.,!/]/g,'_'),
                                    titulo: ag.getCell(4).text,
                                    dataContagem: ag.getCell(5).text,
                                    ni: ag.getCell(6).text
                                })
                            } else {
                                err.push({
                                    codigo: codigo,
                                    agregacao: ag.getCell(3).text
                                })
                            }
                        } 
                    })
                } 
            })
            resolve({ auto: auto, error: err })
        })
        .catch(() => reject(new Error("Error")))
    })
}

export {excel2Json}
