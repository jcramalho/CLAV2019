<template>
  <div>
    <ContinuaClasse v-if="objLoaded && tipoClasse" :obj="objeto" />
    <ContinuaTSOrg v-else-if="objLoaded && tipoTSOrg" :obj="objeto" />
    <ContinuaTSPluri v-else-if="objLoaded && tipoTSPluri" :obj="objeto" />
    <ContinuaAutoEliminacao v-else-if="objLoaded && tipoAE" :obj="objeto" />
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
import ContinuaAutoEliminacao from "@/components/autosEliminacao/criacao/ContinuarAutoEliminacao";

export default {
  components: {
    ContinuaPendente,
    ContinuaClasse,
    ContinuaTSOrg,
    ContinuaTSPluri,
    ContinuaAutoEliminacao
  },

  data: () => ({
    objeto: {},
    objLoaded: false,
    tipoClasse: false,
    tipoTSOrg: false,
    tipoTSPluri: false,
    tipoAE: false,
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
          case "Auto de Eliminação":
            this.tipoAE = true;
            break;
        }
        this.objLoaded = true;
        // Apaga-se o pendente
        this.$request("delete", "/api/pendentes/" + this.$route.params.idPendente)
          .then(response => {
            console.log('Pendente removido: ' + this.$route.params.idPendente)
          })
          .catch(error => {
            console.log('Erro ao apagar o pendente: ' + error)
          });
      })
      .catch(error => {
        return error;
      });
  }
};
</script>
