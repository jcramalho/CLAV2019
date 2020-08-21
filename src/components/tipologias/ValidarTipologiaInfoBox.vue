<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn
      @click="validarTipologia"
      rounded
      class="white--text"
      :class="{
        'px-8': $vuetify.breakpoint.lgAndUp,
        'px-2': $vuetify.breakpoint.mdAndDown
      }"
      id="default-button"
    >
      <unicon
        name="validar-icon"
        width="20"
        height="20"
        viewBox="0 0 20.709 20.696"
        fill="#ffffff"
      />
      <p class="ml-2">Validar</p>
    </v-btn>
    <!-- Erros na Validação ....................... -->
    <v-dialog v-model="dialog" width="80%">
      <v-card dark class="info-card">
        <v-card-title class="headline mb-4">
          Erros detetados na validação: {{ mensagensErro.length }}
        </v-card-title>
        <v-card-text class="font-weight-medium">
          <v-row v-for="(m, i) in mensagensErro" :key="i">
            <v-col cols="3">
              <div class="info-label px-3">{{ m.sobre }}</div>
            </v-col>
            <v-col>
              <div class="info-content px-3">{{ m.mensagem }}</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-4"
            rounded
            dark
            elevation="0"
            class="px-4"
            @click="dialog = false"
          >
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Validação não detetou erros ........... -->
    <v-row justify-center>
      <v-dialog v-model="dialogSemErros" persistent max-width="60%">
        <v-card dark class="info-card">
          <v-card-title class="headline mb-2">Validação sem erros</v-card-title>
          <div class="info-content px-3 mx-6 mb-2">
            <v-card-text class="pa-2 px-4 font-weight-medium">
              <p>A informação introduzida não apresenta erros.</p>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-4"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="dialogSemErros = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: ["t", "acao", "original"],
  data() {
    return {
      dialog: false,
      dialogSemErros: false,

      mensagensErro: []
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    }
  },

  methods: {
    async validarTipologiaCriacao() {
      let numeroErros = 0;

      // Designação
      if (this.t.designacao === "" || this.t.designacao === null) {
        this.mensagensErro.push({
          sobre: "Nome da Tipologia",
          mensagem: "O nome da tipologia não pode ser vazio."
        });
        numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/tipologias/designacao?valor=" +
              encodeURIComponent(this.t.designacao)
          );
          if (existeDesignacao.data) {
            this.mensagensErro.push({
              sobre: "Nome da Tipologia",
              mensagem: "Nome da tipologia já existente na BD."
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da designação."
          });
        }
      }

      // Sigla
      if (this.t.sigla === "" || this.t.sigla === null) {
        this.mensagensErro.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia."
        });
        numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "get",
            "/tipologias/sigla?valor=" + encodeURIComponent(this.t.sigla)
          );
          if (existeSigla.data) {
            this.mensagensErro.push({
              sobre: "Sigla",
              mensagem: "Sigla já existente na BD."
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da sigla."
          });
        }
      }

      return numeroErros;
    },

    async validarTipologiasAlteracao(dados) {
      let numeroErros = 0;

      // Designação
      if (dados.designacao === "" || dados.designacao === null) {
        this.mensagensErro.push({
          sobre: "Nome da Tipologia",
          mensagem: "O nome da tipologia não pode ser vazio."
        });
        numeroErros++;
      } else if (dados.designacao !== undefined) {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/tipologias/designacao?valor=" +
              encodeURIComponent(dados.designacao)
          );
          if (existeDesignacao.data) {
            this.mensagensErro.push({
              sobre: "Nome da Tipologia",
              mensagem: "Nome da tipologia já existente na BD."
            });
            numeroErros++;
          }
        } catch (err) {
          numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da designação."
          });
        }
      }

      return numeroErros;
    },

    async validarTipologia() {
      let erros = 0;
      let dataObj = JSON.parse(JSON.stringify(this.t));

      switch (this.acao) {
        case "Criação":
          erros = await this.validarTipologiaCriacao();
          break;

        case "Alteração":
          for (const key in dataObj) {
            if (
              typeof dataObj[key] === "string" &&
              dataObj[key] === this.original[key]
            ) {
              if (key !== "sigla") delete dataObj[key];
            }
          }

          erros = await this.validarTipologiasAlteracao(dataObj);
          break;

        default:
          break;
      }

      if (erros > 0) {
        this.dialog = true;
      } else {
        this.dialogSemErros = true;
      }
    },

    limpaErros: function() {
      this.mensagensErro = [];
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
</style>
