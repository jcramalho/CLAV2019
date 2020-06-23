/* eslint-disable prettier/prettier */
let classes_rada = '';

export async function converterParaTriplosRADA(obj) {
    classes_rada = obj.tsRada.classes;

    let triplos = `clav:rada_${obj.id} rdf:type owl:NamedIndividual, clav:RADA;
                            clav:contemRE clav:rada_${obj.id}_re ;
                            clav:contemTS clav:rada_${obj.id}_ts ;
                            clav:codigo "${obj.id}" ;
                            clav:dataAprovacao "${new Date().toLocaleString("pt-pt", { timeZone: "Europe/London" })}" ;
                            clav:eDaResponsabilidadeDe clav:${obj.entRes
            .map(e => "ent_" + e.split(" - ")[0])
            .join(", clav:")} ;
                            clav:titulo "${obj.titulo}" .\n\n`;

    triplos += await triplosRE(obj.RE, obj.id);
    triplos += await triplosTS(obj.tsRada, obj.id);
    triplos += await triplosUnidadeInstalacao(obj.tsRada.UIs);

    return triplos;
}

async function triplosRE(RE, codigoRADA) {
    try {
        let triplos = `clav:rada_${codigoRADA}_re rdf:type owl:NamedIndividual, clav:RelatorioExpositivo ;
            clav:avaliaDocProduzidaPor clav:${
            !!RE.entidadesProd[0]
                ? RE.entidadesProd.map(e => "ent_" + e.split(" - ")[0]).join(", clav:")
                : RE.tipologiasProd.map(e => "tip_" + e.split(" - ")[0]).join(", clav:")
            } ;
            clav:dataFinal "${RE.dataFinal}" ;
            clav:dataInicial "${RE.dataInicial}" ;
            clav:estadoConservacao "${RE.est_conser}" ;
            clav:histAdministrativa "${RE.hist_admin}" ;
            clav:histCustodial "${RE.hist_cust}" ;
            clav:localizacao "${RE.localizacao}" ;
            clav:medicaoUIsDigital ${RE.dimSuporte.medicaoUI_digital} ;
            clav:medicaoUIsOutros ${RE.dimSuporte.medicaoUI_outros} ;
            clav:medicaoUIsPapel ${RE.dimSuporte.medicaoUI_papel} ;
            clav:numeroSeries ${RE.dimSuporte.nSeries} ;
            clav:numeroSubseries ${RE.dimSuporte.nSubseries} ;
            clav:numeroUIs ${RE.dimSuporte.nUI} ;
            clav:sistOrganizacao "${RE.sist_org}" .\n\n`;
        return triplos;
    } catch (err) {
        console.log(err);
    }
}

async function triplosTS(ts, codigoRADA) {
    try {
        let triplos = `clav:rada_${codigoRADA}_ts rdf:type owl:NamedIndividual , clav:TabelaSelecaoRada ;
                                    clav:titulo "${ts.titulo}" ;
                                    clav:temClasse clav:${ts.classes
                .map(e => e.id)
                .join(",\n clav:")} . \n\n`;

        // criar os triplos para as classes
        for (let i = 0; i < ts.classes.length; i++) {
            switch (ts.classes[i].tipo) {
                case "Série":
                    triplos += await triplosSerie(ts.classes[i], codigoRADA);
                    break;
                case "Subsérie":
                    triplos += await triplosSubserie(ts.classes[i], codigoRADA);
                    break;
                default:
                    triplos += await triplosAreaOrganico(ts.classes[i], codigoRADA);
                    break;
            }
        }
        return triplos;
    } catch (err) {
        console.log(err);
    }
}

function triplosAreaOrganico(classe, codigoRADA) {
    try {
        let triplos = `clav:${classe.id} rdf:type owl:NamedIndividual , clav:Area_Organico ;
                                    clav:codigo "${classe.codigo}" ;
                                    clav:descricao "${classe.descricao}" ;
                                    clav:nivel "${classe.tipo}" ;
                                    ${!!classe.eFilhoDe ? "clav:temPai clav:rada_" + codigoRADA + "_organico_funcional_" + classe.eFilhoDe + " ;" : ''}
                                    clav:titulo "${classe.titulo}" .\n\n`
        return triplos;
    } catch (err) {
        console.log(err);
    }
}

