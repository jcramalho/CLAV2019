var Excel = require("exceljs");
const nanoid = require("nanoid");

var importarRE = (file, entidades, tipologias, RE) => {
  return new Promise((resolve, reject) => {
    let enc = new TextDecoder("utf-8");
    let re = enc.decode(file).replace(/['"]/g, '').split("\n")
    //console.log(re);
    let erros = {}

    // Produtoras
    let entProd = re[1].split(';').slice(0, 2)

    // Verificar se existe entidades
    if (entProd[1] == "") {
      let tipProd = re[2].split(';').slice(0, 2)

      if (tipProd[1] != "") {
        let tip = tipologias.find(e => e.tipologia.split(' - ')[1] == tipProd[1]);

        if (tip != undefined) {
          RE.tipologiasProd = tip.tipologia;
        } else {
          erros["produtoras"] = "Tipologia associada não existe no sistema!"
        }
      }

    } else {
      let ents = entProd[1].split('#')

      for (let h = 0; h < ents.length; h++) {
        let ent = entidades.find(e => e.designacao == ents[h]);

        if (ent != undefined) {
          RE.entidadesProd.push(ent.sigla + " - " + ent.designacao);
        } else {
          erros["produtoras"] = "Entidades associadas não existem no sistema!"
        }
      }
    }
    if (erros.produtoras) {
      reject({ erros })
    }
    // DATAS
    let di = new Number(re[3].split(';').slice(0, 2)[1]);
    RE["dataInicial"] = di > 0 ? di + "-01-01" : null;

    let df = new Number(re[4].split(';').slice(0, 2)[1]);
    RE["dataFinal"] = df > 0 ? df + "-12-31" : null;

    // CAMPOS RESTANTES
    RE.hist_admin = re[6].split(';').slice(0, 2)[1];
    RE.hist_cust = re[7].split(';').slice(0, 2)[1];
    RE.sist_org = re[9].split(';').slice(0, 2)[1];
    RE.localizacao = re[11].split(';').slice(0, 2)[1];
    RE.est_conser = re[12].split(';').slice(0, 2)[1];

    resolve({ RE });

  })
}

var validarClasses = (file, classes_originais, re, legislacao) => {
  return new Promise((resolve, reject) => {
    console.log(re);
    let enc = new TextDecoder("utf-8");
    let ts = enc.decode(file).replace(/['"]/g, '').split("\n")
    let ts_length = ts.length;

    let novas_classes = [];

    let erros = {
      sem_codigo: [],
      erros_area: [],
      codigo: [],
      tipo: [],
      series: [],
      area: [],
      subseries: []
    };

    let pais = [];
    let pai = null;
    let n = 1;


    for (let i = 1; i < ts_length; i++) {
      let classe = ts[i].split(/ *; */).slice(0, 22);

      classe[2] = Number(classe[2]);

      // Descobrir PAI
      if (classe[2] == 1) {

        pais = [classe[0]];
        n = classe[2];
        pai = null;

      } else if (classe[2] > n) {

        pai = pais[pais.length - 1];
        pais.push(classe[0]);
        n = classe[2];

      } else if (n == classe[2]) {

        pais.pop();
        pai = pais[pais.length - 1];
        pais.push(classe[0])
        n = classe[2];

      } else {
        let nPops = (n - classe[2]) + 1;

        for (let j = 0; j < nPops; j++)
          pais.pop();

        pai = pais[pais.length - 1];
        pais.push(classe[0])
        n = classe[2];
      }

      // Validar e criar cada classe
      if (classe[0] != "") {
        switch (classe[2]) {
          case 1: case 2: case 3:
            console.log("tipo", classe[2])
            validarArea(classe, pai, erros, novas_classes);
            break;
          case 4:
            console.log("tipo", classe[2])
            validarSerie(classe, pai, erros, novas_classes, re, legislacao);
            break;
          case 5:
            console.log("tipo", classe[2])
            validarSubserie(classe, pai, erros, novas_classes);
            break;
          default:
            erros.tipo.push(classe[0]);
            break;
        }
      } else {
        erros.sem_codigo.push(i);
      }


    }
    resolve({ novas_classes, erros })
  })
}
// var validarClasses = (file, classes_originais) => {
//   return new Promise((resolve, reject) => {
//     let enc = new TextDecoder("utf-8");
//     let ts = enc.decode(file).replace(/['"]/g, '').split("\n")
//     let ts_length = ts.length;

//     let erros = {
//       sem_codigo: [],
//       erros_area: [],
//       codigo: [],
//       tipo: []
//     };

//     // Validar se existem códigos repetidos;
//     for (let i = 1; i < ts_length; i++) {
//       ts[i] = ts[i].split(';').slice(0, 23);

//       let classe = ts[i];

//       if (classe[0] != "") {
//         if (classes_originais.some(e => e.codigo == classe[0])) {
//           erros.codigo.push(classe[0]);
//         }
//       } else {
//         erros.sem_codigo.push(i);
//       }
//     }

//     if (!!erros.sem_codigo[0] || !!erros.codigo[0]) {
//       reject({ erros })
//     } else {
//       for (let i = 1; i < ts_length; i++) {
//         switch (ts[i][2]) {
//           case '1' || '2' || '3':
//             validarArea(ts[i], erros, classes_originais, ts);
//             break;
//           case '4':
//             validarSerie(ts[i], erros, classes_originais, ts);
//             break;
//           case '5':
//             validarSubserie(ts[i], erros, classes_originais, ts);
//             break;
//           default:
//             erros.tipo.push(ts[i][0]);
//             break;
//         }
//       }
//       resolve({ erros })
//     }
//   })
// }

function validarArea(classe, pai, erros, novas_classes) {
  let area = {
    codigo: classe[0],
    titulo: !!classe[1] ? classe[1] : adicionarErro(erros, "area", classe[0], "Título"),
    descricao: !!classe[3] ? classe[3] : adicionarErro(erros, "area", classe[3], "Descrição"),
    eFilhoDe: pai,
    tipo: "N" + classe[2]
  }
  novas_classes.push(area);
}

function validarSerie(classe, pai, erros, novas_classes, re, legislacao) {
  let serie = {
    codigo: classe[0],
    titulo: !!classe[1] ? classe[1] : adicionarErro(erros, "series", classe[0], "Título"),
    descricao: !!classe[3] ? classe[3] : adicionarErro(erros, "series", classe[0], "Descrição"),
    dataInicial: new Number(classe[4]) > 0 ? classe[4] + "-01-01" : adicionarErro(erros, "series", classe[0], "Data Inicial"),
    dataFinal: new Number(classe[5]) > 0 ? classe[5] + "-12-31" : adicionarErro(erros, "series", classe[0], "Data Final"),
    tUA: ["Processo", "Coleção", "Dossier", "Registo"].includes(classe[6]) ? classe[6] : adicionarErro(erros, "series", classe[0], "Tipo de Unidade Arquivistica"),
    tSerie: classe[7] == "Fechada" || classe[7] == "Aberta" ? classe[7] : adicionarErro(erros, "series", classe[0], "Tipo de Série"),
    suporte_e_medicao: suporte_e_medicao(classe, erros),
    UIs: [],
    localizacao: !!classe[10] ? [classe[10]] : adicionarErro(erros, "series", classe[0], "Localização"),
    legislacao: validarLegislacao(classe, legislacao, erros),
    relacoes: [],
    pca: !!classe[15] ? classe[15] : null,
    notaPCA: !!classe[16] ? classe[16] : null,
    notaDF: !!classe[20] ? classe[20] : null,
    formaContagem: {
      forma: null
    },
    justificacaoPCA: [],
    df: null,
    justificacaoDF: [],
    eFilhoDe: pai,
    tipo: "Série"
  }

  produtoras(serie, classe, erros, re);
  novas_classes.push(serie);
  console.log(serie)
}



function validarSubserie(classe, pai, erros, novas_classes) {
  let subserie = {
    codigo: classe[0],
    titulo: classe[1],
    descricao: classe[3],
    dataInicial: classe[4],
    dataFinal: classe[5],
    UIs: [],
    relacoes: [],
    pca: null,
    notaPCA: null,
    notaDF: null,
    formaContagem: {
      forma: null
    },
    justificacaoPCA: [],
    df: null,
    justificacaoDF: [],
    eFilhoDe: pai,
    tipo: "Subsérie"
  }
  //novas_classes.push(subserie);
  console.log(subserie)
}

/* 
  Função para validar as legislações de uma série
*/
function validarLegislacao(classe, legislacao, erros) {

  let novas_l = [];
  let legis = classe[12].split('#')

  for (let i = 0; i < legis.length; i++) {
    let l = legislacao.find(e => e.legislacao.split(' - ')[0] == legis[i]);

    if (l != undefined) {
      novas_l.push(l);
    } else {
      erros.series.push({ classe: classe[0], erro: "Legislação não existe, " + legis[i] + "." })
    }
  }

  return novas_l;
}

/* 
  Função para validar as produtoras de uma série
*/
function produtoras(serie, classe, erros, re) {
  let entProdutoras = [];
  let tipologiasProdutoras = [];

  if (re.entidadesProd.length > 0) {

    let entidades = classe[11].split('#');

    for (let i = 0; i < entidades.length; i++) {

      let ent = re.entidadesProd.find(e => e.split(' - ')[0] == entidades[i]);

      if (ent != undefined) {
        entProdutoras.push(ent);
      } else {
        erros.series.push({ classe: classe[0], erro: 'Entidade não é válida, ' + entidades[i] + '!' })
      }
    }
  } else {
    if (re.tipologiasProd.split(' - ')[0] == classe[11]) {
      tipologiasProdutoras = [re.tipologiasProd];
    } else {
      erros.series.push({ classe: classe[0], erro: 'Tipologia não é válida!' })
    }
  }

  serie["entProdutoras"] = entProdutoras;
  serie["tipologiasProdutoras"] = tipologiasProdutoras;
}

/* 
Função para calcular o suporte e medição
*/
function suporte_e_medicao(classe, erros) {
  let suporte_e_medicao = [];

  let suporte_partido = classe[8].split('#');
  let medicao_partido = classe[9].split('#');

  if (suporte_partido.length == medicao_partido.length) {

    for (let i = 0; i < suporte_partido.length; i++) {
      if (["Eletrónico Digitalizado", "Eletrónico Nativo", "Papel", "Outro"].includes(suporte_partido[i]) && new Number(medicao_partido[i]) > 0) {
        suporte_e_medicao.push({ suporte: suporte_partido[i], medicao: medicao_partido[i] })
      }
    }

    if (suporte_e_medicao.length == 0) {
      suporte_e_medicao.push({ suporte: null, medicao: null })
    }

  } else {
    erros["serie"].push({ classe: classe[0], erro: "Suporte e Medição" })
  }
  return suporte_e_medicao;
}

/* 
Função para adicionar erros
*/
function adicionarErro(erros, tipo, classe, erro) {
  erros[tipo].push({ classe, erro });

  return null;
}

export { importarRE, validarClasses };