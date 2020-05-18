<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn
      dark
      rounded
      class="indigo darken-3"
      @click="validarClasseDocumentacaoApoio"
      >Validar Classe da Documentação de Apoio</v-btn
    >

    <!-- Erros na Validação ....................... -->
    <v-dialog v-model="dialog" width="70%">
      <v-card>
        <v-card-title
          >Erros detetados na validação:
          {{ mensagensErro.length }}</v-card-title
        >
        <v-card-text>
          <v-row v-for="(m, i) in mensagensErro" :key="i">
            <v-col cols="2">
              <div class="info-label">{{ m.sobre }}</div>
            </v-col>
            <v-col>
              <div class="info-content">{{ m.mensagem }}</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="red darken-4" dark @click="dialog = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Validação não detetou erros ........... -->
    <v-dialog v-model="dialogSemErros" width="30%">
      <v-card>
        <v-card-title>Validação sem erros</v-card-title>
        <v-card-text>
          <p>A informação introduzida não apresenta erros.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="indigo darken-1" dark @click="dialogSemErros = false"
            >Fechar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
export default {
  props: ["t", "acao"],

  data() {
    return {
      dialog: false,
      dialogSemErros: false,
      classes: [],
      mensagensErro: [],
      numeroErros: 0
    };
  },

  watch: {
    dialog: function(val) {
      if (!val) this.limpaErros();
    }
  },

  methods: {
    async validarClasseDocumentacaoApoioAll() {
      this.numeroErros = 0;
      // Classe
      if (this.t.classe == "" || this.t.classe == null) {
        this.mensagensErro.push({
          sobre: "Classe",
          mensagem: "A classe não pode ser vazia."
        });
        this.numeroErros++;
      }
      let index = this.classes.indexOf(this.t.classe);
      if (index > -1) {
        this.mensagensErro.push({
          sobre: "Classe",
          mensagem: "A classe já existe."
        });
        this.numeroErros++;
      }
    },

    async validarClasseDocumentacaoApoio() {
      switch (this.acao) {
        case "Criação":
          this.validarClasseDocumentacaoApoioAll();
          break;
        case "Alteração":
          this.validarClasseDocumentacaoApoioAll();
          break;

        default:
          break;
      }

      if (this.numeroErros > 0) {
        this.dialog = true;
      } else {
        this.dialogSemErros = true;
      }
    },

    limpaErros: function() {
      this.numeroErros = 0;
      this.mensagensErro = [];
    }
  },
  created: async function() {
    let response = await this.$request("get", "/documentacaoApoio/classes");
    this.classes = response.data;
  }
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
