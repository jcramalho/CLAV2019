<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">
        Processos Relacionados
        <InfoBox
          header="Processos Relacionados"
          :text="myhelp.Classe.Campos.ProcessosRelacionados"
        />
      </div>
    </v-col>
    <v-col v-if="processos.length > 0">
      <v-data-table
        :headers="headers"
        :items="processos"
        class="elevation-1"
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
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning"
        >Não tem processos relacionados...</v-alert
      >
    </v-col>
  </v-row>
</template>

<script>
const labels = require("@/config/labels").classeCriacaoProcessosRelacionadosOps;
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["processos"],

  components: {
    InfoBox
  },

  data: function() {
    return {
      mylabels: labels,
      myhelp: help,
      headers: [
        { text: "Relação", align: "left", sortable: true, value: "idRel" },
        { text: "Processo", align: "left", sortable: false, value: "codigo" },
        { text: "Título", align: "left", sortable: false, value: "titulo" },
        { text: "Remover", align: "left", sortable: false, value: "" }
      ],

      labels: {
        eAntecessorDe: "É Antecessor de",
        eComplementarDe: "É Complementar de",
        eCruzadoCom: "É Cruzado com",
        eSinteseDe: "É Síntese de",
        eSintetizadoPor: "É Sintetizado por",
        eSucessorDe: "É Sucessor de",
        eSuplementoDe: "É Suplemento de",
        eSuplementoPara: "É Suplemento para"
      }
    };
  },

  methods: {
    go: function(id) {
      this.$router.push("/classes/consultar/c" + id);
      this.$router.go();
    },
    unselectProcRel: function(proc) {
      this.$emit("unselectProcRel", proc);
    }
  }
};
</script>
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
