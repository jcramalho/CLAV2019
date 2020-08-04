<template>
  <div>
    <div v-if="fontesTSReady">
      <ListagemLeg
        :lista="fontesTS"
        tipo="TABELAS DE SELEÇÃO INSERIDAS NA CLAV"
      />
    </div>
    <div>
      <Loading v-if="!fontesPGDTSReady" :message="'fontes de legitimação'" />
      <ListagemLeg
        v-else
        :lista="fontesPGDTS"
        tipo="TABELAS DE SELEÇÃO INSERIDAS EM PORTARIA DE GESTÃO DE DOCUMENTOS"
      />
    </div>
    <div>
      <Loading v-if="!fontesPGDLCReady" :message="'fontes de legitimação'" />
      <ListagemLeg
        v-else
        :lista="fontesPGDLC"
        tipo="TABELAS DE SELEÇÃO (DERIVADAS DA LC) INSERIDAS EM PORTARIA DE GESTÃO DE DOCUMENTOS"
      />
    </div>
  </div>
</template>
<script>
import ListagemLeg from "@/components/tabSel/consulta/ListagemLeg.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    fontesPGD: [],
    fontesPGDLC: [],
    fontesPGDTS: [],
    fontesPGDLCReady: false,
    fontesPGDTSReady: false,
    fontesTS: [],
    fontesTSReady: false,
  }),

  components: {
    ListagemLeg,
    Loading
  },

  created: async function() {
    await this.$request("get", "/pgd/lc")
      .then(response2 => {
        this.fontesPGDLC = response2.data.map(f => {
          return {
            idPGD: f.idPGD,
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link
          };
        });
        this.fontesPGDLCReady = true;
      })
      .catch(e => {
        return e;
      });

    await this.$request("get", "/legislacao?fonte=PGD")
      .then(response => {
        this.fontesPGD = response.data.map(f => {
          return {
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link
          };
        });
        this.fontesPGDReady = true;
      })
      .catch(e2 => {
        return e2;
      });
    
    await this.$request("get", "/pgd")
      .then(response => {
        this.fontesPGDTS = this.fontesPGD.map(f => {
          var obj = response.data.find(res => res.tipo == f.tipo && res.numero == f.numero)
          if(obj) 
            return {
              idPGD: obj.idPGD,
              data: obj.data,
              tipo: obj.tipo,
              numero: obj.numero,
              sumario: obj.sumario,
              link: obj.link
            };
          else 
            return {
              idPGD: "",
              data: f.data,
              tipo: f.tipo,
              numero: f.numero,
              sumario: f.sumario,
              link: f.link
            };

        });
        this.fontesPGDTSReady = true;
      })
      .catch(e2 => {
        return e2;
      });

      await this.$request("get", "/tabelasSelecao")
      .then(response => {
        this.fontesTS = response.data.map(f => {
          return {
            id: f.id.split("clav#")[1],
            data: f.data,
            designacao: f.designacao,
            entidades: f.entidades.map(e => {return e.split("ent_")[1]}),
            link: ""
          };
        });
        this.fontesTSReady = true;
      })
      .catch(e => {
        return e;
      });

  }
};
</script>
