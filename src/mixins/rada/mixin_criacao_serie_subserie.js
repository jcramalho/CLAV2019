const labels = require("@/config/labels").criterios;

export default {
  data: () => ({
    existe_erros: false,
    erros: [],
    panels: [0, 0, 0],
    isMultiple: false,
    classesHierarquia: []
  }),
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  },
  methods: {
    buscarTitulosClasses(classe) {
      for (let i = 0; i < classe.relacoes.length; i++) {
        let classe_relacionada = this.classes.find(
          cl => cl.codigo == classe.relacoes[i].serieRelacionada.codigo
        );

        classe.relacoes[i].serieRelacionada["titulo"] =
          classe_relacionada.titulo;

        let criterio = null;
        if (classe.relacoes[i].relacao == "Suplemento para") {
          criterio = classe.justificacaoPCA.find(
            e => e.tipo == "Critério de Utilidade Administrativa"
          );
        }

        if (classe.relacoes[i].relacao == "Complementar de") {
          criterio = classe.justificacaoDF.find(
            e => e.tipo == "Critério de Complementaridade Informacional"
          );
        }

        if (
          classe.relacoes[i].relacao == "Síntese de" ||
          classe.relacoes[i].relacao == "Sintetizado por"
        ) {
          criterio = classe.justificacaoDF.find(
            e => e.tipo == "Critério de Densidade Informacional"
          );
        }

        if (criterio != null) {
          let relacaoCriterio = criterio.relacoes.find(
            e => e.codigo == classe_relacionada.codigo
          );

          this.$set(relacaoCriterio, "titulo", classe_relacionada.titulo);
        }
      }
    },
    validar_relacoes_sintese(classe, classes) {
      let relacoes_sintese = classe.relacoes.filter(
        e => e.relacao == "Síntese de" || e.relacao == "Sintetizado por"
      );

      for (let i = 0; i < relacoes_sintese.length; i++) {
        let existe_classe = classes.some(
          cl =>
            cl.codigo == relacoes_sintese[i].serieRelacionada.codigo &&
            cl.relacoes.some(rel => rel.relacao == relacoes_sintese[i].relacao)
        );

        if (existe_classe) {
          // Verificar esta expressão
          classe.relacoes = classe.relacoes.filter(
            rel =>
              rel.relacao != relacoes_sintese[i].relacao ||
              rel.serieRelacionada.codigo !=
              relacoes_sintese[i].serieRelacionada.codigo
          );

          this.remove_criterio_densidade_informacional(
            relacoes_sintese[i].serieRelacionada.codigo,
            classe
          );
        }
      }
    },
    remove_criterio_densidade_informacional(codigoClasse, classe) {
      let criterio = classe.justificacaoDF.find(
        crit => crit.tipo == "Critério de Densidade Informacional"
      );

      if (criterio != undefined) {
        criterio.relacoes = criterio.relacoes.filter(
          e => e.codigo != codigoClasse
        );

        if (criterio.relacoes.length == 0) {
          this.alteraDF(classe);

          classe.justificacaoDF = classe.justificacaoDF.filter(
            e => e.tipo != "Critério de Densidade Informacional"
          );
        }
      }
    },
    alteraDF(classe) {
      if (
        classe.justificacaoDF.some(
          e => e.tipo == "Critério de Complementaridade Informacional"
        )
      ) {
        classe.df = "Conservação";
      } else {
        classe.df = null;
      }
    },
    adicionarDF(classe_relacionada, relacao) {
      if (
        relacao == "Sintetizado por" &&
        !classe_relacionada.relacoes.some(e => e.relacao == "Complementar de")
      ) {
        classe_relacionada.df = "Eliminação";
      } else {
        classe_relacionada.df = "Conservação";
      }
    },
    adiciona_criterio_a_relacionada(
      classe_relacionada,
      codigoClasse,
      tipo_criterio,
      relacao
    ) {
      if (tipo_criterio == "Critério de Utilidade Administrativa") {
        let criterio = classe_relacionada.justificacaoPCA.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          classe_relacionada.justificacaoPCA.push({
            tipo: tipo_criterio,
            nota: labels.textoCriterioUtilidadeAdministrativa,
            relacoes: [{ codigo: codigoClasse }]
          });
        } else {
          criterio.relacoes.push({ codigo: codigoClasse });
        }
      } else {
        let criterio = classe_relacionada.justificacaoDF.find(
          crit => crit.tipo == tipo_criterio
        );

        if (criterio == undefined) {
          let nota = "";

          switch (relacao) {
            case "Sintetizado por":
              nota = labels.textoCriterioDensidadeSinPor;
              break;
            case "Complementar de":
              nota = labels.textoCriterioComplementaridade;
              break;
            case "Síntese de":
              nota = labels.textoCriterioDensidadeSinDe;
              break;
          }

          this.adicionarDF(classe_relacionada, relacao);

          classe_relacionada.justificacaoDF.push({
            tipo: tipo_criterio,
            nota: nota,
            relacoes: [{ codigo: codigoClasse }]
          });
        } else {
          criterio.relacoes.push({ codigo: codigoClasse });
        }
      }
    },
    adicionarUIs: function (clone_nova_classe) {
      for (let i = 0; i < clone_nova_classe.UIs.length; i++) {
        let UI = this.UIs.find(e => e.codigo == clone_nova_classe.UIs[i]);

        if (UI != undefined) {
          UI.classesAssociadas.push({
            codigo: clone_nova_classe.codigo,
            tipo: clone_nova_classe.tipo
          });
        } else {
          this.UIs.push({
            codigo: clone_nova_classe.UIs[i],
            codCota: "",
            titulo: "",
            dataInicial: null,
            dataFinal: null,
            produtor: {
              tipologiasProdutoras: [],
              entProdutoras: []
            },
            classesAssociadas: [
              {
                codigo: clone_nova_classe.codigo,
                tipo: clone_nova_classe.tipo
              }
            ],
            descricao: "",
            notas: "",
            localizacao: ""
          });
        }
      }
    },
    relacoes_simetricas: function (clone_nova_classe) {
      for (let i = 0; i < clone_nova_classe.relacoes.length; i++) {
        let classe_relacionada = this.classes.find(
          e => e.codigo == clone_nova_classe.relacoes[i].serieRelacionada.codigo
        );

        if (classe_relacionada == undefined) {
          if (clone_nova_classe.relacoes[i].serieRelacionada.tipo == "Série") {
            classe_relacionada = {
              codigo: clone_nova_classe.relacoes[i].serieRelacionada.codigo,
              titulo: clone_nova_classe.relacoes[i].serieRelacionada.titulo,
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              tUA: null,
              tSerie: null,
              suporte: null,
              medicao: null,
              localizacao: [],
              entProdutoras: [],
              tipologiasProdutoras: [],
              legislacao: [],
              relacoes: [],
              UIs: [],
              pca: null,
              notaPCA: null,
              notaDF: null,
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: null,
              justificacaoDF: [],
              eFilhoDe: null,
              tipo: "Série"
            };
          } else {
            classe_relacionada = {
              codigo: clone_nova_classe.relacoes[i].serieRelacionada.codigo,
              titulo: clone_nova_classe.relacoes[i].serieRelacionada.titulo,
              descricao: "",
              dataInicial: null,
              dataFinal: null,
              relacoes: [],
              UIs: [],
              pca: null,
              notaPCA: null,
              notaDF: null,
              formaContagem: {
                forma: null
              },
              justificacaoPCA: [],
              df: null,
              justificacaoDF: [],
              eFilhoDe: null,
              tipo: "Subsérie"
            };
          }

          this.classes.push(classe_relacionada);
        }

        let relacao_inversa = "";

        switch (clone_nova_classe.relacoes[i].relacao) {
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
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_nova_classe.codigo,
              "Critério de Complementaridade Informacional",
              relacao_inversa
            );
            break;
          case "Sintetizado por":
            relacao_inversa = "Síntese de";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_nova_classe.codigo,
              "Critério de Densidade Informacional",
              relacao_inversa
            );
            break;
          case "Síntese de":
            relacao_inversa = "Sintetizado por";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_nova_classe.codigo,
              "Critério de Densidade Informacional",
              relacao_inversa
            );
            break;
          case "Suplemento de":
            relacao_inversa = "Suplemento para";
            this.adiciona_criterio_a_relacionada(
              classe_relacionada,
              clone_nova_classe.codigo,
              "Critério de Utilidade Administrativa",
              relacao_inversa
            );
            break;
          case "Suplemento para":
            relacao_inversa = "Suplemento de";
            break;
        }

        classe_relacionada.relacoes.push({
          relacao: relacao_inversa,
          serieRelacionada: {
            codigo: clone_nova_classe.codigo,
            tipo: clone_nova_classe.tipo
          }
        });
      }
    },
    save(nova_classe) {
      this.existe_erros = false;
      this.erros = [];
      this.isMultiple = true;
      this.panels = [0, 1, 2];

      setTimeout(() => {
        if (
          this.$refs.form.validate() &&
          !(
            !!nova_classe.UIs[0] == false &&
            (!!nova_classe.dataInicial == false ||
              !!nova_classe.dataFinal == false)
          )
        ) {
          let clone_nova_classe = Object.assign({}, nova_classe);

          clone_nova_classe.justificacaoPCA.forEach(criterio => {
            if (criterio.tipo == "Critério de Utilidade Administrativa") {
              criterio.relacoes.map(rel => delete rel.titulo);
            }
          });

          clone_nova_classe.justificacaoDF.forEach(criterio => {
            if (
              criterio.tipo == "Critério de Complementaridade Informacional" ||
              criterio.tipo == "Critério de Densidade Informacional"
            ) {
              criterio.relacoes.map(rel => delete rel.titulo);
            }
          });

          this.adicionarUIs(clone_nova_classe);
          this.relacoes_simetricas(clone_nova_classe);

          clone_nova_classe.relacoes.map(
            item => delete item.serieRelacionada.titulo
          );

          this.classes.push(clone_nova_classe);

          this.dialogState = false;
          this.apagar();
        } else {
          this.isMultiple = false;
          this.panels = [0, 0, 0];
          this.recolherErros();
        }
      }, 1);
    }
  },
  beforeDestroy() {
    this.$emit('limpar_copia');
  }
};
