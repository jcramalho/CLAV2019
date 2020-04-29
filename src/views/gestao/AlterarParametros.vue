<template>
  <v-container fluid>
    <v-row row wrap justify-center>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="indigo darken-4" dark>
            <v-toolbar-title>Alterar Parâmetros</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-autocomplete
                :items="parametros"
                label="Parâmetro a alterar"
                v-model="parametro"
                :rules="regraParametro"
                required
                @change="quandoAltera"
              >
              </v-autocomplete>

              <div v-if="parametro != ''">
                <v-row row wrap>
                  <v-col cols="6">
                    <v-text-field
                      v-model="valor"
                      label="Valor"
                      :rules="regraValor"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="6">
                    <v-autocomplete
                      v-if="intervalo != ''"
                      :items="intervalos"
                      label="Intervalo de tempo"
                      v-model="intervalo"
                      :rules="regraIntervalo"
                      required
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>
              </div>
            </v-form>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="indigo darken-4" dark @click="cancelar">
                Cancelar
              </v-btn>
              <v-btn color="indigo darken-4" dark @click="alterar">
                Alterar
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-alert :value="text != ''" :type="alertType">
          {{ text }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => {
    return {
      parametros: [],
      parametrosDict: [],
      parametro: "",
      valorTotal: "",
      valor: "",
      regraParametro: [v => !!v || "Parâmetro a alterar é obrigatório."],
      regraValor: [v => !!v || "Valor é obrigatório."],
      regraIntervalo: [v => !!v || "Intervalo de tempo é obrigatório."],
      text: "",
      alertType: "success",
      intervalos: [
        { text: "Ano(s)", value: "y" },
        { text: "Dia(s)", value: "d" },
        { text: "Hora(s)", value: "h" },
        { text: "Minuto(s)", value: "m" },
        { text: "Segundo(s)", value: "s" },
        { text: "Milisegundo(s)", value: "ms" }
      ],
      intervalo: ""
    };
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/parametros");
      this.parametrosDict = response.data;
      this.parametros = Object.entries(this.parametrosDict).map(([k, v]) => {
        return {
          text: v.desc,
          value: k
        };
      });
    } catch (erro) {
      if (erro.response && erro.response.data) {
        this.text = erro.response.data[0].msg || erro.response.data;
      } else {
        this.text = erro;
      }
      this.alertType = "error";
    }
  },

  methods: {
    cancelar() {
      this.$router.push("/");
    },
    quandoAltera() {
      this.valorTotal = this.parametrosDict[this.parametro].valor;
      if (this.parametro == "userExpires" || this.parametro == "keyExpires") {
        this.valor = this.valorTotal.slice(0, -1);
        this.intervalo = this.valorTotal.slice(-1);
      }
    },
    async alterar() {
      if (this.$refs.form.validate()) {
        try {
          var novoValor = this.valor + this.intervalo;
          await this.$request("put", "/parametros/" + this.parametro, {
            valor: novoValor
          });

          this.parametrosDict[this.parametro].valor = novoValor;
          this.text = `${this.parametro} alterado com sucesso`;
          this.alertType = "success";
        } catch (erro) {
          if (erro.response && erro.response.data) {
            this.text = erro.response.data[0].msg || erro.response.data;
          } else {
            this.text = erro;
          }
          this.alertType = "error";
        }
      }
    }
  }
};
</script>
