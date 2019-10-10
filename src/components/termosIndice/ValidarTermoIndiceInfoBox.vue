<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="indigo darken-4" @click="validarTI">Validar Termo de Índice</v-btn>

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
  props: ["ti"],
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
    validarTI: async function() {
      let i = 0;

      // Termo
      if (this.ti.termo == "") {
        this.mensagensErro.push({
          sobre: "Termo de Índice",
          mensagem: "O termo de índice não pode ser vazio."
        });
        this.numeroErros++;
      } else {
        try {
          let existeTI = await this.$request(
            "post",
            "/api/termosIndice/verificarTermo",
            { termo: this.ti.termo }
          );
          if (existeTI.data) {
            this.mensagensErro.push({
              sobre: "Termo de Índice",
              mensagem: "O termo de índice já existente na BD."
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

      if (this.ti.idClasse == "") {
        this.mensagensErro.push({
          sobre: "Processo",
          mensagem: "Tem de selecionar um processo."
        });
        this.numeroErros++;
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
