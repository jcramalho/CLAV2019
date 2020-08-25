<template>
  <tr @click="onRowClick(item)">
    <td class="subheading">{{ item.data }}</td>
    <td class="subheading">{{ item.tipo }}</td>
    <td class="subheading">
      <div v-for="(ent, index) in item.entidades.split(',')" :key="index">
        <a :href="'/entidades/ent_' + ent">{{ ent }}</a>
      </div>
    </td>
    <td class="subheading">{{ item.numero }}</td>
    <td class="subheading">{{ item.sumario }}</td>
    <td class="subheading">{{ item.estado }}</td>
    <td v-if="item.operacoes" @click.stop align="right">
      <v-tooltip
        top
        color="info"
        open-delay="100"
        v-for="(operacao, index) in item.operacoes"
        :key="index"
      >
        <template v-slot:activator="{ on }">
          <v-icon
            v-for="(operacao, index) in item.operacoes"
            :key="index"
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
  props: ["item"],

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
