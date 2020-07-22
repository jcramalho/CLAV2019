<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
    <v-row
      :class="{
        'mt-7': $vuetify.breakpoint.smAndDown,
        'mt-6': $vuetify.breakpoint.mdAndUp
      }"
    >
      <!-- PARTICIPANTES NO PROCESSO -->
      <v-col cols="12" lg="2">
        <div class="info-label">
          Participantes no processo
          <InfoBox
            header="Participantes no processo"
            :text="myhelp.Classe.Campos.Participantes"
            helpColor="info"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="10">
        <div class="info-content">
          <v-data-table
            :headers="headers"
            :items="myParticipantes"
            class="content-table"
            hide-default-footer
          >
            <template v-slot:item="props">
              <tr>
                <td style="color: #1A237E;">{{ props.item.label }}</td>
                <td>
                  <ul>
                    <li v-for="p in props.item.participantes" :key="p.label">
                      <a
                        v-if="p.idTipo == 'Entidade'"
                        :href="'/entidades/' + p.idParticipante"
                      >
                        {{ p.sigla }}
                        ({{ p.idTipo }}) - {{ p.designacao }}
                      </a>
                      <a v-else :href="'/tipologias/' + p.idParticipante">
                        {{ p.sigla }}
                        ({{ p.idTipo }}) - {{ p.designacao }}
                      </a>
                    </li>
                  </ul>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["entidades"],
  components: { InfoBox },

  data: function() {
    return {
      headers: [
        {
          text: "Tipo de Intervenção",
          align: "left",
          sortable: false,
          value: "label",
          class: ["table-header", "body-2", "font-weight-bold"]
        },
        {
          text: "Participantes",
          value: "participantes",
          class: ["table-header", "body-2", "font-weight-bold"]
        }
      ],
      participPorTipo: {
        Apreciador: [],
        Assessor: [],
        Comunicador: [],
        Decisor: [],
        Executor: [],
        Iniciador: []
      },
      myParticipantes: [],
      myhelp: help
    };
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },

    normaliza: function(tipo) {
      var res = "";
      switch (tipo) {
        case "Assessor":
          res = "Assessorar";
          break;
        case "Apreciador":
          res = "Apreciar";
          break;
        case "Comunicador":
          res = "Comunicar";
          break;
        case "Decisor":
          res = "Decidir";
          break;
        case "Executor":
          res = "Executar";
          break;
        case "Iniciador":
          res = "Iniciar";
          break;
        default:
          res = "Desconhecido";
      }
      return res;
    }
  },

  mounted: function() {
    var tipo;
    for (var i = 0; i < this.entidades.length; i++) {
      tipo = this.entidades[i].participLabel;
      this.participPorTipo[tipo].push(this.entidades[i]);
    }
    for (var j = 0; j < Object.keys(this.participPorTipo).length; j++) {
      tipo = Object.keys(this.participPorTipo)[j];
      if (this.participPorTipo[tipo].length > 0) {
        this.myParticipantes.push({
          label: this.normaliza(tipo),
          participantes: this.participPorTipo[tipo]
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
