<template>
  <v-container>
    <v-row>
      <v-dialog v-model="dialog" persistent width="80%">
        <v-card dark class="info-card">
          <v-card-title class="headline mb-4">
            Distribuição dos Termos de Índice pelas subclasses criadas
          </v-card-title>
          <v-card-text>
            <v-data-table
              dark
              class="content-table font-weight-medium"
              :items="tis"
              :headers="headers"
              :footer-props="footer_props"
              style="text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;"
            >
              <template v-slot:item="props">
                <tr>
                  <td>
                    {{ props.item.termo }}
                  </td>
                  <td>
                    <v-radio-group
                      v-model="props.item.subclasse"
                      row
                      hide-details
                    >
                      <v-radio
                        v-for="(s, i) in c.subclasses"
                        :key="i"
                        :label="s.codigo"
                        :value="s.codigo"
                        color="blue"
                      >
                      </v-radio>
                    </v-radio-group>
                  </td>
                </tr>
              </template>
              <template v-slot:footer.page-text="props">
                Termos: {{ props.pageStart }} - {{ props.pageStop }} de
                {{ props.itemsLength }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="$emit('distribuir', tis)"
              >Distribuir</v-btn
            >
            <v-btn
              color="red darken-4"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="
                dialog = false;
                $emit('cancelar');
              "
            >
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ["c"],

  data: function() {
    return {
      dialog: false,
      tis: [],

      headers: [
        {
          text: "Termo",
          value: "termo",
          class: ["table-header", "subtitle-2", "font-weight-bold"]
        },
        {
          text: "Distribuição pelas subclasses",
          value: "subclasse",
          class: ["table-header", "subtitle-2", "font-weight-bold"]
        }
      ],
      footer_props: {
        "items-per-page-text": "Termos por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      }
    };
  },

  created: function() {
    this.tis = JSON.parse(JSON.stringify(this.c.termosInd));
    if (typeof this.tis[0].subclasse === "undefined") {
      // Se ainda não foi feita uma distribuição
      for (var i = 0; i < this.tis.length; i++)
        this.tis[i].subclasse = this.c.subclasses[0].codigo;
    }
  },

  mounted: function() {
    this.dialog = true;
  }
};
</script>
<style scoped>
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
.content-table {
  background-color: transparent !important;
}
tr:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
