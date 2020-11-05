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

        //falta confirmar se tem os campos todos
        if(si[0][2] == "1_Administrador do SI"){
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
                    avaliacao:{
                        descricao: si[i][16],
                        decomposicao: si[i][17],
                        codClasse: si[i][18],
                        numeroClasse: si[i][19],
                        tituloClasse: si[i][20],
                        pcaClasse: si[i][21],
                        formaContagemPrazos: si[i][22],
                        destinoFinalClasse: si[i][23],
                        pcaSI: si[i][24],
                        desfinoFinalSI: si[i][25],
                        siRelacionado: si[i][26],
                        siRelacionadoRelacao: si[i][27],
                        estadoSI: si[i][28],
                        grauUtilizacaoSI: si[i][29],
                        criticidadeSI: si[i][30],
                        siObjetoPreservacao: si[i][31],
                        notas: si[i][32]
                    },
                    caracterizacao: {
                        dependenciaSoft: si[i][33],
                        categoriaDados: si[i][34],
                        formatosUtilizados: si[i][35],
                        modeloCres: si[i][36],
                        dimensao: si[i][37],
                        crescimento: si[i][38],
                        localSistema: si[i][39],
                        salaTec: si[i][40],
                        acessoSalaTec: si[i][41],
                        energiaRed: si[i][42],
                        energiaSoc: si[i][43],
                        alarme: si[i][44],
                        climatizacao: si[i][45],
                        seguranca: si[i][46],
                        comunicacaoEx: si[i][47],
                        planoContingencia: si[i][48],
                        planoMudEvolucao: si[i][49],
                        privAcesso: si[i][50],
                        catSegDados: si[i][51],
                        rotinaAuditoria: si[i][52],
                        logsRotinas: si[i][53],
                        integridadeInfo: si[i][54],
                        armazenamento: si[i][55],
                        replicacaoDados: si[i][56],
                        backupsRegular: si[i][57],
                        modeloBackup: si[i][58],
                        qualidadeBackup: si[i][59],
                        inventarioSoft: si[i][60],
                        inventarioHard: si[i][61],
                        documentacaoSis: si[i][62],
                        documentacaoProc: si[i][63],
                        controlVersaoDProc: si[i][64],
                        contratoAtivos: si[i][65],
                        planoRecuperacao: si[i][66],
                        notas: si[i][67],
                    },
                    estrategia: {
                        uOperacionalIdentificacao: si[i][68],
                        uOperacionalFundamentacao: si[i][69],
                        uOperacionalLacunas: si[i][70],
                        uMemoriaIdentificacao : si[i][71],
                        uMemoriaFundamentacao : si[i][72],
                        uMemoriaLacunas : si[i][73],
                    }
                }
                allSI.push(sIdentificacao);
            }
        }
        resolve({ allSI });
    });
}


/*
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
            //FALTA VERIFICAR SE TEM TODOS OS CAMPOS
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
}*/



export { importarSI };