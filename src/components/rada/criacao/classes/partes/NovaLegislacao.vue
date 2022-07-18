<template>
  <div>
    <v-expansion-panels flat focusable v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate color="#dee2f8">
          <b style="color: #1a237e">Criar Nova Legislação</b>

          <template v-slot:actions>
            <v-icon color="sucess" rounded>add</v-icon>
          </template>
        </v-expansion-panel-header>
        <v-expansion-panel-content color="indigo lighten-5">
          <v-card flat color="indigo lighten-5">
            <v-card-text>
              <v-form ref="form" :lazy-validation="false">
                <v-row>
                  <v-col v-if="!!tipos[0]">
                    <v-select
                      :rules="rule"
                      item-text="label"
                      item-value="value"
                      v-model="tipo"
                      :items="tipos"
                      label="Tipo"
                    />
                  </v-col>

                  <v-col>
                    <v-text-field
                      :rules="rule"
                      v-model="numero"
                      label="Número"
                    ></v-text-field>
                  </v-col>

                  <v-col>
                    <SelecionarData
                      :d="data"
                      label="Data"
                      @dataSelecionada="data = $event"
                    >
                      <template v-slot:default="slotProps">
                        <v-text-field
                          :rules="[(v) => !!v || 'Campo obrigatório!']"
                          v-model="slotProps.item.dataValor"
                          :label="slotProps.item.label"
                          prepend-icon="event"
                          readonly
                          v-on="slotProps.item.on"
                          clearable
                        ></v-text-field>
                      </template>
                    </SelecionarData>
                    <!-- <v-menu
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
                    </v-menu> -->
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      :rules="rule"
                      v-model="sumario"
                      label="Sumário"
                    ></v-text-field>
                  </v-col>

                  <v-col>
                    <v-text-field v-model="link" label="Link"></v-text-field>
                  </v-col>
                </v-row>
                <v-row v-if="!!alertOn">
                  <v-col>
                    <v-alert dismissible dense text type="error"
                      >Legislação já existe!</v-alert
                    >
                  </v-col>
                </v-row>
                <v-row v-if="sucessOn">
                  <v-col>
                    <v-alert dismissible dense text type="success"
                      >Legislação adicionada com sucesso!</v-alert
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-text style="position: relative">
              <v-fab-transition>
                <v-btn
                  @click="newLegislacao"
                  color="indigo darken-2"
                  dark
                  absolute
                  right
                  bottom
                  fab
                >
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
import { nanoid } from 'nanoid'
import SelecionarData from "@/components/generic/SelecionarData";

export default {
  props: ["legislacao", "newSerie", "legislacaoProcessada", "tipos"],
  components: {
    SelecionarData,
  },
  data: function () {
    return {
      panel: [0],
      data_menu: false,
      rule: [(v) => !!v || "Campo é obrigatório."],
      alertOn: false,
      sucessOn: false,
      tipo: "",
      numero: "",
      sumario: "",
      data: "",
      link: "",
    };
  },

  methods: {
    newLegislacao: async function () {
      this.alertOn = false;
      this.sucessOn = false;
      if (this.$refs.form.validate()) {
        if (!(await this.validaLegislacao())) {
          let legis = {
            id: "leg_" + nanoid(),
            estado: "Nova",
            tipo: this.tipo,
            numero: this.numero,
            sumario: this.sumario,
            data: this.data,
            link: this.link,
          };

          // PUSH NO ARRAY VERDADEIRO DE LEGISLAÇÕES
          this.legislacao.push(legis);

          // PUSH NO ARRAY DE LEGISLAÇÕES PROCESSADAS PARA OS AUTOCOMPLETES
          this.legislacaoProcessada.push({
            id: legis.id,
            legislacao: legis.tipo + " " + legis.numero + " - " + legis.sumario,
          });

          // PUSH NO ARRAY DE LEGISLAÇÕES SELECIONADAS PARA A SÉRIE
          this.newSerie.legislacao.push({
            id: legis.id,
            legislacao: legis.tipo + " " + legis.numero + " - " + legis.sumario,
          });
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
    validaLegislacao: function () {
      // Verificar se está na lista de legislacao por selecionar;
      return this.legislacao.some((el) => {
        return el.tipo == this.tipo && el.numero == this.numero;
      });
    },
  },
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