async function triplosSerie(classe, codigoRADA) {
    try {
        let triplos = `clav:${classe.id} rdf:type owl:NamedIndividual , clav:Serie ;
                                    clav:codigo "${classe.codigo}" ;
                                    clav:descricao "${classe.descricao}" ;
                                    clav:titulo "${classe.titulo}" ;
                                    clav:dataInicial "${classe.dataInicial}" ;
                                    clav:dataFinal "${classe.dataFinal}" ;
                                    clav:tipoUA "${classe.tUA}" ;
                                    clav:tipoSerie "${classe.tSerie}" ;
                                    ${!!classe.legislacao[0] ? `clav:reguladaPor clav:${classe.legislacao.map(e => e.id).join(", clav:")} ;` : ''}
                                    ${!!classe.entProdutoras[0] || !!classe.tipologiasProdutoras[0] ? `clav:produzidaPor clav:${
                !!classe.entProdutoras[0]
                    ? classe.entProdutoras.map(e => "ent_" + e.split(" - ")[0]).join(", clav:")
                    : classe.tipologiasProdutoras.map(e => "tip_" + e.split(" - ")[0]).join(", clav:")
                } ;` : ''}
                                    
                                    clav:localizacao "${classe.localizacao.join(" ,")}" ;
                                    ${!!classe.UIs[0] ? "clav:ePaiDeUI " + classe.UIs.map(e => "clav:rada_" + codigoRADA + "_ui_" + e).join(", ") + " ;" : ''}
                                    clav:temPai clav:rada_${codigoRADA + "_organico_funcional_" + classe.eFilhoDe} .\n\n`
        triplos += await triplosRelacoes(classe, codigoRADA);

        triplos += await triplosSuporteMedicao(classe);

        if ("pca" in classe && "df" in classe) {
            triplos += await triplosPCA(classe, codigoRADA);
            triplos += await triplosDF(classe, codigoRADA);
        }

        return triplos;

    } catch (err) {
        console.log(err);
    }
}

async function triplosSuporteMedicao(classe) {
    try {
        let triplos = '';

        for (let i = 0; i < classe.suporte_e_medicao.length; i++) {
            triplos += `clav:${classe.id}_suporte_medicao_${i + 1} rdf:type owl:NamedIndividual , clav:SuporteMedicao ;
                                    clav:suporte "${classe.suporte_e_medicao[i].suporte}" ;
                                    clav:medicao "${classe.suporte_e_medicao[i].medicao}".\n\nclav:${classe.id} clav:temSuporteMedicao clav:${classe.id}_suporte_medicao_${i + 1}.\n\n`

        }
        return triplos;
    } catch (err) {
        console.log(err);
    }
}

async function triplosSubserie(classe, codigoRADA) {
    try {
        let triplos = `clav:${classe.id} rdf:type owl:NamedIndividual , clav:Subserie ;
                                    clav:codigo "${classe.codigo}" ;
                                    clav:descricao "${classe.descricao}" ;
                                    clav:titulo "${classe.titulo}" ;
                                    clav:dataInicial "${classe.dataInicial}" ;
                                    clav:dataFinal "${classe.dataFinal}" ;
                                    ${!!classe.UIs[0] ? "clav:ePaiDeUI " + classe.UIs.map(e => "clav:rada_" + codigoRADA + "_ui_" + e).join(", ") + " ;" : ''}
                                    clav:temPai clav:rada_${codigoRADA + "_serie_" + classe.eFilhoDe} .\n\n`

        triplos += await triplosRelacoes(classe, codigoRADA);
        triplos += await triplosPCA(classe, codigoRADA);
        triplos += await triplosDF(classe, codigoRADA);

        return triplos;
    } catch (err) {
        console.log(err);
    }
}

