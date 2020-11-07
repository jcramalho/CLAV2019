<template>
  <v-row v-if="!valida">
    <!-- DONOS DO PROCESSO -->
    <v-col xs="2" sm="2">
      <div class="info-label">
        Donos do processo
        <InfoBox
          header="Donos do processo"
          :text="myhelp.Classe.Campos.Donos"
          helpColor="indigo darken-4"
          dialogColor="#E0F2F1"
        />
      </div>
    </v-col>
    <v-col xs="10" sm="10">
      <div class="info-content">
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

  data: function() {
    return {
      headers: [
        { text: "Sigla", align: "left", value: "sigla" },
        { text: "Designação", value: "designacao" },
        { text: "Tipo", value: "tipo" }
      ],
      myhelp: help
    };
  },

  methods: {
    go: function(idClasse) {
      this.$router.push("/entidades/" + idClasse);
      this.$router.go();
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
</style>
