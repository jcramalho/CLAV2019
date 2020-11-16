<template>
  <v-row v-if="!valida">
    <!-- PROCESSOS RELACIONADOS -->
    <v-col xs="2" sm="2">
      <div class="info-label">
        Processos Relacionados
        <InfoBox
          header="Processos Relacionados"
          :text="myhelp.Classe.Campos.ProcessosRelacionados"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-col>
    <v-col xs="10" sm="10">
      <div class="info-content">
        <v-data-table
          :headers="headers"
          :items="myProcRel"
          class="elevation-1"
          hide-default-footer
        >
          <template v-slot:item="props">
            <tr>
              <td style="color: #1A237E;">{{ props.item.label }}</td>
              <td>
                <ul>
                  <li v-for="p in props.item.processos" :key="p.label">
                    <a :href="'/classes/consultar/c' + p.codigo">{{
                      p.codigo
                    }}</a>
                    - {{ p.titulo }}
                  </li>
                </ul>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-col>
  </v-row>
  <div v-else>
    <v-data-table
      :headers="headers"
      :items="myProcRel"
      class="elevation-1"
      hide-default-footer
    >
      <template v-slot:item="props">
        <tr>
          <td style="color: #1A237E;">{{ props.item.label }}</td>
          <td>
            <ul>
              <li v-for="p in props.item.processos" :key="p.label">
                <a :href="'/classes/consultar/c' + p.codigo">{{ p.codigo }}</a>
                - {{ p.titulo }}
              </li>
            </ul>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["processos", "valida"],
  components: { InfoBox },

  data: function() {
    return {
      headers: [
        {
          text: "Relação",
          align: "left",
          sortable: false,
          value: "label",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Processos",
          value: "processos",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ],
      relPorTipo: {
        eAntecessorDe: [],
        eComplementarDe: [],
        eCruzadoCom: [],
        eSinteseDe: [],
        eSintetizadoPor: [],
        eSucessorDe: [],
        eSuplementoDe: [],
        eSuplementoPara: []
      },
      labels: {
        eAntecessorDe: "É Antecessor de",
        eComplementarDe: "É Complementar de",
        eCruzadoCom: "É Cruzado com",
        eSinteseDe: "É Síntese de",
        eSintetizadoPor: "É Sintetizado por",
        eSucessorDe: "É Sucessor de",
        eSuplementoDe: "É Suplemento de",
        eSuplementoPara: "É Suplemento para"
      },
      myProcRel: [],
      myhelp: help
    };
  },

  methods: {
    go: function(id) {
      this.$router.push("/classes/consultar/c" + id);
      this.$router.go();
    }
  },

  mounted: function() {
    var tipo;
    for (var i = 0; i < this.processos.length; i++) {
      tipo = this.processos[i].idRel;
      this.relPorTipo[tipo].push(this.processos[i]);
    }
    for (var j = 0; j < Object.keys(this.relPorTipo).length; j++) {
      tipo = Object.keys(this.relPorTipo)[j];
      if (this.relPorTipo[tipo].length > 0) {
        this.myProcRel.push({
          label: this.labels[tipo],
          processos: this.relPorTipo[tipo]
        });
      }
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e;
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
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}
tr:hover {
  background-color: #eaeef9 !important;
}
</style>
