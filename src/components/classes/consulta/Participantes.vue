<template>
  <!-- PARTICIPANTES NO PROCESSO -->
  <Campo
    v-if="!valida"
    nome="Participantes no processo"
    infoHeader="Participantes no processo"
    :infoBody="myhelp.Classe.Campos.Participantes"
    color="neutralpurple"
  >
    <template v-slot:conteudo>
      <v-data-table :headers="headers" :items="myParticipantes" hide-default-footer>
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.label }}</td>
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
    </template>
  </Campo>
  <div v-else>
    <v-data-table :headers="headers" :items="myParticipantes" hide-default-footer>
      <template v-slot:item="props">
        <tr>
          <td style="color: #1a237e">{{ props.item.label }}</td>
          <td>
            <ul>
              <li v-for="p in props.item.participantes" :key="p.label">
                <a v-if="p.idTipo == 'Entidade'" :href="'/entidades/' + p.idParticipante">
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
</template>

<script>
import Campo from "@/components/generic/Campo";
const help = require("@/config/help").help;

export default {
  props: ["entidades", "valida"],
  components: { Campo },

  data: function () {
    return {
      headers: [
        {
          text: "Tipo de Intervenção",
          align: "left",
          sortable: false,
          value: "label",
          class: ["body-2", "font-weight-bold"],
        },
        {
          text: "Participantes",
          value: "participantes",
          class: ["body-2", "font-weight-bold"],
        },
      ],
      participPorTipo: {
        Apreciador: [],
        Assessor: [],
        Comunicador: [],
        Decisor: [],
        Executor: [],
        Iniciador: [],
      },
      myParticipantes: [],
      myhelp: help,
    };
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },

    normaliza: function (tipo) {
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
    },
  },

  mounted: function () {
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
          participantes: this.participPorTipo[tipo],
        });
      }
    }
  },
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
</style>
