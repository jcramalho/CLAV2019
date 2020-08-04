var importarRE = (file, entidades, tipologias, RE) => {
    return new Promise((resolve, reject) => {
        let enc = new TextDecoder("utf-8");
        let re = enc
            .decode(file)
            .replace(/['"]/g, "")
            .split("\n");
        //console.log(re);
        let erros = {};

        // Produtoras
        let entProd = re[1].split(";").slice(0, 2);

        // Verificar se existe entidades
        if (entProd[1] == "") {
            let tipProd = re[2].split(";").slice(0, 2);

            if (tipProd[1] != "") {
                let tip = tipologias.find(
                    e => e.tipologia.split(" - ")[1] == tipProd[1]
                );

                if (tip != undefined) {
                    RE.tipologiasProd = tip.tipologia;
                } else {
                    erros["produtoras"] = "Tipologia associada não existe no sistema!";
                }
            }
        } else {
            let ents = entProd[1].split("#");

            RE.entidadesProd = [];
            for (let h = 0; h < ents.length; h++) {
                let ent = entidades.find(e => e.designacao == ents[h]);

                if (ent != undefined) {
                    RE.entidadesProd.push(ent.sigla + " - " + ent.designacao);
                } else {
                    erros["produtoras"] = "Entidades associadas não existem no sistema!";
                }
            }
        }
        if (erros.produtoras) {
            reject({ erros });
        }
        // DATAS
        let di = new Number(re[3].split(";").slice(0, 2)[1]);
        RE["dataInicial"] = di > 0 ? di + "-01-01" : null;

        let df = new Number(re[4].split(";").slice(0, 2)[1]);
        RE["dataFinal"] = df >= di ? df + "-12-31" : null;

        // CAMPOS RESTANTES
        RE.hist_admin = re[6].split(";").slice(0, 2)[1];
        RE.hist_cust = re[7].split(";").slice(0, 2)[1];
        RE.sist_org = re[9].split(";").slice(0, 2)[1];
        RE.localizacao = re[11].split(";").slice(0, 2)[1];
        RE.est_conser = re[12].split(";").slice(0, 2)[1];

        resolve({ RE });
    });
};

export { importarRE };