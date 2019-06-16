<template>
  <v-layout wrap ma-2>
    <!-- DESCENDÊNCIA -->
    <v-flex xs2>
      <div class="info-label">
        Descendência
        <InfoBox
          header="Descendência"
          :text="myhelp.Classe.Campos.Descendencia"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-flex>
    <v-flex xs10>
      <v-data-table
        :items="subclasses"
        class="elevation-1"
        hide-headers
        hide-actions
      >
        <template v-slot:items="props">
          <tr>
            <td>
              <a :href="'/classes/consultar/c' + props.item.codigo">
                {{ props.item.codigo }}
              </a>
              - {{ props.item.titulo }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;
export default {
  components: { InfoBox },
  props: ["subclasses"],
  data: () => ({
    myhelp: help
  }),
  methods: {
    go: function(idClasse) {
      this.$router.push("/classes/c" + idClasse);
      this.$router.go();
    }
  }
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
