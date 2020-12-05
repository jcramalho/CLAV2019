export default {
  data: () => ({
    e1: 1,
  }),
  methods: {
    changeE1(e) {
      this.e1 = e;
    },
    newSistema: async function() {
      if(/*this.validaAll("O campo número do SI",this.ppd.si.numeroSI) &&
        this.validaAll("O campo  nome do SI",this.ppd.si.nomeSI) &&
        this.validaAll("O campo administrador do sistema",this.ppd.si.identificacao.adminSistema) &&
        this.validaAll("O campo administrador de dados",this.ppd.si.identificacao.adminDados) &&
        this.validaAll("O campo proprietário do SI - entidade pública",this.ppd.si.identificacao.propSistemaPublico) &&
        this.validaAll("O campo proprietário do SI - entidade privada",this.ppd.si.identificacao.propSistemaPrivado) &&
        this.validaAll("O campo proprietário dos dados",this.ppd.si.identificacao.propDados) &&
        this.validaAll("O campo localização dos dados - entidade pública",this.ppd.si.identificacao.localDadosPublico) &&
        this.validaAll("O campo localização dos dados - entidade privada",this.ppd.si.identificacao.localDadosPrivado) &&
        this.validaDef(this.ppd.si.identificacao.defResponsavel, this.ppd.si.identificacao.defCheck) &&
        this.validaInsourcing(this.ppd.si.identificacao.insourcing, this.ppd.si.identificacao.insourcingCheck) &&
        this.validaOutsourcing(this.ppd.si.identificacao.outsourcing, this.ppd.si.identificacao.outsourcingCheck) &&
        this.validaAll("O campo notas", this.ppd.si.identificacao.notas) &&
        this.validaAll("O campo de utilizadores",this.ppd.si.identificacao.userList)*/1
      ){
        var sistema = {
          visto: true,
          numeroSI: this.ppd.si.numeroSI,
          nomeSI: this.ppd.si.nomeSI,
          identificacao:{
            adminSistema: this.ppd.si.identificacao.adminSistema,
            adminDados: this.ppd.si.identificacao.adminDados,
            propSistemaPublico: this.ppd.si.identificacao.propSistemaPublico,
            propSistemaPrivado: this.ppd.si.identificacao.propSistemaPrivado,
            propDados: this.ppd.si.identificacao.propDados,
            localDadosPublico: this.ppd.si.identificacao.localDadosPublico,
            localDadosPrivado: this.ppd.si.identificacao.localDadosPrivado,
            userList: this.ppd.si.identificacao.userList,
            defResponsavel: this.ppd.si.identificacao.defResponsavel,
            expressaoResponsavel:this.ppd.si.identificacao.expressaoResponsavel,
            insourcing: this.ppd.si.identificacao.insourcing,
            outsourcing: this.ppd.si.identificacao.outsourcing,
            notas: this.ppd.si.identificacao.notas,
          },
          avaliacao:{
            descricao: this.ppd.si.avaliacao.descricao,
            tabelaDecomposicao:this.ppd.si.avaliacao.tabelaDecomposicao,
            selecionadosTabelaFL:this.ppd.si.avaliacao.selecionadosTabelaFL,
            sistemasRelacionados:this.ppd.si.avaliacao.sistemasRelacionados,
            checkedAti:this.ppd.si.avaliacao.checkedAti,
            checkedGrau:this.ppd.si.avaliacao.checkedGrau,
            checkedCriticidade:this.ppd.si.avaliacao.checkedCriticidade,
            objetoPreservacao:this.ppd.si.avaliacao.objetoPreservacao,
            legislacoes:this.ppd.si.avaliacao.legislacoes,
          },
          caracterizacao:{
            dependenciaSoft: this.ppd.si.caracterizacao.dependenciaSoft,
            categoriaDados: this.ppd.si.caracterizacao.categoriaDados,
            formato: this.ppd.si.caracterizacao.formato,
            modeloCres: this.ppd.si.caracterizacao.modeloCres,
            dimensao: this.ppd.si.caracterizacao.dimensao,
            crescimento: this.ppd.si.caracterizacao.crescimento,
            localSistema: this.ppd.si.caracterizacao.localSistema,
            salaTec: this.ppd.si.caracterizacao.salaTec,
            acessoSalaTec: this.ppd.si.caracterizacao.acessoSalaTec,
            energiaRed: this.ppd.si.caracterizacao.energiaRed,
            energiaSoc: this.ppd.si.caracterizacao.energiaSoc,
            alarme: this.ppd.si.caracterizacao.alarme,
            climatizacao: this.ppd.si.caracterizacao.climatizacao,
            seguranca: this.ppd.si.caracterizacao.seguranca,
            comunicacaoEx: this.ppd.si.caracterizacao.comunicacaoEx,
            planoContingencia: this.ppd.si.caracterizacao.planoContingencia,
            planoMudEvolucao: this.ppd.si.caracterizacao.planoMudEvolucao,
            privAcesso: this.ppd.si.caracterizacao.privAcesso,
            catSegDados: this.ppd.si.caracterizacao.catSegDados,
            rotinaAuditoria: this.ppd.si.caracterizacao.rotinaAuditoria,
            logsRotinas: this.ppd.si.caracterizacao.logsRotinas,
            integridadeInfo: this.ppd.si.caracterizacao.integridadeInfo,
            armazenamento: this.ppd.si.caracterizacao.armazenamento,
            replicacaoDados: this.ppd.si.caracterizacao.replicacaoDados,
            backupsRegular: this.ppd.si.caracterizacao.backupsRegular,
            modeloBackup: this.ppd.si.caracterizacao.modeloBackup,
            qualidadeBackup: this.ppd.si.caracterizacao.qualidadeBackup,
            inventarioSoft: this.ppd.si.caracterizacao.inventarioSoft,
            inventarioHard: this.ppd.si.caracterizacao.inventarioHard,
            documentacaoSis: this.ppd.si.caracterizacao.documentacaoSis,
            documentacaoProc: this.ppd.si.caracterizacao.documentacaoProc,
            controlVersaoDProc: this.ppd.si.caracterizacao.controlVersaoDProc,
            contratoAtivos: this.ppd.si.caracterizacao.contratoAtivos,
            planoRecuperacao: this.ppd.si.caracterizacao.planoRecuperacao,
            notas: this.ppd.si.caracterizacao.notas,
          },
          estrategia:{
            utilizacaoOperacional:{
              idMetodoPreservacao: this.ppd.si.estrategia.utilizacaoOperacional.idMetodoPreservacao,
              fundMetodoPreservacao: this.ppd.si.estrategia.utilizacaoOperacional.fundMetodoPreservacao,
              lacunas: this.ppd.si.estrategia.utilizacaoOperacional.lacunas,
          },
            utilizacaoMemoria:{
              idMetodoPreservacao: this.ppd.si.estrategia.utilizacaoMemoria.idMetodoPreservacao,
              fundMetodoPreservacao: this.ppd.si.estrategia.utilizacaoMemoria.fundMetodoPreservacao,
              lacunas: this.ppd.si.estrategia.utilizacaoMemoria.lacunas,
            }
          }
        };
        this.ppd.si.numeroSI = "",
        this.ppd.si.nomeSI = "",
        this.ppd.si.identificacao.adminSistema = [],
        this.ppd.si.identificacao.adminDados = [],
        this.ppd.si.identificacao.propSistemaPublico = [],
        this.ppd.si.identificacao.propSistemaPrivado = "",
        this.ppd.si.identificacao.propDados = [],
        this.ppd.si.identificacao.localDadosPublico = [],
        this.ppd.si.identificacao.localDadosPrivado = "",
        this.ppd.si.identificacao.userList = [],
        this.ppd.si.identificacao.outsourcingCheck = "",
        this.ppd.si.identificacao.defCheck = "",
        this.ppd.si.identificacao.insourcingCheck = "",
        this.ppd.si.identificacao.defResponsavel = "",
        this.ppd.si.identificacao.expressaoResponsavel = "",
        this.ppd.si.identificacao.insourcing = "",
        this.ppd.si.identificacao.outsourcing = "",
        this.ppd.si.identificacao.notas = "",
        this.ppd.si.avaliacao.descricao = "",
        this.ppd.si.avaliacao.tabelaDecomposicao = [],
        this.ppd.si.avaliacao.selecionadosTabelaFL = [],
        this.ppd.si.avaliacao.sistemasRelacionados = [],
        this.ppd.si.avaliacao.checkedAti = "",
        this.ppd.si.avaliacao.checkedGrau = "",
        this.ppd.si.avaliacao.checkedCriticidade = "",
        this.ppd.si.avaliacao.objetoPreservacao = "",
        this.ppd.si.avaliacao.legislacoes = "",
        this.ppd.si.caracterizacao.dependenciaSoft = "",
        this.ppd.si.caracterizacao.categoriaDados = "",
        this.ppd.si.caracterizacao.formato = "",
        this.ppd.si.caracterizacao.modeloCres = "",
        this.ppd.si.caracterizacao.dimensao = "",
        this.ppd.si.caracterizacao.crescimento = "",
        this.ppd.si.caracterizacao.localSistema = "",
        this.ppd.si.caracterizacao.salaTec = "",
        this.ppd.si.caracterizacao.acessoSalaTec = "",
        this.ppd.si.caracterizacao.energiaRed = "",
        this.ppd.si.caracterizacao.energiaSoc = "",
        this.ppd.si.caracterizacao.alarme = "",
        this.ppd.si.caracterizacao.climatizacao = "",
        this.ppd.si.caracterizacao.seguranca = "",
        this.ppd.si.caracterizacao.comunicacaoEx = "",
        this.ppd.si.caracterizacao.planoContingencia = "",
        this.ppd.si.caracterizacao.planoMudEvolucao = "",
        this.ppd.si.caracterizacao.privAcesso = "",
        this.ppd.si.caracterizacao.catSegDados = "",
        this.ppd.si.caracterizacao.rotinaAuditoria = "",
        this.ppd.si.caracterizacao.logsRotinas = "",
        this.ppd.si.caracterizacao.integridadeInfo = "",
        this.ppd.si.caracterizacao.armazenamento = "",
        this.ppd.si.caracterizacao.replicacaoDados = "",
        this.ppd.si.caracterizacao.backupsRegular = "",
        this.ppd.si.caracterizacao.modeloBackup = "",
        this.ppd.si.caracterizacao.qualidadeBackup = "",
        this.ppd.si.caracterizacao.inventarioSoft = "",
        this.ppd.si.caracterizacao.inventarioHard = "",
        this.ppd.si.caracterizacao.documentacaoSis = "",
        this.ppd.si.caracterizacao.documentacaoProc = "",
        this.ppd.si.caracterizacao.controlVersaoDProc = "",
        this.ppd.si.caracterizacao.contratoAtivos = "",
        this.ppd.si.caracterizacao.planoRecuperacao = "",
        this.ppd.si.caracterizacao.notas = "",
        this.ppd.si.estrategia.utilizacaoOperacional.idMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoOperacional.fundMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoOperacional.lacunas= ""
        this.ppd.si.estrategia.utilizacaoMemoria.idMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoMemoria.fundMetodoPreservacao= "",
        this.ppd.si.estrategia.utilizacaoMemoria.lacunas= ""
        this.dialog= false;
        this.$emit("newSistema", sistema);
      } else {
        this.dialog= true;
        this.erroValidacao = true;
      }
    }
  },
};