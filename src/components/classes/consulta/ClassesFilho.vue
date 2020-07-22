<template>
  <v-row class="ma-2">
    <!-- DESCENDÊNCIA -->
    <v-col>
      <div
        class="info-label mb-n1 pa-2 px-3 pt-3"
        :class="{
          'text-center': $vuetify.breakpoint.smAndDown,
          'text-left': $vuetify.breakpoint.mdAndUp
        }"
        style="min-height: 50px;"
      >
        Descendência
        <InfoBox
          header="Descendência"
          :text="myhelp.Classe.Campos.Descendencia"
          helpColor="info"
        />
      </div>
      <v-data-table
        id="tabela"
        class="font-weight-medium"
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
    myhelp: help
  })
};
</script>

<style scoped>
.info-label {
  color: #1a237e;
  padding: 5px;
  width: 100%;
  background-color: #dee2f8;
  border-radius: 10px 10px 0 0;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}
#tabela {
  border: 1px solid #dee2f8 !important;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}
</style>
