<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="3">
        <div class="info-label">Relação com Série/Subsérie</div>
      </v-col>
      <v-col cols="12" xs="12" sm="9">
        <v-row>
          <v-col sm="12" xs="12" v-if="newSerie.relacoes[0]">
            <v-data-table :headers="headers" :items="newSerie.relacoes" hide-default-footer>
              <template v-slot:item.relacao="props">{{ props.item.relacao }}</template>

              <template v-slot:item.edicao="props">
                <td>
                  <v-icon color="red darken-2" dark @click="remove(props.item)">remove_circle</v-icon>
                </td>
              </template>
              <template v-slot:item.serieRelacionada="props">{{ props.item.serieRelacionada }}</template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-form ref="addRel" :lazy-validation="false">
          <v-row>
            <v-col sm="5" xs="12">
              <v-autocomplete :rules="[v => !!v || 'Campo obrigatório!']" v-model="rel" :items="listaRelacoes" label="Relação"></v-autocomplete>
            </v-col>
            <v-col sm="6" xs="12">
              <v-combobox
                :rules="[v => !!v || 'Campo obrigatório!']"
                v-model="classerel"
                :items="classes"
                label="Com a classe"
              ></v-combobox>
            </v-col>
            <v-col sm="1" xs="12">
              <v-btn text rounded @click="add()">
                <v-icon color="green lighten-1" dark>add_circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="!!alertOn">
            <v-col>
              <v-alert dismissible dense text type="error">Relação já existente!</v-alert>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "RelacoesClasse",
  props: ["newSerie", "classes"],
  data() {
    return {
      alertOn: false,
      rel: "",
      classerel: "",
      listaRelacoes: [
        "Antecessora de",
        "Sucessora de",
        "Complementar de",
        "Sintetizado por",
        "Síntese de",
        "Suplemento de",
        "Suplemento para"
      ],
      headers: [
        {
          text: "Relação",
          align: "center",
          value: "relacao",
          width: "30%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Classe Relacionada",
          align: "center",
          value: "serieRelacionada",
          width: "65%",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          value: "edicao",
          sortable: false,
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ]
    };
  },
  methods: {
    remove: function(item) {
      this.newSerie.relacoes = this.newSerie.relacoes.filter(e => {
        return (
          e.relacao != item.relacao ||
          e.serieRelacionada != item.serieRelacionada
        );
      });
    },
    add: async function() {
      this.alertOn = false;

      if (this.$refs.addRel.validate()) {
        if (!(await this.validateRelacao())) {
          this.newSerie.relacoes.push({
            relacao: this.rel,
            serieRelacionada: this.classerel
          });
          this.$refs.addRel.reset();
        } else {
          this.alertOn = true;
        }
      }
    },
    validateRelacao: function() {
      return this.newSerie.relacoes.some(el => {
        return el.relacao == this.rel && el.serieRelacionada == this.classerel;
      });
    }
  }
};
</script>
