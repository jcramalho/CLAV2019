<template>
  <Campo nome="Entidades selecionadas" color="neutralpurple">
    <template v-slot:conteudo>
      <v-data-table
        v-if="entidades.length > 0"
        :headers="headers"
        :items="entidades"
        :items-per-page="100"
        hide-default-footer
      >
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.sigla }}</td>
            <td>{{ props.item.designacao }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                rounded
                @click="unselectEntidade(props.item)"
              >
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-alert v-else :value="true" type="warning"
        >Não tem entidades selecionadas...</v-alert
      >
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV.vue";
export default {
  props: ["entidades", "tipo"],
  components: {
    Campo,
  },

  data: function () {
    return {
      headers: [
        {
          text: "Sigla",
          align: "left",
          value: "sigla",
          class: ["body-2", "font-weight-bold"],
        },
        {
          text: "Designação",
          value: "designacao",
          class: ["body-2", "font-weight-bold"],
        },
        { text: "Remover", class: ["body-2", "font-weight-bold"] },
      ],
    };
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    unselectEntidade: function (entidade) {
      this.$emit("unselectEntidade", entidade);
    },
  },
};
</script>

<style scoped></style>
