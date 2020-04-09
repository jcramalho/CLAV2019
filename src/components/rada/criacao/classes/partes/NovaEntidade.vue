<template>
  <v-row class="ma-2 indigo lighten-5">
    <v-col cols="2" md="2" sm="2">
      <div class="info-label">Criar Entidade Nova</div>
      <v-btn small dark rounded class="indigo darken-2" @click="newEntidade">
        Adicionar
        <v-icon small dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col md="10" sm="10">
      <v-form ref="form" :lazy-validation="false">
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                :rules="siglaRules"
                v-model="sigla"
                label="Sigla"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field v-model="sioe" label="SIOE"></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                :rules="designacaoRules"
                v-model="designacao"
                label="Designação"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-select
                item-text="label"
                item-value="value"
                v-model="internacional"
                :items="simNao"
                label="Internacional"
                dense
              />
            </v-col>
          </v-row>
          <v-row v-if="!!alertOn">
            <v-col>
              <v-alert dismissible dense text type="error"
                >Entidade já existe!</v-alert
              >
            </v-col>
          </v-row>
          <v-row v-if="sucessOn">
            <v-col>
              <v-alert dismissible dense text type="success"
                >Entidade adicionada com sucesso!</v-alert
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["entidades", "produtoras"],
  data: function() {
    return {
      alertOn: false,
      sucessOn: false,
      sigla: "",
      sioe: "",
      novasEntidades: [],
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
    newEntidade: async function() {
      this.alertOn = false;
      this.sucessOn = false;

      if (this.$refs.form.validate()) {
        if (!(await this.validaEntidade())) {
          let entidade = {
            estado: "Nova",
            id: "ent_" + this.sigla,
            sigla: this.sigla,
            sioe: this.sioe,
            designacao: this.designacao,
            internacional: this.internacional
          };

          let entidadeSelecionada = {
            estado: "Nova",
            id: "ent_" + this.sigla,
            sigla: this.sigla,
            sioe: this.sioe,
            designacao: this.designacao,
            internacional: this.internacional,
            searchField: this.sigla + " - " + this.designacao,
            disabled: false
          };

          this.produtoras.push(entidadeSelecionada);
          this.novasEntidades.push(entidade);
          this.entidades.push(entidade);

          this.sucessOn = true;
          this.$refs.form.reset();
        } else {
          this.alertOn = true;
        }
      }
    },
    // Provavelmente vai ter que se alterar
    validaEntidade: async function() {
      return this.entidades.some(el => {
        return el.sigla == this.sigla || el.designacao == this.designacao;
      });
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
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
