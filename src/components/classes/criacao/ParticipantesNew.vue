<template>
  <v-row class="ma-2 indigo lighten-5">
    <v-col cols="3">
      <div class="info-label">Participante novo</div>
      <v-btn small rounded class="success" @click="newEntidade">
        Adicionar
        <v-icon small right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="9">
      <v-form v-model="valid" ref="form">
        <v-row>
          <v-col>
            <v-text-field v-model="sigla" label="Sigla" hide-details dense></v-text-field>
          </v-col>

          <v-col>
            <v-text-field v-model="sioe" label="SIOE" hide-details dense></v-text-field>
          </v-col>

          <v-col>
            <v-text-field
              v-model="designacao"
              label="Designação"
              hide-details
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              prefix="Intervenção: "
              item-text="label"
              item-value="value"
              v-model="intervencao"
              :items="tiposIntervencao"
              label="Intervenção"
              solo
              dense
              hide-details
            />
          </v-col>

          <v-col>
            <v-select
              prefix="Internacional: "
              item-text="label"
              item-value="value"
              v-model="internacional"
              :items="simNao"
              solo
              dense
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
      designacao: "",
      internacional: "Nao",
      intervencao: "Indefinido",
      tiposIntervencao: [
        { label: "Por selecionar", value: "Indefinido" },
        { label: "Apreciar", value: "Apreciar" },
        { label: "Assessorar", value: "Assessorar" },
        { label: "Comunicar", value: "Comunicar" },
        { label: "Decidir", value: "Decidir" },
        { label: "Executar", value: "Executar" },
        { label: "Iniciar", value: "Iniciar" },
      ],
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

    validaIntervencao: function (i) {
      var res = true;
      if (i == "Indefinido") {
        this.mensagensErro.push("Tem de definir um tipo de intervenção!");
        res = false;
      }
      return res;
    },

    newEntidade: function () {
      if (
        this.validaSigla(this.sigla) &&
        this.validaDesignacao(this.designacao) &&
        this.validaIntervencao(this.intervencao)
      ) {
        var entidade = {
          estado: "Nova",
          id: "ent_" + this.sigla,
          sigla: this.sigla,
          tipo: "Entidade",
          sioe: this.sioe,
          designacao: this.designacao,
          internacional: this.internacional,
          intervencao: this.intervencao,
        };
        this.sigla = "";
        this.sioe = "";
        this.designacao = "";
        this.internacional = "Nao";
        this.intervencao = "Indefinido";
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
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  font-weight: bold;
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
