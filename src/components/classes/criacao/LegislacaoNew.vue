<template>
  <v-row class="ma-2 indigo lighten-5">
    <v-col cols="2">
      <div class="info-label">Legislação nova:</div>
      <v-btn small dark rounded color="indigo darken-2" @click="newLegislacao">
        Adicionar
        <v-icon small dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-form v-model="valid">
        <v-container>
          <v-layout>
            <v-flex xs12 md3 v-if="listaTipos.length > 0">
              <v-select
                item-text="label"
                item-value="value"
                v-model="tipo"
                :items="listaTipos"
                label="Tipo"
              />
            </v-flex>

            <v-flex xs12 md3 v-else>
              <v-text-field v-model="tipo" label="Tipo"></v-text-field>
            </v-flex>

            <v-flex xs12 md3>
              <v-text-field v-model="numero" label="Número"></v-text-field>
            </v-flex>

            <v-flex xs12 md3>
              <v-text-field v-model="sumario" label="Sumário"></v-text-field>
            </v-flex>

            <v-flex xs12 md3>
              <v-text-field
                v-model="data"
                label="Data: AAAA-MM-DD"
                mask="####-##-##"
              />
            </v-flex>
          </v-layout>
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
  props: ["legislacao"],

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
        "/api/vocabularios/vc_tipoDiplomaLegislativo"
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
        var legs = await this.$request("get", "/api/legislacao");
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

    newLegislacao: async function() {
      if (
        this.validaTipo(this.tipo) &&
        this.validaNumero(this.numero) &&
        (await this.validaDups(this.tipo, this.numero)) &&
        this.validaDupsLocais(this.tipo, this.numero)
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
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
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
