<template>
  <div>
    <v-expansion-panels flat focusable v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate color="#dee2f8" ripple>
          <b style="color:#1a237e">Criar Nova Entidade</b>

          <template v-slot:actions>
            <v-icon color="sucess" rounded>add</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="indigo lighten-5">
          <v-card flat color="indigo lighten-5">
            <v-card-text>
              <v-form ref="form" :lazy-validation="false">
                <v-row cols="12">
                  <v-col md="3" sm="3">
                    <v-text-field :rules="siglaRules" v-model="sigla" label="Sigla"></v-text-field>
                  </v-col>

                  <v-col md="3" sm="3">
                    <v-text-field
                      :rules="[v => /^[0-9]*$/.test(v) || v == null || 'Apenas são aceites caracteres numéricos.']"
                      v-model="sioe"
                      label="SIOE"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" sm="6">
                    <v-text-field :rules="designacaoRules" v-model="designacao" label="Designação"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="4" md="4">
                    <v-menu
                      ref="menu2"
                      v-model="data_menu_2"
                      :close-on-content-click="false"
                      :return-value.sync="data_criacao"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :rules="[v => !!v || 'Campo obrigatório!']"
                          v-model="data_criacao"
                          label="Data de Criação"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          clearable
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        full-width
                        v-model="data_criacao"
                        color="amber accent-3"
                        locale="pt"
                        :max="new Date().toISOString().split('T')[0]"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="data_menu_2 = false">
                          <v-icon>keyboard_backspace</v-icon>
                        </v-btn>
                        <v-btn text @click="$refs.menu2.save(data_criacao)">
                          <v-icon>check</v-icon>
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col sm="4" md="4">
                    <v-menu
                      ref="menu1"
                      v-model="data_menu_1"
                      :close-on-content-click="false"
                      :return-value.sync="data_extincao"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :rules="[v => !!data_criacao ? data_final_valida(v) : true]"
                          v-model="data_extincao"
                          label="Data de Extinção"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          clearable
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        full-width
                        v-model="data_extincao"
                        color="amber accent-3"
                        locale="pt"
                        :max="new Date().toISOString().split('T')[0]"
                      >
                        <v-spacer></v-spacer>
                        <v-btn text @click="data_menu_1 = false">
                          <v-icon>keyboard_backspace</v-icon>
                        </v-btn>
                        <v-btn text @click="$refs.menu1.save(data_extincao)">
                          <v-icon>check</v-icon>
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                    
                  </v-col>
                  
                  <v-col sm="4" md="4">
                    <v-select
                      :rules="[v => !!v || 'Campo obrigatório!']"
                      item-text="label"
                      item-value="value"
                      v-model="internacional"
                      :items="simNao"
                      label="Internacional"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-autocomplete
                      v-model="tipologiasSel"
                      :items="tipologias"
                      label="Tipologias à qual a entidade pertence"
                      multiple
                      item-text="tipologia"
                      item-value="tipologia"
                      chips
                      deletable-chips
                      :return-object="false"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-title>
                            <strong>Tipologia</strong> em questão não existe!
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
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
              </v-form>
            </v-card-text>
            <v-card-text style="position: relative">
              <v-fab-transition>
                <v-btn @click="newEntidade" color="indigo darken-2" dark absolute right bottom fab>
                  <v-icon>add</v-icon>
                </v-btn>
              </v-fab-transition>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <br />
  </div>
</template>

<script>
export default {
  props: ["entidades", "produtoras", "tipologias", "entidadesProcessadas"],
  data: function() {
    return {
      panel: [0],
      data_menu_1: false,
      data_menu_2: false,
      data_criacao: null,
      data_extincao: null,
      alertOn: false,
      sucessOn: false,
      sigla: "",
      sioe: "",
      tipologiasSel: [],
      siglaRules: [v => !!v || "A Sigla é um campo obrigatório."],
      designacao: "",
      designacaoRules: [v => !!v || "A Designação é obrigatória."],
      internacional: "",
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
     data_final_valida(v) {
      if (!!v) {
        if (this.data_criacao != null) {
          let data_inicial = new Date(this.data_criacao);
          let data_final = new Date(v);

          if (data_inicial > data_final) {
            return "Data final inválida! É anterior à data de criação.";
          }
        }
      }
      return true;
    },
    async newEntidade() {
      this.alertOn = false;

      if (this.$refs.form.validate()) {
        if (!(await this.validaEntidade())) {
          if (this.sioe == null) {
            this.sioe = "";
          }
          console.log(!!this.data_extincao);
          let entidade = {
            estado_no_sistema: "Nova",
            estado: !!this.data_extincao ? "Inativa" : "Ativa",
            id: "ent_" + this.sigla,
            sigla: this.sigla,
            sioe: this.sioe,
            designacao: this.designacao,
            internacional: this.internacional,
            dataCriacao: this.data_criacao,
            dataExtincao: !!this.data_extincao ? this.data_extincao : "",
            tipologiasSel: this.tipologiasSel
          };

          // PUSH PARA ARRAY DE ENTIDADES SELECIONADAS
          this.produtoras.push(this.sigla + " - " + this.designacao);

          // PUSH PARA ARRAY DE ENTIDADES DOS ITEMS
          this.entidadesProcessadas.push({
            entidade: entidade.sigla + " - " + entidade.designacao,
            disabled: false
          });

          // PUSH DA ENTIDADE COMPLETA PARA O ARRAY ENTIDADES
          this.entidades.push(entidade);

          this.sucessOn = true;
          this.$refs.form.reset();

          setTimeout(() => {
            this.sucessOn = false;
            this.panel = [0];
          }, 2500);
        } else {
          this.alertOn = true;
          setTimeout(() => {
            this.alertOn = false;
          }, 5000);
        }
      }
    },
    // Provavelmente vai ter que se alterar
    async validaEntidade() {
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
