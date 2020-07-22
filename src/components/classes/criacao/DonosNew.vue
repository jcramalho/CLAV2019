<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <v-col cols="12" lg="2" style="text-align: center;" class="mb-n6">
        <div class="info-label">
          Entidade nova
        </div>
        <v-tooltip top color="info" open-delay="600">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="success" icon @click="newDono" class="mb-4">
              <unicon
                name="adicionar-icon"
                width="15"
                height="15"
                viewBox="0 0 20.71 20.71"
                fill="#4caf50"
              />
            </v-btn>
          </template>
          <span>Adicionar nova entidade</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" lg="10" class="px-4">
        <v-form v-model="valid">
          <v-row class="info-content mx-0 mb-1 pa-4" style="min-height: 60px;">
            <v-col cols="12" sm="6" class="mt-n4">
              <v-text-field
                v-model="sigla"
                label="Sigla"
                required
                color="blue darken-3"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" class="mt-n4">
              <v-text-field
                v-model="sioe"
                label="SIOE"
                color="blue darken-3"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n7">
              <v-textarea
                v-model="designacao"
                label="Designação"
                required
                auto-grow
                hide-details
                rows="1"
                color="blue darken-3"
              ></v-textarea>
            </v-col>

            <v-col cols="12" md="6" class="mt-n4">
              <v-select
                prefix="Internacional: "
                item-text="label"
                item-value="value"
                v-model="internacional"
                :items="simNao"
                label="Internacional"
                hide-details
                single-line
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>

      <v-snackbar v-model="erroValidacao" :color="'warning'" :timeout="60000">
        <div v-for="(m, i) in mensagensErro" :key="i">{{ m }}</div>
        <v-btn icon color="white" @click="fecharErros">
          <unicon
            name="remove-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
        </v-btn>
      </v-snackbar>
    </v-row>
  </v-container>
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

    newDono: function() {
      if (
        this.validaSigla(this.sigla) &&
        this.validaDesignacao(this.designacao)
      ) {
        var entidade = {
          estado: "Nova",
          id: "ent_" + this.sigla,
          sigla: this.sigla,
          tipo: "Entidade",
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
<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
