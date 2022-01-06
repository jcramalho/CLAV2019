<template>
  <Campo
    nome="Processos Relacionados"
    infoHeader="Processos Relacionados"
    :infoBody="myhelp.Classe.Campos.ProcessosRelacionados"
    color="neutralpurple"
  >
    <template v-slot:conteudo
      ><v-data-table
        v-if="processos.length > 0"
        :headers="headers"
        :items="processos"
        hide-default-footer
      >
        <template v-slot:header="props">
          <tr>
            <th v-for="h in props.headers" :key="h.text" class="subtitle-2">
              {{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.relacao }}</td>
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>
              <v-btn
                small
                color="red darken-2"
                dark
                rounded
                @click="unselectProcRel(props.item)"
              >
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-alert v-else :value="true" type="warning" border="left"
        >Não tem processos relacionados...</v-alert
      >
    </template>
  </Campo>
</template>

<script>
const labels = require("@/config/labels").classeCriacaoProcessosRelacionadosOps;
const help = require("@/config/help").help;

import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["processos"],

  components: {
    Campo,
  },

  data: function () {
    return {
      mylabels: labels,
      myhelp: help,
      headers: [
        { text: "Relação", align: "left", sortable: true, value: "idRel" },
        { text: "Processo", align: "left", sortable: false, value: "codigo" },
        { text: "Título", align: "left", sortable: false, value: "titulo" },
        { text: "Remover", align: "left", sortable: false, value: "" },
      ],

      labels: {
        eAntecessorDe: "É Antecessor de",
        eComplementarDe: "É Complementar de",
        eCruzadoCom: "É Cruzado com",
        eSinteseDe: "É Síntese de",
        eSintetizadoPor: "É Sintetizado por",
        eSucessorDe: "É Sucessor de",
        eSuplementoDe: "É Suplemento de",
        eSuplementoPara: "É Suplemento para",
      },
    };
  },

  methods: {
    go: function (id) {
      this.$router.push("/classes/consultar/c" + id);
      this.$router.go();
    },
    unselectProcRel: function (proc) {
      this.$emit("unselectProcRel", proc);
    },
  },
};
</script>
<style>
.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
