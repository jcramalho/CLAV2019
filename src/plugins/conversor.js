/* eslint-disable */
var Excel = require("exceljs");

var excel2Json = function (file, tipo) {
  return new Promise(function (resolve, reject) {
    var workbook = new Excel.Workbook();
    workbook.xlsx
      .load(file)
      .then(function (wb) {
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
        autos.eachRow(function (row, rowNumber) {
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
            agreg.eachRow(function (ag, agNumber) {
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
                  ag.getCell(1).text === codigo &&
                  ag.getCell(2).text === referencia
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

var verificarSerie = function(str) {
  var arr = str.split(/[,;](?=(?:(?:[^"]*"){2})*[^"]*$)/)
  if(arr[0].replace(/['"]/g,'').trim() != "Código de classificação da classe / série") return false;
  if(arr[1].replace(/['"]/g,'').trim() != "Número de referência") return false;
  if(arr[2].replace(/['"]/g,'').trim() != "Título da classe / série") return false;
  if(arr[3].replace(/['"]/g,'').trim() != "Data inicial da documentação proposta para eliminação") return false;
  if(arr[4].replace(/['"]/g,'').trim() != "Data final da documentação proposta para eliminação") return false;
  if(arr[5].replace(/['"]/g,'').trim() != "Nº de agregações simples / UI – unidade de instalação") return false;
  if(arr[6].replace(/['"]/g,'').trim() != "Medição das agregações / UI em papel (m.l.)") return false;
  if(arr[7].replace(/['"]/g,'').trim() != "Medição das agregações / UI em digital (Gb)") return false;
  if(arr[8].replace(/['"]/g,'').trim() != "Medição das agregações / UI noutros suportes") return false;
  return true;
};

var verificarAgregacoes = function(str) {
  var arr = str.split(/[,;](?=(?:(?:[^"]*"){2})*[^"]*$)/)

  if(arr[0].replace(/['"]/g,'').trim() != "Código de classificação da classe / série") return false;
  if(arr[1].replace(/['"]/g,'').trim() != "Número de referência") return false;
  if(arr[2].replace(/['"]/g,'').trim() != "Código da agregação simples / UI - unidade de instalação") return false;
  if(arr[3].replace(/['"]/g,'').trim() != "Título da agregação / UI") return false;
  if(arr[4].replace(/['"]/g,'').trim() != "Data de início de contagem do PCA") return false;
  if(arr[5].replace(/['"]/g,'').trim() != "Natureza da intervenção") return false;
  return true;
};

var validarCSVs = function (fileSerie, fileAgreg, tipo) {
  return new Promise(function (resolve, reject) {
    var enc = new TextDecoder("utf-8");
    var series = enc.decode(fileSerie).replace(/['"]/g,'').split("\n")
    if(!fileAgreg) var agregacoes = [];
    else var agregacoes = enc.decode(fileAgreg).replace(/['"]/g,'').split("\n")
    
    if(!verificarSerie(series[0]))
      reject({msg: "Verifique se inseriu o ficheiro de classe / série correto", numErros: 1})
    if(fileAgreg && !verificarAgregacoes(agregacoes[0]))
      reject({msg: "Verifique se inseriu o ficheiro de agregações / UI correto", numErros: 1})
    
    series.shift()
    agregacoes.shift()
    if(fileAgreg && (agregacoes.length==0 || agregacoes[0]=="")) {
      reject({msg: "Verificar se preencheu o ficheiro das agregações / unidades de instalação.", numErros: 1})
    }

    var errosSerie = {
      codigosRepetidos: [],
      referenciasRepetidas: [],
      codigo: [],
      referencia: [],
      titulo: [],
      dataInicio: [],
      dataInicioValidacao: [],
      dataInicioMenorAtual: [],
      dataFim: [],
      dataFimValidacao: [],
      agregacoes: [],
      medicoes: [],
      medicoesPapel: [],
      medicoesDigital: [],
      medicoesOutros: [],
      numeroErros: 0
    };
    var errosAgregacoes = {
      codigo: [],
      referencia: [],
      codigoAg: [],
      titulo: [],
      pca: [],
      ni: [],
      numeroErros: 0
    };
    var codigosSerie = [];
    var referenciasSerie = [];

    series.forEach((s,index) => {
      var serie = s.split(/[;,]/)
      if(serie.length>=7) {
        var currentTime = new Date()
        if(tipo === "TS_LC" && serie[0] == "") {errosSerie.codigo.push(index+2);errosSerie.numeroErros++;}
        if(serie[0] == "" && serie[1] == "") {errosSerie.referencia.push(index+2);errosSerie.numeroErros++;}
        if(serie[0]!="") 
          if(!codigosSerie.find(elem => elem == serie[0])) codigosSerie.push(serie[0]); 
          else {errosSerie.codigosRepetidos.push(index+2); errosSerie.numeroErros++; }
        if(serie[1]!="") if(!referenciasSerie.find(elem => elem == serie[1])) referenciasSerie.push(serie[1]); else {errosSerie.referenciasRepetidas.push(index+2); errosSerie.numeroErros++; }
        if(serie[2]=="") {errosSerie.titulo.push(index+2); errosSerie.numeroErros++;}
        var dataInicio = parseInt(serie[3]) || 0;
        var dataFim = parseInt(serie[4]) || 0;
        if(!serie[3].match(/[0-9]{4}/) || dataInicio<1000) {errosSerie.dataInicio.push(index+2); errosSerie.numeroErros++;}
        else if(!serie[4].match(/[0-9]{4}/) || dataFim<1000) {errosSerie.dataFim.push(index+2); errosSerie.numeroErros++;}
        //if(!serie[5].match(/[0-9]+/) || parseInt(serie[5])<1) {errosSerie.agregacoes.push(index+2); errosSerie.numeroErros++;}
        if(dataInicio < (currentTime.getFullYear() - 100)) {errosSerie.dataInicioMenorAtual.push(index+2); errosSerie.numeroErros++;}
        else if(dataInicio > dataFim) {errosSerie.dataFimValidacao.push(index+2); errosSerie.numeroErros++;}
        var uiPapel = parseFloat(serie[6].replace(/,/g, '.')) || 0;
        var uiDigital = parseFloat(serie[7].replace(/,/g, '.')) || 0;
        var uiOutros = parseFloat(serie[8].replace(/,/g, '.')) || 0;
        
        const reUI = /^-?\d*(,\d\d?)?$/;
        if(serie[6] && !reUI.test(serie[6])) {errosSerie.medicoesPapel.push(index+2); errosSerie.numeroErros++;}
        if(serie[7] && !reUI.test(serie[7])) {errosSerie.medicoesDigital.push(index+2); errosSerie.numeroErros++;}
        if(serie[8] && !reUI.test(serie[8])) {errosSerie.medicoesOutros.push(index+2); errosSerie.numeroErros++;}
        if(uiPapel+uiDigital+uiOutros<=0) {errosSerie.medicoes.push(index+2); errosSerie.numeroErros++;}
        var numero = 0;
        agregacoes.forEach((a, ind) => {
          var agregacao = a.split(/[;,]/);
          var codigo = [];
          if (agregacao[0] == serie[0] && agregacao[1] == serie[1]) {
            numero++;
            if (
              agregacao[2] != "" &&
              !codigo.find(elem => elem == agregacao[2])
            )
              codigo.push(agregacao[2]);
            else {
              errosAgregacoes.codigoAg.push(ind + 2);
              errosAgregacoes.numeroErros++;
            }
            if (agregacao[3] == "") {
              errosAgregacoes.titulo.push(index + 2);
              errosAgregacoes.numeroErros++;
            }
            var pca = parseInt(agregacao[4]) || 0;
            if (
              !agregacao[4].match(/[0-9]{4}/) ||
              pca < 1000 ||
              pca < dataInicio
            ) {
              errosAgregacoes.pca.push(ind + 2);
              errosAgregacoes.numeroErros++;
            }
            if (tipo == "PGD_LC" && agregacao[5] == "") {
              errosAgregacoes.ni.push(ind + 2);
              errosAgregacoes.numeroErros++;
            }
          }
        })
        //if(numero != serie[5]) {errosSerie.agregacoes.push(index+2); errosSerie.numeroErros++}
      } 
    })
    
    agregacoes.forEach((a,index) => {
      var agregacao = a.split(/[;,]/)
      if(agregacao.length>=5) {
        if(tipo == "TS_LC" && agregacao[0] == "") {errosAgregacoes.codigo.push(index+2);errosAgregacoes.numeroErros++;}
        else if(agregacao[0] == "" && agregacao[1] == "") {errosAgregacoes.referencia.push(index+2);errosAgregacoes.numeroErros++;}
      }
    });

    agregacoes.forEach((a, index) => {
      var agregacao = a.split(/[;,]/);
      if (agregacao.length >= 5) {
        if (tipo == "TS_LC" && agregacao[0] == "") {
          errosAgregacoes.codigo.push(index + 2);
          errosAgregacoes.numeroErros++;
        } else if (agregacao[0] == "" && agregacao[1] == "") {
          errosAgregacoes.referencia.push(index + 2);
          errosAgregacoes.numeroErros++;
        }
      }
    });

    if (errosSerie.numeroErros + errosAgregacoes.numeroErros > 0) {
      var errosVal = {
        erros: [],
        numErros: errosSerie.numeroErros + errosAgregacoes.numeroErros
      }
      if(errosSerie.codigosRepetidos.length>0) errosVal.erros.push({
        sobre: "Código da série / subsérie",
        mensagem: "O código não pode ser repetido no mesmo auto.",
        linhasSerie: errosSerie.codigosRepetidos
      })
      if(errosSerie.referenciasRepetidas.length>0) errosVal.erros.push({
        sobre: "Número de referência",
        mensagem: "O número de referência não pode ser repetido no mesmo auto.",
        linhasSerie: errosSerie.referenciasRepetidas
      })
      if(errosSerie.codigo.length>0 || errosAgregacoes.codigo.length>0) errosVal.erros.push({
        sobre: "Código da série ou subsérie",
        mensagem: "O código é obrigatório nas Tabelas de Seleção da Lista Consolidada.",
        linhasSerie: errosSerie.codigo,
        linhasUI: errosAgregacoes.codigo
      })
      if(errosSerie.referencia.length>0 || errosAgregacoes.referencia.length>0) errosVal.erros.push({
        sobre: "Número de referência",
        mensagem: "O número de referência é obrigatório quando não existe código.",
        linhasSerie: errosSerie.referencia,
        linhasUI: errosAgregacoes.referencia
      })
      if(errosSerie.titulo.length>0) errosVal.erros.push({
        sobre: "Título da série ou subsérie",
        mensagem: "O título é obrigatório.",
        linhasSerie: errosSerie.titulo
      })
      if(errosSerie.dataInicio.length>0) errosVal.erros.push({
        sobre: "Data inicial da documentação proposta para eliminação",
        mensagem: "A data inicial é obrigatória e deve constar de quatro digitos.",
        linhasSerie: errosSerie.dataInicio
      })
      if(errosSerie.dataInicioMenorAtual.length>0) errosVal.erros.push({
        sobre: "Data inicial da documentação proposta para eliminação",
        mensagem: "Data inicial com valor anterior a 100 anos.",
        linhasSerie: errosSerie.dataInicio
      })
      if(errosSerie.dataFim.length>0) errosVal.erros.push({
        sobre: "Data final da documentação proposta para eliminação",
        mensagem: "A data final é obrigatória e deve constar de quatro digitos.",
        linhasSerie: errosSerie.dataFim
      })
      if(errosSerie.dataFimValidacao.length>0) errosVal.erros.push({
        sobre: "Data final da documentação proposta para eliminação",
        mensagem: "A data final deve ser superior à data de inicio.",
        linhasSerie: errosSerie.dataFim
      })
      if(errosSerie.agregacoes.length>0) errosVal.erros.push({
        sobre: "Nº de agregações simples /UI – unidade de instalação",
        mensagem: "Verificar se corresponde ao total das agregações do ficheiro anexo.",
        linhasSerie: errosSerie.agregacoes
      })
      if(errosSerie.medicoes.length>0) errosVal.erros.push({
        sobre: "Medição das agregações",
        mensagem: "Pelo menos um dos campos deve estar preenchido.",
        linhasSerie: errosSerie.medicoes
      })
      if(errosSerie.medicoesPapel.length>0) errosVal.erros.push({
        sobre: "Medição papel das agregações",
        mensagem: "Verifique se o campo medição de UI papel se econtra devidamente preenchido",
        linhasSerie: errosSerie.medicoesPapel
      })
      if(errosSerie.medicoesDigital.length>0) errosVal.erros.push({
        sobre: "Medição digital das agregações",
        mensagem: "Verifique se o campo medição de UI digital se econtra devidamente preenchido",
        linhasSerie: errosSerie.medicoesDigital
      })
      if(errosSerie.medicoesOutros.length>0) errosVal.erros.push({
        sobre: "Medição noutro suporte das agregações",
        mensagem: "Verifique se o campo medição de UI noutro suporte se econtra devidamente preenchido",
        linhasSerie: errosSerie.medicoesOutros
      })
      if(errosAgregacoes.codigoAg.length>0) errosVal.erros.push({
        sobre: "Código da agregação simples / UI - unidade de instalação",
        mensagem: "Código da agregação obrigatório e não repetivel.",
        linhasUI: errosAgregacoes.codigoAg
      })
      if(errosAgregacoes.titulo.length>0) errosVal.erros.push({
        sobre: "Título da agregação / UI",
        mensagem: "Título da agregação obrigatório.",
        linhasUI: errosAgregacoes.titulo
      })
      if(errosAgregacoes.pca.length>0) errosVal.erros.push({
        sobre: "Data de início de contagem do PCA",
        mensagem: "Data de início de contagem do PCA da agregação obrigatória.",
        linhasUI: errosAgregacoes.pca
      })
      if(errosAgregacoes.ni.length>0) errosVal.erros.push({
        sobre: "Natureza de intervenção",
        mensagem: "O campo Natureza de intervenção é de preenchimento obrigatório.",
        linhasUI: errosAgregacoes.ni
      })
      
      reject(errosVal)
    }
    else resolve("Ficheiros em anexo validados com sucesso!")
  });
};

var csv2JsonAg = function(zonaControlo, fileAgreg, tipo) {
  return new Promise(function(resolve, reject) {
    var currentTime = new Date();
    var enc = new TextDecoder("utf-8");
    var agregacoes = enc.decode(fileAgreg).split("\n")
    agregacoes.shift()
    var addedAg = []

    zonaControlo.forEach((zc,index) => {  
      agregacoes.forEach(a => {
          a = a.replace(/[\r\n]+/g,'');
          var agregacao = a.split(/[,;](?=(?:(?:[^"]*"){2})*[^"]*$)/)
          var agCodigo = agregacao[0] || "";
          var agReferencia = agregacao[1] || "";
          var codigo = zc.codigo || "";
          var referencia = zc.referencia || "";
          if(agCodigo.replace(/['"]/g,'')==codigo && agReferencia.replace(/['"]/g,'')==referencia) {
            var ag = {
              codigo: agregacao[2].replace(/['"]/g,'').replace(/[ -.,!/]/g,"_"),
              titulo: agregacao[3].replace(/^\"|\"$/g,"").replace(/['"]/g,''),
              dataContagem: agregacao[4].replace(/['"]/g,''),
              ni: agregacao[5].replace(/['"]/g,'')
            }
            var val = true;
            var res = parseInt(zc.prazoConservacao) + parseInt(ag.dataContagem) + 1;
            var res2 = parseInt(ag.dataContagem) - parseInt(zc.dataInicio);
            
            if (res > currentTime.getFullYear()) val = false
            if (res2 < 0) val = false
            if((tipo=="PGD/LC" || tipo=="TS/LC") && (zc.destino == "C" || zc.destino=="Conservação") && ag.ni!="Participante") val = false
            
            if(val) {
              var pos = zc.agregacoes.map(a => {return a.codigo}).indexOf(ag.codigo)
              if(pos>=0)
                zc.agregacoes[pos] = ag;
              else 
                zc.agregacoes.unshift(ag)
              addedAg.push("Agregação <b>"+ag.codigo+" - "+ag.titulo+"</b> da classe / série <b>"+codigo+" "+referencia+"</b>");
            }
          }
        })
    })
    resolve({zonaControlo: zonaControlo, addedAg: addedAg})
  });
}

var csv2Json = function(fileSerie, fileAgreg, tipo) {
  return new Promise(function(resolve, reject) {
    var enc = new TextDecoder("utf-8");
    var series = enc.decode(fileSerie).split("\n")
    if(!fileAgreg) var agregacoes = []
    else var agregacoes = enc.decode(fileAgreg).split("\n")

    series.shift();
    agregacoes.shift();
    var auto = {
      tipo: tipo,
      zonaControlo: []
    };
    series.forEach((s,index) => {
      s = s.replace(/[\r\n]+/g,'');
      var serie = s.split(/[,;](?=(?:(?:[^"]*"){2})*[^"]*$)/)
      if(serie[0] || serie[1]) {
        var zc = {
          codigo: serie[0].replace(/['"]/g,''),
          referencia: serie[1].replace(/['"]/g,''),
          titulo: serie[2].replace(/['"]/g,''),
          dataInicio: serie[3].replace(/['"]/g,''),
          dataFim: serie[4].replace(/['"]/g,''),
          nrAgregacoes: serie[5].replace(/['"]/g,'') || 0,
          uiPapel: serie[6].replace(/['"]/g,''),
          uiDigital: serie[7].replace(/['"]/g,''),
          uiOutros: serie[8].replace(/['"]/g,''),
          dono: [],
          agregacoes: []
        };
        agregacoes.forEach(a => {
          a = a.replace(/[\r\n]+/g,'');
          var agregacao = a.split(/[,;](?=(?:(?:[^"]*"){2})*[^"]*$)/)
          var agCodigo = agregacao[0] || "";
          var agReferencia = agregacao[1] || "";
          if (
            agCodigo.replace(/['"]/g, "") == zc.codigo &&
            agReferencia.replace(/['"]/g, "") == zc.referencia
          ) {
            var ag = {
              codigo: agregacao[2]
                .replace(/[ -.,!/]/g, "_")
                .replace(/['"]/g, ""),
              titulo: agregacao[3].replace(/^\"|\"$/g, "").replace(/['"]/g, ""),
              dataContagem: agregacao[4].replace(/['"]/g, ""),
              ni: agregacao[5].replace(/['"]/g, "")
            };
            zc.agregacoes.push(ag);
          }
        });
        auto.zonaControlo.push(zc);
      } else return;
    });
    resolve({ auto: auto });
  });
};

export { csv2Json, validarCSVs, csv2JsonAg };
