<template>
  <v-row ma-2>
    <!-- DESCENDÊNCIA -->
    <v-col cols="12" xs="2" sm="2">
      <div class="info-label">
        Descendência
        <InfoBox
          header="Descendência"
          :text="myhelp.Classe.Campos.Descendencia"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-col>
    <v-col xs="10" sm="10">
      <v-data-table
        :items="subclasses"
        class="elevation-1"
        hide-default-header
        hide-default-footer
        :items-per-page="subclasses.length"
      >
        <template v-slot:item="props">
          <tr>
            <td>
              <a :href="'/classes/consultar/c' + props.item.codigo">{{
                props.item.codigo
              }}</a>
              - {{ props.item.titulo }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;
export default {
  components: { InfoBox },
  props: ["subclasses"],
  data: () => ({
    myhelp: help
  })
};
</script>

<style>
.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
