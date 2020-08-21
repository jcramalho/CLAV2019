const Papa = require("papaparse");

const papa_config = {
    delimitersToGuess: [',', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
    skipEmptyLines: true
}

var importarRE = (file, entidades, tipologias, RE) => {
    return new Promise((resolve, reject) => {

        let parsedFile = Papa.parse(file, papa_config);

        let re = parsedFile.data;

        // limpar espaços que possam vir nos campos
        for (let i = 0; i < re.length; i++) {
            re[i] = re[i].map(s => { return s.trim() });
        }

        let erros = {
            produtoras: null
        };

        // Produtoras
        // Verificar se não existem entidades produtoras
        if (re[1][1] == "") {

            let tip = tipologias.find(
                e => e.tipologia.split(" - ")[1] == re[2][1]
            );

            if (tip != undefined) {
                RE.tipologiasProd = tip.tipologia;
            } else {
                erros.produtoras = "Tipologia associada não existe no sistema!";
            }
        } else {
            // se existir entidades validars
            let ents = re[1][1].split("#");

            RE.entidadesProd = [];
            for (let i = 0; i < ents.length; i++) {
                let ent = entidades.find(e => e.designacao == ents[i]);

                if (ent != undefined) {
                    RE.entidadesProd.push(ent.sigla + " - " + ent.designacao);
                } else {
                    erros.produtoras = "Entidades associadas não existem no sistema!";
                }
            }
        }

        if (erros.produtoras) {
            reject({ erros });
        }

        // DATAS
        let di = new Number(re[3][1]);
        RE["dataInicial"] = di > 0 ? di + "-01-01" : null;

        let df = new Number(re[4][1]);
        RE["dataFinal"] = df >= di ? df + "-12-31" : null;

        // CAMPOS RESTANTES
        RE.hist_admin = re[6][1];
        RE.hist_cust = re[7][1];
        RE.sist_org = re[9][1];
        RE.localizacao = re[11][1];
        RE.est_conser = re[12][1];

        resolve({ RE });

    });
};

export { importarRE };