<template>
  <v-row class="ma-2 indigo lighten-5">
    <v-col cols="2" md="2" sm="2">
      <div class="info-label">Legislação nova</div>
      <v-btn small dark rounded color="indigo darken-2" @click="newLegislacao">
        Adicionar
        <v-icon small dark right>add_circle_outline</v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <v-form ref="form" :lazy-validation="false">
        <v-container>
          <v-row>
            <v-col v-if="listaTipos.length > 0">
              <v-select
                :rules="rule"
                item-text="label"
                item-value="value"
                v-model="tipo"
                :items="listaTipos"
                label="Tipo"
              />
            </v-col>
            <v-col v-else>
              <v-text-field
                :rules="rule"
                v-model="tipo"
                label="Tipo"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                :rules="rule"
                v-model="numero"
                label="Número"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                :rules="rule"
                v-model="sumario"
                label="Sumário"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-menu
                ref="menu2"
                v-model="data_menu"
                :close-on-content-click="false"
                :return-value.sync="data"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :rules="[v => !!v || 'Campo obrigatório!']"
                    v-model="data"
                    label="Data"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="data" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="data_menu = false"
                    >Cancel</v-btn
                  >
                  <v-btn text color="primary" @click="$refs.menu2.save(data)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <!-- <v-text-field
                :rules="rule"
                v-model="data"
                label="Data: AAAA-MM-DD"
                v-mask="'####-##-##'"
              /> -->
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
        </v-container>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["legislacao"],
  data: function() {
    return {
      data_menu: false,
      rule: [v => !!v || "Campo é obrigatório."],
      listaTipos: [],
      novasLegislacao: [],
      alertOn: false,
      sucessOn: false,
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
    newLegislacao: async function() {
      this.alertOn = false;
      this.sucessOn = false;
      if (this.$refs.form.validate()) {
        if (!(await this.validaLegislacao())) {
          let legis = {
            tipo: this.tipo,
            id: "...",
            numero: this.numero,
            sumario: this.sumario,
            data: this.data
          };

          this.legislacao.push(legis);
          this.novasLegislacao.push(legis);

          this.sucessOn = true;
          this.$refs.form.reset();
        } else {
          this.alertOn = true;
        }
      }
    },
    validaLegislacao: function() {
      // Verificar se está na lista de legislacao por selecionar;
      return this.legislacao.some(el => {
        return el.tipo == this.tipo && el.numero == this.numero;
      });
    }

    // validaData: function(d) {
    //   var date = new Date().toISOString().slice(0, 10);
    //   var res = true;
    //   if (d > date) {
    //     this.mensagensErro.push("A data não pode ser superior à data atual!");
    //     this.data = "";
    //     res = false;
    //   }
    //   return res;
    // }
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
