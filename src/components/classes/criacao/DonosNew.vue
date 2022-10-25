<template>
  <v-row class="ma-2 indigo lighten-5" align="center">
    <v-col cols="3">
      <div class="info-label">Nova entidade</div>
      <v-btn small rounded class="info" @click="newDono">
        Adicionar
        <v-icon small right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="9">
      <v-form v-model="valid">
        <v-row>
          <v-col>
            <v-text-field v-model="sigla" label="Sigla" required></v-text-field>
          </v-col>

          <v-col>
            <v-text-field v-model="sioe" label="SIOE"></v-text-field>
          </v-col>

          <v-col>
            <v-text-field v-model="designacao" label="Designação" required></v-text-field>
          </v-col>

          <v-col>
            <v-select
              prefix="Internacional: "
              item-text="label"
              item-value="value"
              v-model="internacional"
              :items="simNao"
              dense
              solo
              hide-details
            />
          </v-col>
        </v-row>
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

  data: function () {
    return {
      erroValidacao: false,
      mensagensErro: [],
      valid: false,
      sigla: "",
      sioe: "",
      siglaRules: [(v) => !!v || "A Sigla é um campo obrigatório."],
      designacao: "",
      designacaoRules: [(v) => !!v || "A Designação é obrigatória."],
      internacional: "Nao",
      simNao: [
        {
          label: "Sim",
          value: "Sim",
        },
        {
          label: "Não",
          value: "Nao",
        },
      ],
    };
  },

  methods: {
    fecharErros: function () {
      this.mensagensErro = [];
      this.erroValidacao = false;
    },

    validaSigla: function (s) {
      var res = true;
      if (s == "") {
        this.mensagensErro.push("A sigla não pode ser vazia!");
        res = false;
      } else if (this.entidades.filter((e) => e.sigla == s).length > 0) {
        this.mensagensErro.push("Sigla já existente na BD.");
        res = false;
      }
      return res;
    },

    validaDesignacao: function (d) {
      var res = true;
      if (d == "") {
        this.mensagensErro.push("A designação não pode ser vazia!");
        res = false;
      } else if (this.entidades.filter((e) => e.designacao == d).length > 0) {
        this.mensagensErro.push("Designação já existente na BD.");
        res = false;
      }
      return res;
    },

    newDono: function () {
      if (this.validaSigla(this.sigla) && this.validaDesignacao(this.designacao)) {
        var entidade = {
          estado: "Nova",
          id: "ent_" + this.sigla,
          sigla: this.sigla,
          tipo: "Entidade",
          sioe: this.sioe,
          designacao: this.designacao,
          internacional: this.internacional,
        };
        this.sigla = "";
        this.sioe = "";
        this.designacao = "";
        this.internacional = "Nao";
        this.$emit("newEntidade", entidade);
      } else {
        this.erroValidacao = true;
      }
    },
  },
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
