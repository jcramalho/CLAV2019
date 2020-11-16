<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row>
      <v-col cols="12" lg="2" style="text-align: center;" class="mb-n6">
        <div class="info-label">
          Legislação nova
        </div>
        <v-tooltip top color="info" open-delay="600">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              color="success"
              icon
              @click="newLegislacao"
              class="mb-4"
            >
              <unicon
                name="adicionar-icon"
                width="15"
                height="15"
                viewBox="0 0 20.71 20.71"
                fill="#4caf50"
              />
            </v-btn>
          </template>
          <span>Adicionar nova legislação</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12" lg="10" class="px-4">
        <v-form v-model="valid">
          <v-row class="info-content mx-0 mb-1 pa-4" style="min-height: 60px;">
            <v-col cols="12" sm="6" v-if="listaTipos.length > 0" class="mt-n6">
              <v-select
                item-text="label"
                item-value="value"
                v-model="tipo"
                :items="listaTipos"
                label="Tipo"
                color="blue darken-3"
              />
            </v-col>

            <v-col cols="12" sm="6" class="mt-n6" v-else>
              <v-text-field
                v-model="tipo"
                label="Tipo"
                color="blue darken-3"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" class="mt-n6">
              <v-text-field
                v-model="numero"
                label="Número"
                color="blue darken-3"
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="mt-n6">
              <v-textarea
                v-model="sumario"
                label="Sumário"
                auto-grow
                hide-details
                rows="1"
                color="blue darken-3"
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6" class="mt-n6">
              <SelecionarData
                :d="data"
                :label="'Data: AAAA-MM-DD'"
                @dataSelecionada="data = $event"
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
import SelecionarData from "@/components/generic/SelecionarData";

export default {
  props: ["legislacao"],

  components: { SelecionarData },

  data: function() {
    return {
      listaTipos: [],
      erroValidacao: false,
      mensagensErro: [],
      valid: false,
      tipo: "",
      numero: "",
      sumario: "",
      data: ""
    };
  },

  created: async function() {
    try {
      var tipos = await this.$request(
        "get",
        "/vocabularios/vc_tipoDiplomaLegislativo"
      );
      this.listaTipos = tipos.data.map(t => {
        return { label: t.termo, value: t.termo };
      });
    } catch (e) {
      return e;
    }
  },

  methods: {
    fecharErros: function() {
      this.mensagensErro = [];
      this.erroValidacao = false;
    },

    validaTipo: function(t) {
      var res = true;
      if (t == "") {
        this.mensagensErro.push(
          "O tipo não pode ser vazio, selecione um valor!"
        );
        res = false;
      }
      return res;
    },

    validaNumero: function(n) {
      var res = true;
      if (n == "") {
        this.mensagensErro.push(
          "O número não pode ser vazio, introduza um valor!"
        );
        res = false;
      }
      return res;
    },

    validaDups: async function(t, n) {
      try {
        var legs = await this.$request("get", "/legislacao");
        var test = legs.data.filter(l => l.tipo == t && l.numero == n);
        if (test.length > 0) {
          this.mensagensErro.push(
            "Já existe um documento legislativo na BD com o mesmo tipo e número!"
          );
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return false;
      }
    },

    validaDupsLocais: function(t, n) {
      var test = this.legislacao.filter(l => l.tipo == t && l.numero == n);
      if (test.length > 0) {
        this.mensagensErro.push(
          "Já foi criado um item com esse tipo e número!"
        );
        return false;
      } else {
        return true;
      }
    },

    validaSumario: function(s) {
      if (s != "") return true;
      else {
        this.mensagensErro.push("O sumário não pode ficar vazio!");
        return false;
      }
    },

    validaData: function(d) {
      if (d != "") return true;
      else {
        this.mensagensErro.push("A data não pode ficar vazia!");
        return false;
      }
    },

    newLegislacao: async function() {
      if (
        this.validaTipo(this.tipo) &&
        this.validaNumero(this.numero) &&
        (await this.validaDups(this.tipo, this.numero)) &&
        this.validaDupsLocais(this.tipo, this.numero) &&
        this.validaSumario(this.sumario) &&
        this.validaData(this.data)
      ) {
        var legislacao = {
          tipo: this.tipo,
          id: "...",
          numero: this.numero,
          sumario: this.sumario,
          data: this.data
        };
        this.tipo = "";
        this.numero = "";
        this.sumario = "";
        this.data = "";
        this.$emit("newLegislacao", legislacao);
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
