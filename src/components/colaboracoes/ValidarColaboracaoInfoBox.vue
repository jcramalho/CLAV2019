<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="indigo darken-3" @click="validarCredito"
      >Validar Colaboração</v-btn
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
    async validarCreditoAll() {
      // Nome
      if (this.t.nome == "" || this.t.nome == null) {
        this.mensagensErro.push({
          sobre: "Nome",
          mensagem: "O nome não pode ser vazio."
        });
        this.numeroErros++;
      }

      // Filiação
      if (this.t.filiacao == "" || this.t.filiacao == null) {
        this.mensagensErro.push({
          sobre: "Filiação",
          mensagem: "A filiação não pode ser vazia."
        });
        this.numeroErros++;
      }

      // Função
      if (this.t.funcao == "" || this.t.funcao == null) {
        this.mensagensErro.push({
          sobre: "Função",
          mensagem: "A função não pode ser vazia."
        });
        this.numeroErros++;
      }
    },

    async validarCredito() {
      switch (this.acao) {
        case "Criação":
          this.validarCreditoAll();
          break;

        case "Alteração":
          this.validarCreditoAll();
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
