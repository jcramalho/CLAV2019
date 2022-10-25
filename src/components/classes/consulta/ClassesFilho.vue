<template>
  <!-- DESCENDÊNCIA -->
  <Campo
    nome="Descendência"
    infoHeader="Descendência"
    :infoBody="myhelp.Classe.Campos.Descendencia"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
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
    </template>
  </Campo>
</template>

<script>
const help = require("@/config/help").help;
import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["subclasses"],
  components: { Campo },
  data: () => ({
    myhelp: help,
  }),
};
</script>

<style scoped></style>
