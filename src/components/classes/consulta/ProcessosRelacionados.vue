<template>
  <v-row>
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
        <v-data-table :headers="headers" :items="myProcRel" class="elevation-1" hide-default-footer>
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
    </v-col>
  </v-row>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["processos"],
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

<style>
a:link {
  color: #1a237e;
  background-color: transparent;
}

a:hover {
  color: white;
  background-color: #1a237e;
}

.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>
