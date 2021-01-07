<template>
  <tr>
    <td class="subheading">{{ item.data }}</td>
    <td class="subheading">{{ item.tipo }}</td>
    <td class="subheading" v-if="item.entidades.length < 10">
      <div v-for="(ent, index) in item.entidades.split(',')" :key="index">
        <a :href="'/entidades/ent_' + ent">{{ ent }}</a>
      </div>
    </td>
    <td v-else class="subheading">
      <div v-for="(ent, index) in item.entidades.split(',')" :key="index">
        <a v-if="index < 10" :href="'/entidades/ent_' + ent">{{ ent }}</a>
      </div>
      <v-btn
        x-small
        color="#1F79D3"
        v-if="expandEntidades == false"
        @click="expandEntidades = true"
      >
        Ver mais...
      </v-btn>
      <div v-if="expandEntidades == true">
        <div v-for="(ent, index) in item.entidades.split(',')" :key="index">
          <a v-if="index > 10" :href="'/entidades/ent_' + ent">{{ ent }}</a>
        </div>
        <v-btn
          x-small
          color="#1F79D3"
          v-if="expandEntidades == true"
          @click="expandEntidades = false"
        >
          Ver menos
        </v-btn>
      </div>
    </td>
    <td class="subheading">{{ item.numero }}</td>
    <td class="subheading">{{ item.sumario }}</td>
    <td class="subheading">{{ item.estado }}</td>
    <td v-if="item.operacoes" @click.stop align="right">
      <v-icon
        v-for="(operacao, index) in item.operacoes"
        @click="doOperation(item, operacao)"
        color="indigo darken-2"
        :key="index"
        class="mr-2"
        >{{ operacao.icon }}</v-icon
      >
      <unicon
        class="pointer"
        name="look-icon"
        width="25"
        height="25"
        viewBox="0 0 20.71 15.574"
        fill="#303F9F"
        @click="onRowClick(item)"
      />
    </td>
  </tr>
</template>

<script>
export default {
  props: ["item"],
  data: () => ({
    expandEntidades: false
  }),

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
<style>
.pointer {
  cursor: pointer;
}
</style>
