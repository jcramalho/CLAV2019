<template>
  <div>
    <ContinuaClasse v-if="objLoaded && tipoClasse" :obj="objeto" />
    <ContinuaTSOrg v-else-if="objLoaded && tipoTSOrg" :obj="objeto" />
    <ContinuaTSPluri v-else-if="objLoaded && tipoTSPluri" :obj="objeto" />
    <ContinuaPendente v-else-if="objLoaded" :obj="objeto" />
    <v-alert v-else type="warning">
      Por algum motivo não foi possível carregar o trabalho pretendido. Contacte
      o administrador.
    </v-alert>
  </div>
</template>

<script>
import ContinuaClasse from "@/components/classes/criacao/ContinuaClasse"; // @ is an alias to /src
import ContinuaPendente from "@/components/pendentes/ContinuaPendente";
import ContinuaTSOrg from "@/components/tabSel/criacaoTSOrg/ContCriaTabSelOrg";
import ContinuaTSPluri from "@/components/tabSel/criacaoTSPluri/ContCriaTabSelPluri";

export default {
  components: {
    ContinuaPendente,
    ContinuaClasse,
    ContinuaTSOrg,
    ContinuaTSPluri
  },

  data: () => ({
    objeto: {},
    objLoaded: false,
    tipoClasse: false,
    tipoTSOrg: false,
    tipoTSPluri: false
  }),

  created: function() {
    this.$request("get", "/api/pendentes/" + this.$route.params.idPendente)
      .then(response => {
        this.objeto = response.data;
        switch (this.objeto.tipo) {
          case "Classe":
            this.tipoClasse = true;
            break;
          case "TS Organizacional":
            this.tipoTSOrg = true;
            break;
          case "TS Pluriorganizacional":
            this.tipoTSPluri = true;
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
