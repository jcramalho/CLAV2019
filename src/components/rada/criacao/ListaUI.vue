<template>
  <div>
    <v-row>
      <v-col cols="12" xs="12" sm="12">
        <UI :UIs="TS.UIs" :RE="RE" :classes="TS.classes" />
      </v-col>
    </v-row>
    <!-- {{TS.UIs}} -->
    <v-row v-if="TS.UIs[0]">
      <v-col cols="12" xs="12" sm="12">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Procurar Unidade de Instalação"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          style="background-color:#fafafa"
          :headers="headers"
          :items="TS.UIs"
          :search="search"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <EditaUI @remover="remover_UI" :UI="props.item" :RE="RE" :classes="TS.classes" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" xs="12" sm="12">
        <v-alert class="text-center" :value="true" color="amber accent-3" icon="warning">
          Ainda não foram adicionadas
          <b>Unidades de Instalação</b>.
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UI from "@/components/rada/criacao/classes/UI";
import EditaUI from "@/components/rada/alteracao/EditaUI";

export default {
  props: ["TS", "RE"],
  components: {
    UI,
    EditaUI
  },
  data: () => ({
    search: "",
    footer_props: {
      "items-per-page-options": [10, 20, 100],
      "items-per-page-text": "Mostrar"
    },
    headers: [
      {
        text: "Código",
        align: "center",
        value: "codigo",
        width: "50%",
        sortable: true,
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Título",
        value: "titulo",
        align: "center",
        width: "50%",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  methods: {
    remover_UI(ui_codigo) {
      this.TS.UIs = this.TS.UIs.filter(e => e.codigo != ui_codigo);
    }
  }
};
</script>

<style>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>