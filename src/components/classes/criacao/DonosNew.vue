<template>
  <v-row class="ma-2 indigo lighten-5">
    <v-col cols="2">
      <div class="info-label">Entidade nova:</div>
      <v-btn small dark rounded class="indigo darken-2" @click="newEntidade">
        Adicionar
        <v-icon small dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-form v-model="valid">
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="sigla" :rules="siglaRules" label="Sigla" required></v-text-field>
            </v-col>

            <v-col>
              <v-text-field v-model="sioe" label="SIOE"></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                v-model="designacao"
                :rules="designacaoRules"
                label="Designação"
                required
              ></v-text-field>
            </v-col>

            <v-col>
              <v-select
                prefix="Internacional: "
                item-text="label"
                item-value="value"
                v-model="internacional"
                :items="simNao"
                label="Internacional"
                solo
                dense
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-col>

    <v-snackbar v-model="erroValidacao" :color="'warning'" :timeout="60000">
      <div v-for="(m, i) in mensagensErro" :key="i">{{ m }}</div>
      <v-btn dark text @click="fecharErros">Fechar</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  props: ["entidades", "entidadesReady"],

  data: function() {
    return {
      erroValidacao: false,
      mensagensErro: [],
      valid: false,
      sigla: "",
      sioe: "",
      siglaRules: [v => !!v || "A Sigla é um campo obrigatório."],
      designacao: "",
      designacaoRules: [v => !!v || "A Designação é obrigatória."],
      internacional: "Nao",
      simNao: [
        {
          label: "Sim",
          value: "Sim"
        },
        {
          label: "Não",
          value: "Nao"
        }
      ]
    };
  },

  methods: {
    fecharErros: function() {
      this.mensagensErro = [];
      this.erroValidacao = false;
    },

    validaSigla: function(s) {
      var res = true;
      if (s == "") {
        this.mensagensErro.push("A sigla não pode ser vazia!");
        res = false;
      } else if (this.entidades.filter(e => e.sigla == s).length > 0) {
        this.mensagensErro.push("Sigla já existente na BD.");
        res = false;
      }
      return res;
    },

    validaDesignacao: function(d) {
      var res = true;
      if (d == "") {
        this.mensagensErro.push("A designação não pode ser vazia!");
        res = false;
      } else if (this.entidades.filter(e => e.designacao == d).length > 0) {
        this.mensagensErro.push("Designação já existente na BD.");
        res = false;
      }
      return res;
    },

    newEntidade: function() {
      if (
        this.validaSigla(this.sigla) &&
        this.validaDesignacao(this.designacao)
      ) {
        var entidade = {
          estado: "Nova",
          id: "ent_" + this.sigla,
          sigla: this.sigla,
          sioe: this.sioe,
          designacao: this.designacao,
          internacional: this.internacional
        };
        this.sigla = "";
        this.sioe = "";
        this.designacao = "";
        this.internacional = "Nao";
        this.$emit("newEntidade", entidade);
      } else {
        this.erroValidacao = true;
      }
    }
  }
};
</script>
<style>
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
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
