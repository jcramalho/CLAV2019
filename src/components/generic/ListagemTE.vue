<template>
  <tr @click="onRowClick(item)">
    <td class="subheading">{{ item.id }}</td>
    <td class="subheading">{{ item.designacao }}</td>
    <td @click.stop align="right">
      <v-tooltip
        top
        color="info"
        open-delay="100"
        v-for="(operacao, index) in item.operacoes"
        :key="index"
      >
        <template v-slot:activator="{ on }">
          <v-icon
            @click="doOperation(item, operacao)"
            v-on="on"
            color="indigo darken-2"
            class="mr-2"
            >{{ operacao.icon }}</v-icon
          >
        </template>
        <span v-if="operacao.icon == 'edit'">Alterar</span>
      </v-tooltip>
    </td>
  </tr>
</template>

<script>
export default {
  props: ["item", "tipo"],

  methods: {
    doOperation(item, operacao) {
      this.$emit("iconClicked", { operacao, item });
    },

    onRowClick(item) {
      this.$emit("rowClicked", item);
    }
  }
};
</script>
