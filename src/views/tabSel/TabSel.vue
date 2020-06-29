<template>
  <div>
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
    <div>
      <Loading v-if="!fontesRADAReady" :message="'fontes de legitimação'" />
      <ListagemLeg
        v-else
        :lista="fontesRADA"
        tipo="TABELAS DE SELEÇÃO INSERIDAS EM RELATÓRIO DE DOCUMENTAÇÃO ACUMULADA"
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
    fontesRADAReady: false
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

    await this.$request("get", "/pgd/rada")
      .then(response2 => {
        this.fontesRADA = response2.data.map(f => {
          return {
            data: f.rada.split("_")[3],
            tipo: "RADA",
            entidade: f.entidade.split("_")[1],
            sumario: "Tabela de Seleção para Documentação Acumulada da entidade " + f.entidade.split("_")[1] + ", no ano de " + f.rada.split("_")[3] +".",
            link: ""
          };
        });
        this.fontesRADAReady = true;
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
  }
};
</script>
