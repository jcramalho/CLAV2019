<template>
  <Campo
    nome="Selecione o(s) dono(s) do processo"
    infoHeader="Selecione o(s) dono(s) do processo"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <v-card flat v-if="entidadesReady">
        <v-card-title>
          <v-text-field
            v-model="searchEntidades"
            append-icon="search"
            label="Procura/filtra entidades"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="entidadesHeaders"
          :items="entidades"
          :items-per-page="5"
          :search="searchEntidades"
          item-key="id"
          :footer-props="footer_props"
        >
          <template v-slot:item="props">
            <tr @click="selectEntidade(props.item)">
              <td>{{ props.item.sigla }}</td>
              <td>{{ props.item.designacao }}</td>
              <td>{{ props.item.tipo }}</td>
            </tr>
          </template>

          <template v-slot:footer.page-text="props"
            >{{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}</template
          >

          <v-alert v-slot:no-results :value="true" class="error" icon="warning"
            >A procura por "{{ search }}" não deu resultados.</v-alert
          >
        </v-data-table>
      </v-card>
      <v-subheader v-else>{{ mylabels.donos }}</v-subheader>
    </template>
  </Campo>
</template>

<script>
import Campo from "@/components/generic/Campo";
export default {
  props: ["entidades", "entidadesReady"],
  components: {
    Campo,
  },

  data: function () {
    return {
      searchEntidades: "",
      mylabels: require("@/config/labels").mensagensEspera,

      entidadesHeaders: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" },
      ],

      footer_props: {
        "items-per-page-text": "Entidades por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todas",
      },
    };
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
    selectEntidade: function (entidade) {
      this.$emit("selectEntidade", entidade);
    },
  },
};
</script>
<style></style>
