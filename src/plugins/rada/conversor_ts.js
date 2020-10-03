const Papa = require("papaparse");

const papa_config = {
    delimitersToGuess: [',', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
    skipEmptyLines: true
}

var validarClasses = (
    file,
    classes_originais,
    re,
    legislacao,
    formaContagem
) => {
    return new Promise(async (resolve, reject) => {
        let parsedFile = Papa.parse(file, papa_config);

        let ts = parsedFile.data;
        let ts_length = ts.length;

        // console.log(ts)
        // Inicializar variáveis
        let novas_classes = [];

        let erros = {
            codigo: [],
            tipo: [],
            series: [],
            area: [],
            subseries: [],
            relacoes: [],
            validade: []
        };

        let pais = [];
        let pai = null;
        let n = 1;

        for (let i = 1; i < ts_length; i++) {
            if (ts[i].length != 23) {
                erros = {
                    validade: [{ classe: 'Erro na análise', erro: 'Ficheiro inválido!' }]
                };
                break;
            }

            // Limpar os espaços nas extremidades dos campos
            ts[i] = ts[i].map(s => { return s.trim() });

            ts[i][2] = Number(ts[i][2]);

            // Descobrir PAI
            if (ts[i][2] == 1) {
                pais = [ts[i][0]];
                n = ts[i][2];
                pai = null;
            } else if (ts[i][2] > n) {
                pai = pais[pais.length - 1];
                pais.push(ts[i][0]);
                n = ts[i][2];
            } else if (n == ts[i][2]) {
                pais.pop();
                pai = pais[pais.length - 1];
                pais.push(ts[i][0]);
                n = ts[i][2];
            } else {
                let nPops = n - ts[i][2] + 1;

                for (let j = 0; j < nPops; j++) pais.pop();

                pai = pais[pais.length - 1];
                pais.push(ts[i][0]);
                n = ts[i][2];
            }

            // Validar e criar cada classe
            if (ts[i][0] != "" && !classes_originais.some(e => e.codigo == ts[i][0])) {
                switch (ts[i][2]) {
                    case 1:
                    case 2:
                    case 3:
                        validarArea(ts[i], pai, erros, novas_classes);
                        break;
                    case 4:
                        validarSerie(
                            ts[i],
                            pai,
                            erros,
                            novas_classes,
                            re,
                            legislacao,
                            formaContagem
                        );
                        break;
                    case 5:
                        validarSubserie(ts[i], pai, erros, re, novas_classes, formaContagem);
                        break;
                    default:
                        erros.tipo.push({ classe: ts[i][0], erro: 'Nível inválido!' });
                        break;
                }
            } else {
                erros.codigo.push({ classe: 'Classe nº' + i, erro: 'Código inválido!' });
            }


        }

        if (
            !!erros.validade[0] ||
            !!erros.codigo[0] ||
            !!erros.tipo[0] ||
            !!erros.series[0] ||
            !!erros.area[0] ||
            !!erros.subseries[0]
        ) {
            reject({ erros });
        } else {
            await validarRelacoes(novas_classes, erros);

            // Limpar critérios que possam estar a mais;
            for (let i = 0; i < novas_classes.length; i++) {
                if (novas_classes[i].tipo == "Série" || novas_classes[i].tipo == "Subsérie") {
                    novas_classes[i].justificacaoPCA = novas_classes[i].justificacaoPCA.filter(e => !!e.relacoes ? e.relacoes.length > 0 : true);
                    novas_classes[i].justificacaoDF = novas_classes[i].justificacaoDF.filter(e => e.relacoes.length > 0);
                }
            }

            if (!!erros.relacoes[0]) {
                reject({ erros });
            } else {
                resolve({ novas_classes });
            }

        }
    });
};

function validarArea(classe, pai, erros, novas_classes) {
    let area = {
        codigo: classe[0],
        titulo: !!classe[1]
            ? classe[1]
            : adicionarErro(erros, "area", classe[0], "Título"),
        descricao: !!classe[3]
            ? classe[3]
            : adicionarErro(erros, "area", classe[3], "Descrição"),
        eFilhoDe: pai,
        tipo: "N" + classe[2]
    };
    novas_classes.push(area);
}

function validarSerie(
    classe,
    pai,
    erros,
    novas_classes,
    re,
    legislacao,
    formaContagem
) {
    let serie = {
        codigo: classe[0],
        titulo: !!classe[1]
            ? classe[1]
            : adicionarErro(erros, "series", classe[0], "Título"),
        descricao: !!classe[3]
            ? classe[3]
            : adicionarErro(erros, "series", classe[0], "Descrição"),
        dataInicial:
            new Date(classe[4] + "-01-01") >= new Date(re.dataInicial)
                ? classe[4] + "-01-01"
                : adicionarErro(erros, "series", classe[0], "Data Inicial"),
        dataFinal:
            new Date(classe[5] + "-12-31") <= new Date(re.dataFinal) && new Date(classe[5] + "-12-31") >= new Date(classe[4] + "-01-01")
                ? classe[5] + "-12-31"
                : adicionarErro(erros, "series", classe[0], "Data Final"),
        tUA: ["Processo", "Coleção", "Dossier", "Registo"].includes(classe[6])
            ? classe[6]
            : adicionarErro(
                erros,
                "series",
                classe[0],
                "Tipo de Unidade Arquivistica"
            ),
        tSerie:
            classe[7] == "Fechada" || classe[7] == "Aberta"
                ? classe[7]
                : adicionarErro(erros, "series", classe[0], "Tipo de Série"),
        suporte_e_medicao: suporte_e_medicao(classe, erros),
        UIs: [],
        localizacao: !!classe[10]
            ? [classe[10]]
            : adicionarErro(erros, "series", classe[0], "Localização"),
        legislacao: validarLegislacao(classe, legislacao, erros),
        relacoes: preencherRelacoes(classe, erros, "series"),
        pca: !!classe[15] ? classe[15] : null,
        notaPCA: !!classe[16] ? classe[16] : null,
        notaDF: !!classe[21] ? classe[21] : null,
        formaContagem: preencherFormaContagem(
            classe,
            formaContagem,
            erros,
            "series"
        ),
        justificacaoPCA: preencherJustPCA(classe, erros, "series"),
        df: validarDF(classe, erros, "series"),
        justificacaoDF: preencherJustDF(classe, erros, "series"),
        eFilhoDe: pai,
        tipo: "Série"
    };

    produtoras(serie, classe, erros, re);

    novas_classes.push(serie);
}

function validarSubserie(classe, pai, erros, re, novas_classes, formaContagem) {
    let subserie = {
        codigo: classe[0],
        titulo: !!classe[1]
            ? classe[1]
            : adicionarErro(erros, "subseries", classe[0], "Título"),
        descricao: !!classe[3]
            ? classe[3]
            : adicionarErro(erros, "subseries", classe[0], "Descrição"),
        dataInicial:
            new Date(classe[4] + "-01-01") >= new Date(re.dataInicial)
                ? classe[4] + "-01-01"
                : adicionarErro(erros, "subseries", classe[0], "Data Inicial"),
        dataFinal:
            new Date(classe[5] + "-12-31") <= new Date(re.dataFinal) && new Date(classe[5] + "-12-31") >= new Date(classe[4] + "-01-01")
                ? classe[5] + "-12-31"
                : adicionarErro(erros, "subseries", classe[0], "Data Final"),
        UIs: [],
        relacoes: preencherRelacoes(classe, erros, "subseries"),
        pca: !!classe[15] ? classe[15] : null,
        notaPCA: !!classe[16] ? classe[16] : null,
        notaDF: !!classe[21] ? classe[21] : null,
        formaContagem: preencherFormaContagem(
            classe,
            formaContagem,
            erros,
            "subseries"
        ),
        justificacaoPCA: preencherJustPCA(classe, erros, "subseries"),
        df: validarDF(classe, erros, "subseries"),
        justificacaoDF: preencherJustDF(classe, erros, "subseries"),
        eFilhoDe: pai,
        tipo: "Subsérie"
    };
    novas_classes.push(subserie);
}

/* 
  Função para validar as relações e completar os critérios;
*/
async function validarRelacoes(novas_classes, erros) {

    let series_subseries = novas_classes.filter(e => e.tipo == "Subsérie" || e.tipo == "Série");

    let setAuxRepetidos = new Set();
    let setAuxSintese = new Set();

    for (let i = 0; i < series_subseries.length; i++) {

        let tem_duplicados = false;
        let tem_sintese_sintetizado = false;

        setAuxRepetidos.clear();
        setAuxSintese.clear();

        // Validar critérios legais
        let l = await validaCriteriosLegais(series_subseries[i], series_subseries);

        if (l != 0) {
            erros.relacoes.push({
                classe: series_subseries[i].codigo,
                erro: l
            });
        }

        for (let j = 0; j < series_subseries[i].relacoes.length; j++) {
            if (!tem_duplicados) {
                tem_duplicados = setAuxRepetidos.size === setAuxRepetidos.add(series_subseries[i].relacoes[j].serieRelacionada.codigo).size;
            }

            if (!tem_sintese_sintetizado && (series_subseries[i].relacoes[j].relacao == "Síntese de" || series_subseries[i].relacoes[j].relacao == "Sintetizado por")) {
                tem_sintese_sintetizado = setAuxSintese.size === setAuxSintese.add(series_subseries[i].relacoes[j].relacao).size;
            }

            // Se já tiver o tipo é porque a relação inversa já foi validada;
            if (series_subseries[i].relacoes[j].serieRelacionada.tipo == undefined) {
                let classe_relacionada = series_subseries.find(e => e.codigo == series_subseries[i].relacoes[j].serieRelacionada.codigo &&
                    (e.tipo == "Série" || e.tipo == "Subsérie"));


                if (classe_relacionada != undefined) {
                    await validarRelacaoInversa(classe_relacionada, series_subseries[i].relacoes[j], series_subseries[i])
                        .catch(err => {
                            erros.relacoes.push({
                                classe: series_subseries[i].codigo,
                                erro: err
                            });
                        })
                } else {
                    erros.relacoes.push({
                        classe: series_subseries[i].codigo,
                        erro: "Classe relacionada é inválida!"
                    });
                }
            }
        }

        if (tem_duplicados) {
            erros.relacoes.push({
                classe: series_subseries[i].codigo,
                erro: "Possuí relações para a mesma classe mais que uma vez!"
            });
        }

        if (tem_sintese_sintetizado) {
            erros.relacoes.push({
                classe: series_subseries[i].codigo,
                erro: "Possuí relações \"Síntese De\" e \"Sintetizado Por\"!"
            });
        }
    }
}

/* 
  Função para validar a relacao inversa
*/
function validarRelacaoInversa(classe_relacionada, relacao, classe) {
    return new Promise(async (resolve, reject) => {

        let relacao_inversa = null;
        switch (relacao.relacao) {
            case "Antecessora de":
                relacao_inversa = "Sucessora de";
                break;
            case "Sucessora de":
                relacao_inversa = "Antecessora de";
                break;
            case "Cruzado de":
                relacao_inversa = "Cruzado de";
                break;
            case "Complementar de":
                relacao_inversa = "Complementar de";
                break;
            case "Sintetizado por":
                relacao_inversa = "Síntese de";
                break;
            case "Síntese de":
                relacao_inversa = "Sintetizado por";
                break;
            case "Suplemento de":
                relacao_inversa = "Suplemento para";
                break;
            case "Suplemento para":
                relacao_inversa = "Suplemento de";
                break;
        }

        let real_relacao_inversa = classe_relacionada.relacoes.find(e => e.relacao == relacao_inversa && e.serieRelacionada.codigo == classe.codigo);

        if (real_relacao_inversa != undefined) {
            real_relacao_inversa.serieRelacionada["tipo"] = classe.tipo;
            relacao.serieRelacionada["tipo"] = classe_relacionada.tipo;

            let r = await validaCriteriosDiversos(classe, classe_relacionada, relacao.relacao, relacao.serieRelacionada.codigo);

            if (r != 0) {
                reject(r);
            }
            resolve();

        } else {
            reject('Relação inversa de \"' + relacao.relacao + '\" não existente!')
        }
    })

}


/* 
  Função para validar os criterios legais
*/
async function validaCriteriosLegais(classe, classes) {
    try {
        // Validar critérios legais
        let criterio_legal_df = classe.justificacaoDF.find(e => e.tipo == "Critério Legal");
        let criterio_legal_pca = classe.justificacaoPCA.find(e => e.tipo == "Critério Legal");

        let legislacao = classe.legislacao;

        if (classe.tipo == "Subsérie") {
            let classe_pai = classes.find(e => e.codigo == classe.eFilhoDe);
            legislacao = classe_pai.legislacao;
        }

        // Critério Legal do DF
        if (criterio_legal_df != undefined) {
            for (let i = 0; i < criterio_legal_df.relacoes.length; i++) {
                if (!legislacao.some(e => e.legislacao.split(' - ')[0] == criterio_legal_df.relacoes[i])) {
                    return 'Critério legal do DF inválido!'
                }
            }
        }
        // Critério Legal do PCA
        if (criterio_legal_pca != undefined) {
            for (let j = 0; j < criterio_legal_pca.relacoes.length; j++) {
                if (!legislacao.some(e => e.legislacao.split(' - ')[0] == criterio_legal_pca.relacoes[j])) {
                    return 'Critério legal do PCA inválido!'
                }
            }
        }

        return 0;

    } catch (err) {
        return err;
    }
}

/* 
  Função para validar os criterios menos o legal
*/
async function validaCriteriosDiversos(classe, classe_relacionada, relacao, codigo) {
    try {
        let relacao_inversa = null;
        let criterio = null;
        let criterioInverso = null;

        switch (relacao) {
            case "Complementar de":
                relacao_inversa = "Complementar de";
                criterio = classe.justificacaoDF.find(e => e.tipo == "Critério de Complementaridade Informacional");
                criterioInverso = classe_relacionada.justificacaoDF.find(e => e.tipo == "Critério de Complementaridade Informacional");
                break;
            case "Sintetizado por":
                relacao_inversa = "Síntese de";
                criterio = classe.justificacaoDF.find(e => e.tipo == "Critério de Densidade Informacional");
                criterioInverso = classe_relacionada.justificacaoDF.find(e => e.tipo == "Critério de Densidade Informacional");
                break;
            case "Síntese de":
                relacao_inversa = "Sintetizado por";
                criterio = classe.justificacaoDF.find(e => e.tipo == "Critério de Densidade Informacional");
                criterioInverso = classe_relacionada.justificacaoDF.find(e => e.tipo == "Critério de Densidade Informacional");
                break;
            case "Suplemento para":
                relacao_inversa = "Suplemento de";
                criterio = classe.justificacaoPCA.find(e => e.tipo == "Critério de Utilidade Administrativa");
                criterioInverso = undefined;
                break;
            case "Suplemento de":
                relacao_inversa = "Suplemento para";
                criterio = undefined;
                criterioInverso = classe_relacionada.justificacaoPCA.find(e => e.tipo == "Critério de Utilidade Administrativa");
                break;
            default:
                return 0;
        }

        if (criterio != undefined) {
            criterio.relacoes.push({ codigo });
        } else {
            return "Erro nos critérios de justificação do " + (relacao == "Suplemento para" ? "PCA" : "DF");
        }

        if (criterioInverso != undefined) {
            criterioInverso.relacoes.push({ codigo: classe.codigo })
        } else {
            return "Erro nos critérios de justificação do " + (relacao == "Suplemento para" ? "PCA" : "DF") + " da classe relacionada " + classe_relacionada.codigo;
        }

        return 0;

    } catch (err) {
        return err;
    }
}

/* 
  Função para preencher a forma de contagem
*/
function preencherFormaContagem(classe, formaContagem, erros, tipo) {
    let forma_serie = {
        forma: null
    };

    let f = formaContagem.formasContagem.find(e => e.label.toLowerCase() == classe[17].toLowerCase());

    if (f != undefined) {
        forma_serie.forma = f.value;

        if (f.label == "Conforme disposição legal") {

            if (classe[18] != "") {
                forma_serie["subforma"] = classe[18];
            } else {
                erros[tipo].push({
                    classe: classe[0],
                    erro: "Erro na subforma de contagem do PCA!"
                });
            }
        }
    } else {
        erros[tipo].push({
            classe: classe[0],
            erro: "Erro na forma de contagem do PCA!"
        });
    }

    return forma_serie;
}

/* 
  Função para preencher a just do PCA de uma série
*/
function preencherJustPCA(classe, erros, tipo) {
    let criterios = classe[19].split("#").filter(e => e != "");

    let justificacaoPCA = [];

    for (let i = 0; i < criterios.length; i++) {
        if (criterios[i].includes("Critério gestionário")) {
            justificacaoPCA.push({
                tipo: "Critério Gestionário",
                nota: criterios[i].split("Critério gestionário:")[1]
            });
        } else {
            if (criterios[i].includes("Critério de utilidade administrativa")) {
                justificacaoPCA.push({
                    tipo: "Critério de Utilidade Administrativa",
                    nota: criterios[i].split("Critério de utilidade administrativa:")[1],
                    relacoes: []
                });
            } else {
                if (criterios[i].includes("Critério legal")) {
                    justificacaoPCA.push({
                        tipo: "Critério Legal",
                        nota: "Prazo prescricional estabelecido em: ",
                        relacoes: criterios[i].split("Critério legal:")[1].split(/, */),
                    });
                } else {
                    erros[tipo].push({
                        classe: classe[0],
                        erro: "Justificação PCA! Critério Inválido!"
                    });
                }
            }
        }
    }
    return justificacaoPCA;
}

/* 
  Função para preencher a just do DF de uma série
*/
function preencherJustDF(classe, erros, tipo) {
    let criterios = classe[22].split("#").filter(e => e != "");

    let justificacaoDF = [];

    for (let i = 0; i < criterios.length; i++) {
        if (criterios[i].includes("Critério de complementaridade informacional")) {
            justificacaoDF.push({
                tipo: "Critério de Complementaridade Informacional",
                nota: criterios[i].split(
                    "Critério de complementaridade informacional:"
                )[1],
                relacoes: []
            });
        } else {
            if (criterios[i].includes("Critério de densidade informacional")) {
                justificacaoDF.push({
                    tipo: "Critério de Densidade Informacional",
                    nota: criterios[i].split("Critério de densidade informacional:")[1],
                    relacoes: []
                });
            } else {
                if (criterios[i].includes("Critério legal")) {
                    justificacaoDF.push({
                        tipo: "Critério Legal",
                        nota: "Prazo prescricional estabelecido em: ",
                        relacoes: criterios[i].split("Critério legal:")[1].split(/, */),
                    });
                } else {
                    erros[tipo].push({
                        classe: classe[0],
                        erro: "Justificação DF! Critério Inválido!"
                    });
                }
            }
        }
    }
    return justificacaoDF;
}

/* 
  Função para validar o DF de uma série
*/
function validarDF(classe, erros, tipo) {
    let df = null;

    switch (classe[20].toLowerCase()) {
        case "conservação":
            df = "Conservação";
            break;
        case "eliminação":
            df = "Eliminação";
            break;
        case "conservação parcial":
            df = "Conservação Parcial";
            break;
        default:
            erros[tipo].push({ classe: classe[0], erro: "Destino final inválido!" });
    }

    return df;
}

/* 
  Função para preencher as relações de uma série
*/
function preencherRelacoes(classe, erros, tipo) {
    let classesRelacionadas = classe[13].replace(/\r\n/g, "").split("#").filter(e => e != "");
    let classesRelacao = classe[14].replace(/\r\n/g, "").split("#").filter(e => e != "");

    let relacoes = [];

    if (classesRelacionadas.length == classesRelacao.length) {
        for (let i = 0; i < classesRelacionadas.length; i++) {
            if (classesRelacionadas[i] != classe[0]) {
                switch (classesRelacao[i]) {
                    case "Antecessora de":
                    case "Cruzado de":
                    case "Sucessora de":
                    case "Complementar de":
                    case "Sintetizado por":
                    case "Síntese de":
                    case "Suplemento de":
                    case "Suplemento para":
                        relacoes.push({
                            relacao: classesRelacao[i],
                            serieRelacionada: {
                                codigo: classesRelacionadas[i]
                            }
                        });
                        break;
                    default:
                        erros[tipo].push({
                            classe: classe[0],
                            erro: "Relação inválida, nº " + (i + 1)
                        });
                }
            } else {
                erros[tipo].push({
                    classe: classe[0],
                    erro: "Não pode ter uma relação com a própria classe!"
                });
            }
        }
    } else {
        erros[tipo].push({ classe: classe[0], erro: "Relações inválidas!" });
    }
    return relacoes;
}

/* 
  Função para validar as legislações de uma série
*/
function validarLegislacao(classe, legislacao, erros) {
    let novas_l = [];

    let legis = classe[12].split("#").filter(e => e != "");

    for (let i = 0; i < legis.length; i++) {
        let l = legislacao.find(e => e.legislacao.split(" - ")[0] == legis[i]);

        if (l != undefined) {
            novas_l.push(l);
        } else {
            erros.series.push({
                classe: classe[0],
                erro: "Legislação não existe, " + legis[i] + "."
            });
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
        let entidades = classe[11].split("#")[0] == "" ? [] : classe[11].split("#");

        for (let i = 0; i < entidades.length; i++) {
            let ent = re.entidadesProd.find(e => e.split(" - ")[0] == entidades[i]);

            if (ent != undefined) {
                entProdutoras.push(ent);
            } else {
                if (entidades[i] != "") {
                    erros.series.push({
                        classe: classe[0],
                        erro: "Entidade não é válida, " + entidades[i] + "!"
                    });
                }
            }
        }
    } else {
        if (re.tipologiasProd.split(" - ")[0] == classe[11]) {
            tipologiasProdutoras = [re.tipologiasProd];
        } else {
            if (classe[11] != "") {
                erros.series.push({ classe: classe[0], erro: "Tipologia não é válida!" });
            }
        }
    }

    // verificar se existem produtoras
    if (!!entProdutoras[0] == false && !!tipologiasProdutoras[0] == false) {
        erros.series.push({ classe: classe[0], erro: "Não existem entidades/tipologias produtoras!" });
    }

    serie["entProdutoras"] = entProdutoras;
    serie["tipologiasProdutoras"] = tipologiasProdutoras;


}

/* 
Função para calcular o suporte e medição
*/
function suporte_e_medicao(classe, erros) {
    let suporte_e_medicao = [];

    let suporte_partido = classe[8].split("#");
    let medicao_partido = classe[9].split("#");

    if (suporte_partido.length == medicao_partido.length) {
        for (let i = 0; i < suporte_partido.length; i++) {
            if (
                [
                    "Eletrónico Digitalizado",
                    "Eletrónico Nativo",
                    "Papel",
                    "Outro"
                ].includes(suporte_partido[i]) &&
                new Number(medicao_partido[i]) > 0
            ) {
                suporte_e_medicao.push({
                    suporte: suporte_partido[i],
                    medicao: medicao_partido[i]
                });
            }
        }

        if (suporte_e_medicao.length == 0) {
            suporte_e_medicao.push({ suporte: null, medicao: null });
        }
    } else {
        erros["serie"].push({ classe: classe[0], erro: "Suporte e Medição" });
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

export { validarClasses };