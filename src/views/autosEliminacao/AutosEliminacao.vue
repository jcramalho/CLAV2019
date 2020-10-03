<template>
  <Listagem
    v-bind:lista="autosEliminacao"
    tipo="Autos de Eliminação"
    v-bind:cabecalho="[
      'Identificação',
      'Fonte de Legitimação',
      'Diploma Legislativo',
      'Entidade Produtora',
      'Data'
    ]"
    v-bind:campos="['id', 'tipo', 'numero', 'entidade', 'data']"
  />
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src

export default {
  data: () => ({
    autosEliminacao: [],
    campos: []
  }),
  components: {
    Listagem
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/autosEliminacao");
      this.autosEliminacao = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function(listaAutosEliminacao) {
      try {
        var myTree = [];
        for (var i = 0; i < listaAutosEliminacao.length; i++) {
          var obj = {
            id: listaAutosEliminacao[i].id.split("#")[1].replace("ae_", "").replace(/\_/g,"/"),
            tipo: listaAutosEliminacao[i].fonte || listaAutosEliminacao[i].autoTipo.replace(/\_/g,"/"),
            fonte: listaAutosEliminacao[i].tipo + " " + listaAutosEliminacao[i].numero,
            entidade: listaAutosEliminacao[i].entidade
              .split("#")[1]
              .replace("ent_", ""),
            data: listaAutosEliminacao[i].data
          };
          if(listaAutosEliminacao[i].referencialLabel) { 
            obj.fonte = listaAutosEliminacao[i].referencialLabel
          }
          else if(listaAutosEliminacao[i].referencialTitulo) {
            obj.fonte = listaAutosEliminacao[i].referencialTitulo
          }
          myTree.push(obj);
        }
        return myTree;
      } catch (error) {
        return [];
      }
    }
  }
};
</script>
