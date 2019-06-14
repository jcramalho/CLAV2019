<template>
  <v-layout wrap ma-2>
    <!-- DESCENDÊNCIA -->
    <v-flex xs2>
      <div class="info-label">Descendência</div>
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
export default {
  props: ["subclasses"],
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