function triplosRelacoes(classe, codigoRADA) {
    let triplos = ``;
    for (let i = 0; i < classe.relacoes.length; i++) {
        switch (classe.relacoes[i].relacao) {
            case "Antecessora de":
                triplos += `clav:${classe.id} clav:eAntecessorDe clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
            case "Sucessora de":
                triplos += `clav:${classe.id} clav:eSucessorDe clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
            case "Cruzado de":
                triplos += `clav:${classe.id} clav:eCruzadoCom clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
            case "Complementar de":
                triplos += `clav:${classe.id} clav:eComplementarDe clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
            case "Sintetizado por":
                triplos += `clav:${classe.id} clav:eSintetizadoPor clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
            case "Síntese de":
                triplos += `clav:${classe.id} clav:eSinteseDe clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
            case "Suplemento de":
                triplos += `clav:${classe.id} clav:eSuplementoDe clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
            case "Suplemento para":
                triplos += `clav:${classe.id} clav:eSuplementoPara clav:${"rada_" + codigoRADA + "_" + classe.relacoes[i].serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + classe.relacoes[i].serieRelacionada.codigo} .\n`
                break;
        }
    }
    return triplos;
}

async function triplosDF(classe, codigoRADA) {
    try {
        let triplos = `clav:${classe.id} clav:temDF clav:df_${classe.id} .\n\nclav:df_${classe.id} rdf:type owl:NamedIndividual , clav:DestinoFinal ;
                            ${!!classe.notaDF ? `clav:dfNota "${classe.notaDF}" ;` : ''}
                            clav:dfValor ${!!classe.df ? `"${await destinoFinal(classe.df)}"` : `"NE"`}.\n\n`

        if (!!classe.justificacaoDF[0]) {
            triplos += `clav:just_df_${classe.id} rdf:type owl:NamedIndividual , clav:JustificacaoDF.\n\nclav:df_${classe.id} clav:temJustificacao clav:just_df_${classe.id} .\n\n`;

            for (let i = 0; i < classe.justificacaoDF.length; i++) {
                triplos += await triplosJustificacaoDFCriterios(classe.justificacaoDF[i], i + 1, classe, codigoRADA);
            }
        }
        return triplos;
    } catch (err) {
        console.log(err);
    }
}

function destinoFinal(df) {
    let destino = '';

    switch (df) {
        case 'Conservação':
            destino = 'C';
            break;
        case 'Eliminação':
            destino = 'E';
            break;
        case 'Conservação Parcial':
            destino = 'CP';
            break;
    }

    return destino;
}

async function triplosPCA(classe, codigoRADA) {
    try {
        let triplos = `clav:${classe.id} clav:temPCA clav:pca_${classe.id} .\n\nclav:pca_${classe.id} rdf:type owl:NamedIndividual , clav:PCA ;
                clav:pcaValor ${!!classe.pca ? `"${classe.pca}"` : `"NE"`} ;
                ${!!classe.notaPCA ? `clav:pcaNota "${classe.notaPCA}" ;` : ''}
                ${!!classe.formaContagem.subforma ? `clav:pcaSubformaContagem clav:${classe.formaContagem.subforma} ;` : ''}
                clav:pcaFormaContagemNormalizada clav:${classe.formaContagem.forma} . \n\n`

        if (!!classe.justificacaoPCA[0]) {
            triplos += `clav:just_pca_${classe.id} rdf:type owl:NamedIndividual , clav:JustificacaoPCA.\nclav:pca_${classe.id} clav:temJustificacao clav:just_pca_${classe.id} .\n\n`;

            for (let i = 0; i < classe.justificacaoPCA.length; i++) {
                triplos += await triplosJustificacaoPCACriterios(classe.justificacaoPCA[i], i + 1, classe, codigoRADA);
            }

        }
        return triplos;

    } catch (err) {
        console.log(err);
    }
}

async function triplosJustificacaoPCACriterios(criterio, i, classe, codigoRADA) {
    try {
        let triplos = '';

        switch (criterio.tipo) {
            case 'Critério Gestionário':
                triplos += `clav:crit_just_pca_${classe.id}_${i} rdf:type owl:NamedIndividual , clav:CriterioJustificacaoGestionario;
                                clav:conteudo "${criterio.nota}".\n`
                break;
            case 'Critério Legal':
                triplos += `clav:crit_just_pca_${classe.id}_${i} rdf:type owl:NamedIndividual , clav:CriterioJustificacaoLegal;
                    clav:conteudo "${criterio.nota}" ;
                    clav:criTemLegAssoc clav:${!!classe.legislacao ? criterio.relacoes.map(e => {
                    let l = classe.legislacao.find(leg => leg.legislacao == e);

                    return l.id;
                }).join(", clav:") : await criterioLegalSubserie(criterio, classe, "pca")} .\n`
                break;
            case 'Critério de Utilidade Administrativa':
                triplos += `clav:crit_just_pca_${classe.id}_${i} rdf:type owl:NamedIndividual , clav:CriterioJustificacaoUtilidadeAdministrativa;
                    clav:conteudo "${criterio.nota}"; 
                    clav:critTemProcRel clav:${classe.relacoes.filter(e => e.relacao == "Suplemento para").map(e => "rada_" + codigoRADA + "_" + e.serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + e.serieRelacionada.codigo).join(", clav:")} . \n`
                break;
        }
        triplos += `clav:just_pca_${classe.id} clav:temCriterio clav:crit_just_pca_${classe.id}_${i}. \n\n`
        return triplos;
    } catch (err) {
        console.log(err);
    }
}


async function triplosJustificacaoDFCriterios(criterio, i, classe, codigoRADA) {
    try {
        let triplos = '';

        switch (criterio.tipo) {
            case 'Critério de Complementaridade Informacional':
                triplos += `clav:crit_just_df_${classe.id}_${i} rdf:type owl:NamedIndividual , clav:CriterioJustificacaoComplementaridadeInfo ;
                                clav:conteudo "${criterio.nota}" ;
                                clav:critTemProcRel clav:${classe.relacoes.filter(e => e.relacao == "Complementar de").map(e => "rada_" + codigoRADA + "_" + e.serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + e.serieRelacionada.codigo).join(", clav:")}. \n`
                break;
            case 'Critério Legal':
                triplos += `clav:crit_just_df_${classe.id}_${i} rdf:type owl:NamedIndividual , clav:CriterioJustificacaoLegal;
                                clav:conteudo "${criterio.nota}" ;
                                clav:criTemLegAssoc clav:${!!classe.legislacao ? criterio.relacoes.map(e => {
                    let l = classe.legislacao.find(leg => leg.legislacao == e);
                    return l.id;
                }).join(", clav:") : await criterioLegalSubserie(criterio, classe, "df")} .\n`
                break;
            case 'Critério de Densidade Informacional':
                if (classe.relacoes.some(e => e.relacao == "Síntese de")) {
                    triplos += `clav:crit_just_df_${classe.id}_${i} rdf:type owl:NamedIndividual , clav:CriterioJustificacaoDensidadeInfoSinDe;
                    clav:conteudo "${criterio.nota}"; 
                    clav:critTemProcRel clav:${classe.relacoes.filter(e => e.relacao == "Síntese de").map(e => "rada_" + codigoRADA + "_" + e.serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + e.serieRelacionada.codigo).join(", clav:")} . \n`
                } else {
                    triplos += `clav:crit_just_df_${classe.id}_${i} rdf:type owl:NamedIndividual , clav:CriterioJustificacaoDensidadeInfoSinPor;
                    clav:conteudo "${criterio.nota}"; 
                    clav:critTemProcRel clav:${classe.relacoes.filter(e => e.relacao == "Sintetizado por").map(e => "rada_" + codigoRADA + "_" + e.serieRelacionada.tipo.replace("é", "e").toLowerCase() + "_" + e.serieRelacionada.codigo).join(", clav:")} . \n`
                }
                break;
        }
        triplos += `clav:just_df_${classe.id} clav:temCriterio clav:crit_just_df_${classe.id}_${i}. \n\n`
        return triplos;
    } catch (err) {
        console.log(err);
    }
}
function criterioLegalSubserie(criterio, classe, frase) {
    try {
        let pai = classes_rada.find(e => e.codigo == classe.eFilhoDe);

        return criterio.relacoes.map(e => {
            let l = pai.legislacao.find(leg => leg.legislacao == e);
            return l.id;
        }).join(", clav:")

    } catch (err) {
        console.log(err);
    }
}
function triplosUnidadeInstalacao(UIs) {
    let triplos = '';

    for (let i = 0; i < UIs.length; i++) {
        triplos += `clav:${UIs[i].id} rdf:type owl:NamedIndividual , clav:UnidadeInstalacao ;
                        clav:produzidaPor clav:${!!UIs[i].produtor.entProdutoras[0] ? UIs[i].produtor.entProdutoras.map(e => "ent_" + e.split(" - ")[0]).join(", clav:") : UIs[i].produtor.tipologiasProdutoras.map(e => "tip_" + e.split(" - ")[0]).join(", clav:")} ;
                        ${!!UIs[i].codCota ? `clav:codigoClassificacao "${UIs[i].codCota}" ;` : ''}
                        clav:dataFinal "${UIs[i].dataFinal}" ;
                        clav:dataInicial "${UIs[i].dataInicial}" ;
                        clav:descricao "${UIs[i].descricao}" ;
                        ${!!UIs[i].localizacao ? `clav:localizacao "${UIs[i].localizacao}" ;` : ''}
                        ${!!UIs[i].notas ? `clav:notas "${UIs[i].notas}" ;` : ''}
                        clav:titulo "${UIs[i].titulo}" ;
                        clav:codigo "${UIs[i].codigo}" .\n`
    }

    return triplos;
}