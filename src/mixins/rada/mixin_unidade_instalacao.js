export default {
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    menu1: false,
    menu2: false,
    classes_processadas: [],
    erros: [],
    tituloClasse: null,
    existe_erros: false,
    headers: [
      {
        text: "Série/Subsérie Associada",
        align: "center",
        value: "codigo",
        width: "95%",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        value: "edicao",
        align: "center",
        sortable: false,
        width: "5%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ],
    cod: null,
    alertOn: false,
    iscodvalido: false,
    tipoClasse: null
  }),
  watch: {
    cod(novo) {
      let c = this.classes.find(e => e.codigo == novo);

      if (c != undefined && (c.tipo == "Série" || c.tipo == "Subsérie")) {
        this.iscodvalido = true;
        this.tituloClasse = c.titulo;
        this.tipoClasse = c.tipo;
      } else {
        this.iscodvalido = false;
      }
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
  },
  methods: {
    recolherErros(UI) {
      this.existe_erros = true;

      if (!UI.titulo) {
        this.erros.push("Título;");
      }

      if (!UI.dataInicial || !UI.dataFinal) {
        this.erros.push("Datas;");
      }

      if (!!UI.classesAssociadas[0] == false) {
        this.erros.push("Classes Associadas;");
      }

      if (!Boolean(this.erros[0])) {
        this.erros.push("Datas Inválidas;");
      }
    },
    async adicionarClasseUI(UI) {
      if (this.$refs.addRel.validate()) {
        if (!(await this.validateUI(UI))) {
          UI.classesAssociadas.push({
            codigo: this.cod,
            tipo: this.tipoClasse,
            titulo: this.tituloClasse
          });

          this.$refs.addRel.reset();
        } else {
          this.alertOn = true;

          setTimeout(() => {
            this.alertOn = false;
          }, 3000);
        }
      }
    },
    validateUI(UI) {
      return UI.classesAssociadas.some(el => {
        return el.codigo == this.cod;
      });
    },
    eCodigoClasseValido(v) {
      if (
        this.classes.some(e => e.codigo == v && e.dataInicial === undefined)
      ) {
        return "Impossível criar associação, altere o código!";
      } else {
        return false;
      }
    },
    data_final_valida(v, UI) {
      if (!!v) {
        if (UI.dataInicial != null) {
          let data_inicial = new Date(UI.dataInicial);
          let data_final = new Date(v);

          if (data_inicial > data_final) {
            return "Data final inválida. Data selecionada é anterior à data inicial.";
          }
        }
        return true;
      }
      return false;
    }
  },
  created() {
    this.classes_processadas = this.classes
      .filter(e => e.tipo == "Série" || e.tipo == "Subsérie")
      .map(e => {
        return {
          codigo: e.codigo,
          searchField: e.codigo + " - " + e.titulo,
          tipo: e.tipo
        };
      });
  }
};
