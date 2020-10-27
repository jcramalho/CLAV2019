<template>
  <v-row>
    <v-col cols="12" xs="12" sm="3">
      <div class="info-label">
        Sistemas de informação
        <InfoBox header="Sistemas de Informação"/>
      </div>
    </v-col>
    <v-col cols="12" xs="12" sm="9" v-if="sistema.length > 0">
      <v-data-table
        :headers="headers"
        :items="sistema"
        class="elevation-1"
        hide-default-footer
        :footer-props="footer_props"
      >
        <template v-slot:header="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: green;"
            >{{ h.text }}
            </th>
          </tr>
        </template>


        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.numeroSI }}</td>
            <td>{{ props.item.nomeSI }}</td>
            <td>
              <template>
                <div class="text">
                  <v-dialog
                    :retain-focus="false"
                    v-model="alterar"
                    width="90%"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn small color="blue darken-2" dark rounded v-bind="attrs" v-on="on" @click="alterar = true">
                        <v-icon dark>edit</v-icon>
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title class="headline grey lighten-2">
                        Sistema de informação
                      </v-card-title>

                      <v-divider></v-divider>
                      <span>{{props.item}}</span>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="alterar = false"
                        >
                          I accept
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </template>
            </td>
            <td>
              <v-btn small color="red darken-2" dark rounded @click="unselectSistema(props.item)">
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template v-slot:footer.page-text="props">
            Sistemas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning">Não tem sistema selecionado...</v-alert>
    </v-col>
  </v-row>
</template>

<script>
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["sistema"],

  components: {
    InfoBox
  },

  data: function() {
    return {
      myhelp: help,
      alterar: false,
      headers: [
        { text: "Número", value: "numeroSI" },
        { text: "Nome", value: "nomeSI" },
        { text: "Alterar", value: ""},
        { text: "Remover", value: "" }
      ],

      footer_props: {
        "items-per-page-text": "Sistemas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  methods: {
    unselectSistema: function(sistema) {
      this.$emit("unselectSistema", sistema);
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
