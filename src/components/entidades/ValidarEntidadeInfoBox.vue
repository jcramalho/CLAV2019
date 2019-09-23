<template>
  <v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn dark rounded class="green darken-3" @click="validarEntidade">Validar Entidade</v-btn>

    <!-- Erros na Validação ....................... -->
    <v-dialog v-model="dialog" width="80%">
      <v-card>
        <v-card-title class="headline">Erros detetados na validação: {{ mensagensErro.length }}</v-card-title>
        <v-card-text>
          <v-row v-for="(m, i) in mensagensErro" :key="i">
            <v-col cols="2">
              <div class="info-label">{{ m.sobre }}</div>
            </v-col>
            <v-col>
              <v-text-field outlined disabled :value="m.mensagem" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="red darken-4" right rounded dark @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Validação não detetou erros ........... -->
    <v-dialog v-model="dialogSemErros" width="30%">
      <v-card>
        <v-card-title class="headline">Validação sem erros</v-card-title>
        <v-card-text>
          <p>A informação introduzida não apresenta erros.</p>
        </v-card-text>
        <v-card-actions>
          <v-btn class="green darken-1" dark text @click="dialogSemErros = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>
const lhost = require("@/config/global").host;
const axios = require("axios");

export default {
  props: ["e"],
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
    validarEntidade: async function() {
      let i = 0;

      // Designação
      if (this.e.designacao == "") {
        this.mensagensErro.push({
          sobre: "Nome da Entidade",
          mensagem: "O nome da entidade não pode ser vazio."
        });
        this.numeroErros++;
      }
      // else {
      //   // TODO: Criar rota na API
      //   try {
      //     let existeDesignacao = await axios.post(
      //       lhost + "/api/entidades/verificarDesignacao",
      //       { designacao: this.e.designacao }
      //     );
      //     if (existeDesignacao.data) {
      //       this.mensagensErro.push({
      //         sobre: "Designação",
      //         mensagem: "Designação já existente na BD."
      //       });
      //       this.numeroErros++;
      //     }
      //   } catch (err) {
      //     this.numeroErros++;
      //     this.mensagensErro.push({
      //       sobre: "Acesso à Ontologia",
      //       mensagem: "Não consegui verificar a existência da designação."
      //     });
      //   }
      // }

      // Sigla
      if (this.e.sigla == "") {
        this.mensagensErro.push({
          sobre: "Sigla",
          mensagem: "A sigla não pode ser vazia."
        });
        this.numeroErros++;
      }
      // else {
      //   // TODO: Criar rota na API
      //   try {
      //     let existeSigla = await axios.post(
      //       lhost + "/api/entidades/verificarSigla",
      //       { sigla: this.e.sigla }
      //     );
      //     if (existeDesignacao.data) {
      //       this.mensagensErro.push({
      //         sobre: "Sigla",
      //         mensagem: "Sigla já existente na BD."
      //       });
      //       this.numeroErros++;
      //     }
      //   } catch (err) {
      //     this.numeroErros++;
      //     this.mensagensErro.push({
      //       sobre: "Acesso à Ontologia",
      //       mensagem: "Não consegui verificar a existência da sigla."
      //     });
      //   }
      // }

      // Internacional
      if (this.e.internacional == "") {
        this.mensagensErro.push({
          sobre: "Internacional",
          mensagem: "O campo internacional tem de ter uma opção."
        });
        this.numeroErros++;
      }

      // Internacional
      if (this.e.sioe == "") {
        this.mensagensErro.push({
          sobre: "SIOE",
          mensagem: "O campo SIOE não pode ser vazio."
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

<style>
.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
