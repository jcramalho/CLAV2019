<template>
  <v-row align="center">
    <!-- DESCENDÊNCIA -->
    <v-col cols="12" md="3" class="px-6">
      <div class="info-label">
        Descendência
        <InfoBox
          header="Descendência"
          :text="myhelp.Classe.Campos.Descendencia"
          helpColor="info"
        />
      </div>
    </v-col>
    <v-col cols="12" md="9">
      <v-data-table
        :items="subclasses"
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
    myhelp: help,
  }),
};
</script>

<style scoped></style>
