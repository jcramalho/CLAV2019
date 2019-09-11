var Excel = require('exceljs')

function excel2Json (path) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(path)
      .then(function(wb) {
        // Tratamento de Autos de Eliminação
        // Os autos de eliminação vão ser carregados num array para validações
        var index = -1
        
        var currentTime = new Date()
        //Processamento dos Autos de Eliminação
        var entidade = wb.getWorksheet(1).getRow(1).getCell(2).text;
        var fonte = wb.getWorksheet(1).getRow(2).getCell(2).text;
        var fundo = wb.getWorksheet(1).getRow(3).getCell(2).text;

        auto = {
            dataAutenticacao: currentTime.getDate()+"/"+(currentTime.getMonth()+1)+"/"+currentTime.getFullYear(),
            entidadeResponsavel: entidade,
            legistacao: "Portaria "+fonte,
            fundo: fundo,
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
                    autoDataInicio: row.getCell(6).text,
                    autoDataFim: row.getCell(7).text,
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
                            index2++;
                            auto.zonaControlo[index].agregacoes.push({
                                agregacaoCodigo: ag.getCell(3).text.replace(/[ -.,!/]/g,'_'),
                                agregacaoTitulo: ag.getCell(4).text,
                                agregacaoDataContagem: ag.getCell(5).text,
                                temNI: ag.getCell(6).text
                            })
                        }
                    }
                })
            } 
        })

        return auto
    })
}

export {excel2Json}
