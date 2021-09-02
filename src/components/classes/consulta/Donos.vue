<template>
  <v-row v-if="!valida">
    <!-- DONOS DO PROCESSO -->
    <v-col cols="12" sm="4" md="3">
      <v-card class="pa-4" color="neutralpurple">
        <v-row class="pa-0 ma-0" justify="center">
          <span class="clav-info-label">Donos do processo</span>
          <InfoBox
            header="Donos do processo"
            :text="myhelp.Classe.Campos.Donos"
          />
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" sm="8" md="9">
      <v-card color="secondary" class="pa-4">
        <ul>
          <li v-for="p in entidades" :key="p.idDono">
            <a v-if="p.idTipo == 'Entidade'" :href="'/entidades/' + p.idDono">
              {{ p.sigla }}:
              {{ p.designacao }}
              ({{ p.tipo.split("#")[1] }})
            </a>
            <a v-else :href="'/tipologias/' + p.idDono">
              {{ p.sigla }}:
              {{ p.designacao }}
              ({{ p.tipo.split("#")[1] }})
            </a>
          </li>
        </ul>
      </v-card>
    </v-col>
  </v-row>
  <div v-else>
    <ul>
      <li v-for="p in entidades" :key="p.idDono">
        <a v-if="p.idTipo == 'Entidade'" :href="'/entidades/' + p.idDono">
          {{ p.sigla }}:
          {{ p.designacao }}
          ({{ p.tipo.split("#")[1] }})
        </a>
        <a v-else :href="'/tipologias/' + p.idDono">
          {{ p.sigla }}:
          {{ p.designacao }}
          ({{ p.tipo.split("#")[1] }})
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;

export default {
  props: ["entidades", "valida"],
  components: { InfoBox },

  data: function () {
    return {
      headers: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" },
      ],
      myhelp: help,
    };
  },

  methods: {
    go: function (idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
    },
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
