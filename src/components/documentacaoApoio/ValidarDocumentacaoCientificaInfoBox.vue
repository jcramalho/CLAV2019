<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn
      dark
      rounded
      class="indigo darken-3"
      @click="validarDocumentacaoCientifica"
      >Validar Documentacao Científica</v-btn
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
    async validarDocumentacaoCientificaAll() {
      this.numeroErros = 0;
      // Tipo
      if (this.t.classe == "" || this.t.classe == null) {
        this.mensagensErro.push({
          sobre: "Tipo",
          mensagem: "O tipo não pode ser vazio."
        });
        this.numeroErros++;
      }
      // Titulo
      if (this.t.titulo == "" || this.t.titulo == null) {
        this.mensagensErro.push({
          sobre: "Título",
          mensagem: "O título não pode ser vazio."
        });
        this.numeroErros++;
      }
      // Formato
      if (
        this.t.url == "" ||
        this.t.url == null ||
        (this.t.ficheiro == null && this.t.url == "FICHEIRO")
      ) {
        this.mensagensErro.push({
          sobre: "Formato",
          mensagem: "É obrigatório submeter um url ou um ficheiro."
        });
        this.numeroErros++;
      }
      // Local
      if (this.t.local == "" || this.t.local == null) {
        this.mensagensErro.push({
          sobre: "Local",
          mensagem: "O local não pode ser vazio."
        });
        this.numeroErros++;
      }
      // Ano
      if (this.t.ano == "" || this.t.ano == null) {
        this.mensagensErro.push({
          sobre: "Ano",
          mensagem: "O ano não pode ser vazio."
        });
        this.numeroErros++;
      }
      // Autores
      if (this.acao == "Criação") {
        for (let i = 0; i < this.t.autores.length; i++) {
          if (this.t.autores[i].nome == "" || this.t.autores[i].nome == null) {
            this.mensagensErro.push({
              sobre: "Autores",
              mensagem: "O autor na posição " + i + " não pode ser vazio."
            });
            this.numeroErros++;
          }
        }
      } else if (this.acao == "Alteração") {
        for (let i = 0; i < this.t.autores.length; i++) {
          if (this.t.autores[i] == "" || this.t.autores[i] == null) {
            this.mensagensErro.push({
              sobre: "Autores",
              mensagem: "O autor na posição " + i + " não pode ser vazio."
            });
            this.numeroErros++;
          }
        }
      }
    },

    async validarDocumentacaoCientifica() {
      switch (this.acao) {
        case "Criação":
          this.validarDocumentacaoCientificaAll();
          break;
        case "Alteração":
          this.validarDocumentacaoCientificaAll();
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
