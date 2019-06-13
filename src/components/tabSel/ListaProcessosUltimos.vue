<template>
  <v-data-table
    :items="lista"
    :headers="headers"
    class="elevation-1"
    item-key="classe"
    :rows-per-page-items="[10, 20, 100]"
  >
    <template v-slot:headers="props">
      <tr>
        <th
          v-for="h in props.headers"
          :key="h.value"
          class="body-2 font-weight-bold"
        >
          {{ h.text }}
        </th>
      </tr>
    </template>
    <template v-slot:items="props">
      <tr

      >
        <td>
          {{ props.item.classe }}
        </td>
        <td>
          {{ props.item.designacao }}
        </td>
        <td>
          <v-checkbox
            v-model="props.item.dono"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td>
          <v-checkbox
            v-model="props.item.participante"
            primary
            hide-details
          ></v-checkbox>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
const lhost = require("@/config/global").host;
const axios = require("axios");

export default {
  props: ["lista", "tipo", "listaPreSel"],
  data: () => ({
    headers: [
      {
        text: "Classe",
        value: "classe",
        width: "20%"
      },
      {
        text: "Designação",
        value: "designacao",
        width: "60%"
      },
      {
        text: "Dono",
        value: "dono"
      },
      {
        text: "Participante",
        value: "participante"
      }
    ]
  })
};
</script>