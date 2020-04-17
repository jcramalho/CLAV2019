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
              <v-text-field :rules="siglaRules" v-model="sigla" label="Sigla"></v-text-field>
            </v-col>

            <v-col>
              <v-text-field :rules="[v => /^[0-9]*$/.test(v) || 'Apenas são aceites caracteres numéricos.']" v-model="sioe" label="SIOE"></v-text-field>
            </v-col>
            <v-col>
              <v-menu
                ref="menu2"
                v-model="data_menu"
                :close-on-content-click="false"
                :return-value.sync="data"
                transition="scale-transition"
                offset-y
                max-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="data"
                    label="Data"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                    clearable
                  ></v-text-field>
                </template>
                <v-date-picker
                  full-width
                  v-model="data"
                  color="amber accent-3"
                  locale="pt"
                  :max="new Date().toISOString().split('T')[0]"
                >
                  <v-spacer></v-spacer>
                  <v-btn text @click="data_menu = false">
                    <v-icon>keyboard_backspace</v-icon>
                  </v-btn>
                  <v-btn text @click="$refs.menu2.save(data)">
                    <v-icon>check</v-icon>
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field :rules="designacaoRules" v-model="designacao" label="Designação"></v-text-field>
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
              <v-alert dismissible dense text type="error">Entidade já existe!</v-alert>
            </v-col>
          </v-row>
          <v-row v-if="sucessOn">
            <v-col>
              <v-alert dismissible dense text type="success">Entidade adicionada com sucesso!</v-alert>
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
      data_menu: false,
      data: null,
      alertOn: false,
      sucessOn: false,
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
    newEntidade: async function() {
      this.alertOn = false;
      this.sucessOn = false;

      if (this.$refs.form.validate()) {
        if (!(await this.validaEntidade())) {
          if (this.sioe == null) {
            this.sioe = "";
          }
          let entidade = {
            estado: "Nova",
            id: "ent_" + this.sigla,
            sigla: this.sigla,
            sioe: this.sioe,
            designacao: this.designacao,
            internacional: this.internacional,
            dataCriacao: this.data
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
