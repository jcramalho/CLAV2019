const Papa = require("papaparse");

const papa_config = {
    delimitersToGuess: [',', ';', Papa.RECORD_SEP, Papa.UNIT_SEP],
    skipEmptyLines: true,
    //header: true,
    //dynamicTyping: true
}

var importarSI = (file, ppd) => {

    return new Promise((resolve, reject) => {

        let parsedFile = Papa.parse(file, papa_config);
        let si = parsedFile.data;
        var allSI = [];

        // limpar espaços que possam vir nos campos
        for (let i = 0; i < si.length; i++) {
            si[i] = si[i].map(s => { return s.trim() });
        }


        if(si[0][2] == "Administrador do SI"){
            //VERIFICAR SE TEM TODOS OS CAMPOS
            for(let i = 1; i<si.length; i++){
                var sIdentificacao={
                    numeroSI : si[i][0],
                    nomeSI : si[i][1],
                    identificacao:{
                        adminSistema : si[i][2],
                        adminDados : si[i][3],
                        propSistemaPublico : si[i][4],
                        propSistemaPrivado : si[i][5],
                        propDados : si[i][6],
                        localDadosPublico : si[i][7],
                        localDadosPrivado : si[i][8],
                        defCheck : si[i][9],
                        defResponsavel : si[i][10],
                        insourcingCheck : si[i][11],
                        insourcing : si[i][12],
                        outsourcingCheck : si[i][13],
                        outsourcing : si[i][14],
                        notas : si[i][15],
                    },
                    avaliacao:{},
                    caracterizacao: {},
                    estrategia: {}
                }
                allSI.push(sIdentificacao);
            };
        }
        else if(si[0][2] == "Descrição / Âmbito e conteúdo da classe / série"){
            //VERIFICAR SE TEM TODOS OS CAMPOS
            for(let i = 1; i<si.length; i++){
                var sIAvaliacao={
                    numeroSI : si[i][0],
                    nomeSI : si[i][1],
                    identificacao: {},
                    avaliacao:{
                        descricao: si[i][2],
                        decomposicao: si[i][3],
                        codClasse: si[i][4],
                        numeroClasse: si[i][5],
                        tituloClasse: si[i][6],
                        pcaClasse: si[i][7],
                        formaContagemPrazos: si[i][8],
                        destinoFinalClasse: si[i][9],
                        pcaSI: si[i][10],
                        desfinoFinalSI: si[i][11],
                        siRelacionado: si[i][12],
                        siRelacionadoRelacao: si[i][13],
                        estadoSI: si[i][14],
                        grauUtilizacaoSI: si[i][15],
                        criticidadeSI: si[i][16],
                        siObjetoPreservacao: si[i][17],
                    },
                    caracterizacao: {},
                    estrategia: {}
                }
                allSI.push(sIAvaliacao);
            };
        }
        else if(si[0][2] == "Nível de dependência do software"){
            //VERIFICAR SE TEM TODOS OS CAMPOS
            for(let i = 1; i<si.length; i++){
                var sICaracterizacao={
                    numeroSI : si[i][0],
                    nomeSI : si[i][1],
                    identificacao: {},
                    avaliacao:{},
                    caracterizacao: {
                        dependenciaSoft: si[i][2],
                        categoriaDados: si[i][3],
                        formatosUtilizados: si[i][4],
                        modeloCres: si[i][5],
                        dimensao: si[i][6],
                        crescimento: si[i][7],
                        localSistema: si[i][8],
                        salaTec: si[i][9],
                        acessoSalaTec: si[i][10],
                        energiaRed: si[i][11],
                        energiaSoc: si[i][12],
                        alarme: si[i][13],
                        climatizacao: si[i][14],
                        seguranca: si[i][15],
                        comunicacaoEx: si[i][16],
                        planoContingencia: si[i][17],
                        planoMudEvolucao: si[i][18],
                        privAcesso: si[i][19],
                        catSegDados: si[i][20],
                        rotinaAuditoria: si[i][21],
                        logsRotinas: si[i][22],
                        integridadeInfo: si[i][23],
                        armazenamento: si[i][24],
                        replicacaoDados: si[i][25],
                        backupsRegular: si[i][26],
                        modeloBackup: si[i][27],

                        qualidadeBackup: si[i][28],
                        inventarioSoft: si[i][29],
                        inventarioHard: si[i][30],
                        documentacaoSis: si[i][31],
                        documentacaoProc: si[i][32],
                        controlVersaoDProc: si[i][33],
                        contratoAtivos: si[i][34],
                        planoRecuperacao: si[i][35],
                        notas: si[i][36],
                    },
                    estrategia: {}
                }
                allSI.push(sICaracterizacao);
            };
        }
        else if(si[0][2] == "EP: utilização operacional - Identificação dos métodos de preservação"){
            //VERIFICAR SE TEM TODOS OS CAMPOS
            for(let i = 1; i<si.length; i++){
                var sIEstrategia={
                    numeroSI : si[i][0],
                    nomeSI : si[i][1],
                    identificacao: {},
                    avaliacao:{},
                    caracterizacao: {},
                    estrategia: {
                        uOperacionalIdentificacao: si[i][2],
                        uOperacionalFundamentacao: si[i][3],
                        uOperacionalLacunas: si[i][4],
                        uMemoriaIdentificacao : si[i][5],
                        uMemoriaFundamentacao : si[i][6],
                        uMemoriaLacunas : si[i][7],
                    }
                }
                allSI.push(sIEstrategia);
            };
        }

        resolve({ allSI });

    });
}


var importarIdentificacao = (file, ppd) => {
    return new Promise((resolve, reject) => {

        let parsedFile = Papa.parse(file, papa_config);
        let si = parsedFile.data;

        // limpar espaços que possam vir nos campos
        for (let i = 0; i < si.length; i++) {
            si[i] = si[i].map(s => { return s.trim() });
        }

        var allSI = [];
        for(let i = 1; i<si.length; i++){
            //ppd.lixo = si[1][0];
            var sIdentificacao={
                numeroSI : si[i][0],
                nomeSI : si[i][1],
                identificacao:{
                    adminSistema : si[i][2],
                    adminDados : si[i][3],
                    propSistemaPublico : si[i][4],
                    propSistemaPrivado : si[i][5],
                    propDados : si[i][6],
                    localDadosPublico : si[i][7],
                    localDadosPrivado : si[i][8],
                    defCheck : si[i][9],
                    defResponsavel : si[i][10],
                    insourcingCheck : si[i][11],
                    insourcing : si[i][12],
                    outsourcingCheck : si[i][13],
                    outsourcing : si[i][14],
                    notas : si[i][15],
                }
            }
            allSI.push(sIdentificacao);
        };
        //ppd.identificacao = sIdentificacao;

        resolve({ allSI });

    });
};

export { importarSI };