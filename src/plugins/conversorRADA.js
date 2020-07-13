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
      let ent = entidades.find(e => e.designacao == entProd[1]);

      if (ent != undefined) {
        RE.entidadesProd = [ent.sigla + " - " + ent.designacao];
      } else {
        erros["produtoras"] = "Entidades associadas não existem no sistema!"
      }
    }
    if (erros.produtoras) {
      reject({ erros })
    }
    // DATAS
    RE["dataInicial"] = re[3].split(';').slice(0, 2)[1] + "-01-01";
    RE["dataFinal"] = re[4].split(';').slice(0, 2)[1] + "-12-31";

    // CAMPOS RESTANTES
    RE.hist_admin = re[6].split(';').slice(0, 2)[1];
    RE.hist_cust = re[7].split(';').slice(0, 2)[1];
    RE.sist_org = re[9].split(';').slice(0, 2)[1];
    RE.localizacao = re[11].split(';').slice(0, 2)[1];
    RE.est_conser = re[12].split(';').slice(0, 2)[1];

    resolve({ RE });

  })
}

export { importarRE };