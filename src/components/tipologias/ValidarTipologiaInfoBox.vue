<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="indigo darken-3" @click="validarTipologia">Validar Tipologia</v-btn>

    <!-- Erros na Validação ....................... -->
    <v-dialog v-model="dialog" width="70%">
      <v-card>
        <v-card-title>Erros detetados na validação: {{ mensagensErro.length }}</v-card-title>
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
          <v-btn class="red darken-4" dark @click="dialog = false">Fechar</v-btn>
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
          <v-btn class="indigo accent-4" dark @click="dialogSemErros = false">Fechar</v-btn>
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
    async validarTipologiaCriacao() {
      // Designação
      if (this.t.designacao == "" || this.t.designacao == null) {
        this.mensagensErro.push({
          sobre: "Nome da Tipologia",
          mensagem: "O nome da tipologia não pode ser vazio."
        });
        this.numeroErros++;
      } else {
        try {
          let existeDesignacao = await this.$request(
            "get",
            "/api/tipologias/designacao/" +
              encodeURIComponent(this.t.designacao)
          );
          if (existeDesignacao.data) {
            this.mensagensErro.push({
              sobre: "Designação",
              mensagem: "Designação já existente na BD."
            });
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da designação."
          });
        }
      }

      // Sigla
      if (this.t.sigla == "" || this.t.sigla == null) {
        this.mensagensErro.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia."
        });
        this.numeroErros++;
      } else {
        try {
          let existeSigla = await this.$request(
            "get",
            "/api/tipologias/sigla/" + encodeURIComponent(this.t.sigla)
          );
          if (existeSigla.data) {
            this.mensagensErro.push({
              sobre: "Sigla",
              mensagem: "Sigla já existente na BD."
            });
            this.numeroErros++;
          }
        } catch (err) {
          this.numeroErros++;
          this.mensagensErro.push({
            sobre: "Acesso à Ontologia",
            mensagem: "Não consegui verificar a existência da sigla."
          });
        }
      }
    },

    validarTipologiaAlteracao() {
      // Designação
      if (this.t.designacao == "" || this.t.designacao == null) {
        this.mensagensErro.push({
          sobre: "Nome da Tipologia",
          mensagem: "O nome da tipologia não pode ser vazio."
        });
        this.numeroErros++;
      }

      // Sigla
      if (this.t.sigla == "" || this.t.sigla == null) {
        this.mensagensErro.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia."
        });
        this.numeroErros++;
      }
    },

    async validarTipologia() {
      switch (this.acao) {
        case "Criação":
          await this.validarTipologiaCriacao();
          break;

        case "Alteração":
          this.validarTipologiaAlteracao();
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
  margin: 5px;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #283593;
  border-radius: 3px;
}
</style>
