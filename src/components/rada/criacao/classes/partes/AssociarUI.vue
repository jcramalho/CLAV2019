<template>
  <div>
    <v-row>
      <v-col md="4" sm="4">
        <div class="info-label">Unidades de Instalação</div>
      </v-col>
      <v-col md="8" sm="8">
        <v-data-table
          :headers="headers"
          :items="newSerie.UIs"
          hide-default-footer
          v-if="newSerie.UIs[0]"
        >
          <template v-slot:item.edicao="props">
            <td>
              <v-icon color="red darken-2" dark @click="remove(props.item)">remove_circle</v-icon>
            </td>
          </template>
        </v-data-table>
        <v-alert
          v-else
          :value="true"
          icon="warning"
          color="amber accent-3"
        >Não tem séries/subséries selecionadas...</v-alert>
      </v-col>
    </v-row>
    <v-card outlined>
      <div class="info-label" style="padding-right:-2px">Adicionar Unidades de Instalação</div>

      <v-card-text>
        <v-form ref="addRel" :lazy-validation="false">
          <v-row>
            <v-col sm="5" xs="12">
              <v-combobox
                :rules="[v => !!v || 'Campo obrigatório!']"
                v-model="cod"
                :items="getCodigos"
                label="Código"
                solo
                clearable
              ></v-combobox>
            </v-col>
            <v-col sm="6" xs="12">
              <v-text-field
                :rules="[v => !!v || 'Campo obrigatório!']"
                :disabled="iscodvalido"
                v-model="tit"
                label="Título"
                solo
                clearable
              ></v-text-field>
            </v-col>
            <v-col sm="1" xs="12">
              <v-btn icon text rounded @click="adicionarUI">
                <v-icon color="green lighten-1">add_circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="!!alertOn">
            <v-col>
              <v-alert dismissible dense text type="error">Unidade de Instalação já adicionada!</v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["newSerie", "UIs"],
  computed: {
    getCodigos() {
      return this.UIs.map(e => e.codigo);
    }
  },
  data() {
    return {
      alertOn: false,
      iscodvalido: false,
      cod: "",
      tit: "",
      headers: [
        {
          text: "Código",
          align: "center",
          value: "codigo",
          width: "30%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Título",
          align: "center",
          value: "titulo",
          width: "65%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          value: "edicao",
          align: "center",
          sortable: false,
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ]
    };
  },
  methods: {
    remove: function(item) {
      this.newSerie.UIs = this.newSerie.UIs.filter(e => {
        return e.codigo != item.codigo;
      });
    },
    adicionarUI: async function() {
      this.alertOn = false;

      if (this.$refs.addRel.validate()) {
        if (!(await this.validateUI())) {
          this.newSerie.UIs.push({
            codigo: this.cod,
            titulo: this.tit
          });
          this.$refs.addRel.reset();
        } else {
          this.alertOn = true;
        }
      }
    },
    validateUI: function() {
      return this.newSerie.UIs.some(el => {
        return el.codigo == this.cod;
      });
    }
  },
  watch: {
    cod: function(novo, old) {
      let c = this.UIs.find(e => e.codigo == novo);

      if (c != undefined) {
        this.iscodvalido = true;
        this.tit = c.titulo;
      } else {
        this.iscodvalido = false;
      }
    }
  }
};
</script>
