<template>
  <Campo nome="Processos selecionados" color="neutralpurple">
    <template v-slot:conteudo>
      <v-data-table
        v-if="processos.length > 0"
        :headers="headers"
        :items="processos"
        hide-default-footer
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                rounded
                @click="unselectProcesso(props.item)"
              >
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-alert v-else :value="true" type="warning"
        >Não tem processos selecionados...</v-alert
      >
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/Campo.vue";
export default {
  props: ["processos"],

  components: {
    Campo,
  },
  data: function () {
    return {
      headers: [
        {
          text: "Código",
          align: "left",
          value: "codigo",
          class: ["body-2", "font-weight-bold"],
        },
        {
          text: "Designação",
          value: "titulo",
          class: ["body-2", "font-weight-bold"],
        },
        { text: "Remover", class: ["body-2", "font-weight-bold"] },
      ],
    };
  },

  methods: {
    unselectProcesso: function (processo) {
      this.$emit("unselectProcesso", processo);
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #1a237e; /* indigo darken-4 */
  padding: 5px;
  font-weight: 400;
  width: auto;
  height: auto;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
