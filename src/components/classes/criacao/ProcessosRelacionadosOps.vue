<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row
      :class="{
        'mt-7': $vuetify.breakpoint.smAndDown,
        'mt-6': $vuetify.breakpoint.mdAndUp
      }"
    >
      <v-col cols="12" lg="2">
        <div class="info-label">
          Processos Relacionados
          <InfoBox
            header="Processos Relacionados"
            :text="myhelp.Classe.Campos.ProcessosRelacionados"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10" v-if="processos.length > 0">
        <div class="info-content">
          <v-data-table
            class="content-table pa-4"
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
                <td style="color: #1A237E;">{{ props.item.relacao }}</td>
                <td style="color: #1A237E;">{{ props.item.codigo }}</td>
                <td style="color: #1A237E;">{{ props.item.titulo }}</td>
                <td>
                  <v-btn
                    icon
                    color="red darken-2"
                    @click="unselectProcRel(props.item)"
                  >
                    <unicon
                      name="remove-icon"
                      width="15"
                      height="15"
                      viewBox="0 0 20.71 20.697"
                      fill="#ff5252"
                    />
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-col>
      <v-col v-else>
        <v-alert :value="true" type="warning" style="border-radius: 40px;"
          >Não tem processos relacionados...</v-alert
        >
      </v-col>
    </v-row>
  </v-container>
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
<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  width: 100%;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
tr:hover {
  background-color: #eaeef9 !important;
}
</style>
