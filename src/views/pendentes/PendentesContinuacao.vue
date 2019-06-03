<template>
  <div>
    <ContinuaClasse v-if="objLoaded && tipoClasse" :obj="objeto" />
    <ContinuaPendente v-else-if="objLoaded" :obj="objeto" />
    <v-alert v-else type="warning">
      Por algum motivo não foi possível carregar o trabalho pretendido. Contacte
      o administrador.
    </v-alert>
  </div>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;
import ContinuaClasse from "@/components/classes/criacao/ContinuaClasse"; // @ is an alias to /src
import ContinuaPendente from "@/components/pendentes/ContinuaPendente";

export default {
  components: {
    ContinuaPendente,
    ContinuaClasse
  },

  data: () => ({
    objeto: {},
    objLoaded: false,
    tipoClasse: false
  }),

  created: function() {
    axios
      .get(lhost + "/api/pendentes/" + this.$route.params.idPendente)
      .then(response => {
        this.objeto = response.data;
        switch (this.objeto.tipo) {
          case "Classe":
            this.tipoClasse = true;
            break;
        }
        this.objLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>
