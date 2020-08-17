var importarUIs = (file, uis_originais, classes_originais, re) => {
    return new Promise(async (resolve, reject) => {
        let enc = new TextDecoder("utf-8");
        let uis = enc
            .decode(file)
            .replace(/['"]/g, "")
            .split("\n");

        let erros = {
            codigo: [],
            uis: [],
            validade: []
        };

        let novas_uis = [];

        for (let i = 1; i < uis.length; i++) {
            let ui = uis[i].split(/ *; */).slice(0, 10);

            if (ui.length != 10) {
                erros = {
                    validade: [{ ui: 'Erro na análise', erro: 'Ficheiro inválido!' }]
                };
                break;
            }

            if (ui[0] != "" && !uis_originais.some(e => e.codigo == ui[0])) {
                let obj_ui = {
                    codigo: ui[0],
                    codCota: ui[2],
                    titulo: !!ui[1] ? ui[1] : adicionarErro(erros, ui[0], "Título"),
                    dataInicial: new Date(ui[4] + "-01-01") >= new Date(re.dataInicial)
                        ? ui[4] + "-01-01"
                        : adicionarErro(erros, ui[0], "Data Inicial"),
                    dataFinal: new Date(ui[5] + "-12-31") <= new Date(re.dataFinal) && new Date(ui[5] + "-12-31") >= new Date(ui[4] + "-01-01")
                        ? ui[5] + "-12-31"
                        : adicionarErro(erros, ui[0], "Data Final"),
                    produtor: produtoras(ui, erros, re),
                    classesAssociadas: preencherClassesAssociadas(ui, classes_originais, erros),
                    descricao: !!ui[3] ? ui[3] : adicionarErro(erros, ui[0], "Descrição"),
                    notas: ui[8],
                    localizacao: ui[9]
                }

                novas_uis.push(obj_ui);
            } else {
                erros.codigo.push({ ui: 'UI nº' + i, erro: "Código inválido!" });
            }

        }

        if (!!erros.validade[0] || !!erros.codigo[0] || !!erros.uis[0]) {
            reject({ erros })
        } else {
            await validarClassesAssociadas(novas_uis, classes_originais);

            resolve({ novas_uis });
        }
    });
};

function adicionarErro(erros, ui, erro) {
    erros.uis.push({ ui, erro });

    return null;
}

/* 
  Função para validar as associações entre UIs e classes
*/
function validarClassesAssociadas(novas_uis, classes_originais) {
    try {
        for (let i = 0; i < novas_uis.length; i++) {
            for (let j = 0; j < novas_uis[i].classesAssociadas.length; j++) {
                let classe = classes_originais.find(e => e.codigo == novas_uis[i].classesAssociadas[j].codigo && (e.tipo == "Série" || e.tipo == "Subsérie"))
                classe.UIs.push(novas_uis[i].codigo);
            }
        }
        return 0;
    } catch (err) {
        return err;
    }
}
/* 
  Função para preencher as classes associadads de um UI
*/
function preencherClassesAssociadas(ui, classes_originais, erros) {

    let classes_associadas = ui[7].split("#");
    let classes_associadas_validado = [];
    let setAuxRepetidos = new Set();
    let tem_duplicados = false;
    
    if (classes_associadas.length > 1) {
        for (let i = 0; i < classes_associadas.length; i++) {
            let classe = classes_originais.find(e => e.codigo == classes_associadas[i] && (e.tipo == "Série" || e.tipo == "Subsérie"))

            if (classe != undefined) {
                if (!tem_duplicados) {
                    tem_duplicados = setAuxRepetidos.size === setAuxRepetidos.add(classes_associadas[i]).size;
                }
                classes_associadas_validado.push({ codigo: classe.codigo, tipo: classe.tipo });
            } else {
                erros.uis.push({ ui: ui[0], erro: 'Classe associada é inválida, ' + classes_associadas[i] });
            }

        }

        if (tem_duplicados) {
            erros.uis.push({ ui: ui[0], erro: 'Possuí associações com a mesma classe mais que uma vez!' });
        }
    }


    return classes_associadas_validado;
}

/* 
  Função para validar as produtoras de uma UI
*/
function produtoras(ui, erros, re) {
    let entProdutoras = [];
    let tipologiasProdutoras = [];

    if (re.entidadesProd.length > 0) {
        let entidades = ui[6].split("#");

        for (let i = 0; i < entidades.length; i++) {
            let ent = re.entidadesProd.find(e => e.split(" - ")[0] == entidades[i]);

            if (ent != undefined) {
                entProdutoras.push(ent);
            } else {
                erros.uis.push({
                    ui: ui[0],
                    erro: "Entidade não é válida, " + entidades[i] + "!"
                });
            }
        }
    } else {
        if (re.tipologiasProd.split(" - ")[0] == classe[6]) {
            tipologiasProdutoras = [re.tipologiasProd];
        } else {
            erros.uis.push({ ui: ui[0], erro: "Tipologia produtora não é válida!" });
        }
    }

    return {
        entProdutoras,
        tipologiasProdutoras
    }
}

export { importarUIs };