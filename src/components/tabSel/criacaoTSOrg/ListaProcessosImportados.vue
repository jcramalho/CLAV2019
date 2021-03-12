<template>
  <div>
    <v-data-table
      :items="procs"
      :headers="headers"
      class="ma-1"
      item-key="codigo"
      :footer-props="procsFooterProps"
    >
      <template v-slot:item="props">
        <tr>
          <td>{{ props.item.codigo }}</td>
          <td>{{ props.item.titulo }}</td>
          <td>
            <v-icon v-if="props.item.dono">
              done
            </v-icon>
          </td>
          <td>
            <v-icon v-if="props.item.participante == 'NP'">
              done
            </v-icon>
          </td>
        </tr>
      </template>
      <template v-slot:[`footer.page-text`]="props">
        Resultados: {{ props.pageStart }} - {{ props.pageStop }} de
        {{ props.itemsLength }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mdiPencil } from "@mdi/js";
import { mdiFileDocumentEdit } from "@mdi/js";
import { mdiCheckCircle } from "@mdi/js";
import { mdiCheckBoxOutline } from "@mdi/js";
import { mdiCheckboxBlankOutline } from "@mdi/js";

export default {
  props: ["procs"],
  components: {},

  data: () => ({
    // Cabeçalho da tabela para selecionar os PNs comuns
    headers: [
      {
        text: "Processo",
        value: "codigo",
        width: "20%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Título",
        value: "titulo",
        width: "55%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Dono",
        value: "dono",
        width: "10%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      },
      {
        text: "Participante",
        value: "participante",
        width: "15%",
        class: ["body-2", "font-weight-bold"],
        filterable: false
      }
    ],
    procsFooterProps: {
      "items-per-page-text": "Processos por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    }
  })
};
</script>

<style>
.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}
</style>
