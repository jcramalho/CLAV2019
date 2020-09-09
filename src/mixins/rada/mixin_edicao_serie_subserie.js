export default {
  data: () => ({
    existe_erros: false,
    erros: [],
    toDelete: false,
    panels: [0, 0, 0],
    isMultiple: false,
    classesHierarquia: []
  }),
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

        if (criterio != null && criterio.relacoes.length > 0) {
          let relacaoCriterio = criterio.relacoes.find(
            e => e.codigo == classe_relacionada.codigo
          );
          
          this.$set(relacaoCriterio, "titulo", classe_relacionada.titulo);
        }
      }
    },
    eliminarClasse() {
      let classe = this.classes.find(
        e => e.codigo == this.treeview_object.codigo
      );

      this.$emit("remover", classe);
      this.dialogState = false;
    },
    atualizar(classe) {
      this.existe_erros = false;
      this.erros = [];
      this.isMultiple = true;
      this.panels = [0, 1, 2];

      setTimeout(() => {
        if (
          this.$refs.form.validate() &&
          !(
            !!classe.UIs[0] == false &&
            (!!classe.dataInicial == false || !!classe.dataFinal == false)
          )
        ) {
          this.$emit("atualizacao", classe);
          this.dialogState = false;
        } else {
          this.isMultiple = false;
          this.panels = [0, 0, 0];
          this.recolherErros();
        }
      }, 1);
    }
  },
  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      }
    }
  }
};
