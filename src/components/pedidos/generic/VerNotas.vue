<template>
  <v-data-table
    :headers="header"
    :items="items"
    class="elevation-1"
    :footer-props="footerProps"
  >
    <template v-slot:no-data>
      <v-alert type="error" width="100%" class="m-auto mb-2 mt-2" outlined>
        Nenhuma nota adicionada.
      </v-alert>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-btn
          rounded
          class="indigo accent-4 white--text"
          @click="addFunc(campo)"
        >
          Adicionar
        </v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.sigla="{ item }">
      {{ item.sigla }}
    </template>

    <template v-slot:item.operacao="{ item }">
      <v-icon color="red" @click="removeFunc(item, campo)">
        delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ["header", "footerProps", "items", "addFunc", "removeFunc", "campo"]
};
</script>
