<template>
  <div>
    <Loading v-if="!legislacaoReady" :message="'legislações'" />
    <Listagem
      v-else
      :lista="legislacao"
      tipo="Legislação"
      :cabecalho="cabecalhos"
      :campos="campos"
      :ids="ids"
    />
  </div>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    legislacao: [],
    campos: [],
    cabecalhos: [],
    operacoes: [],
    ids: [],
    legislacaoReady: false
  }),
  components: {
    Listagem,
    Loading
  },

  methods: {
    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração" }
          // { icon: "delete_outline", descricao: "Remoção" }
        ];
      }
    },

    preparaCabecalhos(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.cabecalhos = [
          "Data",
          "Tipo",
          "Entidade(s)",
          "Número",
          "Sumário",
          "Operações"
        ];
        this.campos = [
          "data",
          "tipo",
          "entidades",
          "numero",
          "sumario",
          "operacoes"
        ];
      } else {
        this.cabecalhos = ["Data", "Tipo", "Entidade(s)", "Número", "Sumário"];
        this.campos = ["data", "tipo", "entidades", "numero", "sumario"];
      }
    },

    preparaLista(listaLegislacao) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaLegislacao.length; i++) {
          let temp = "";

          for (let j = 0; j < listaLegislacao[i].entidades.length; j++) {
            if (temp === "") {
              temp = listaLegislacao[i].entidades[j].sigla;
            } else {
              temp = temp + "," + listaLegislacao[i].entidades[j].sigla;
            }
          }

          listaLegislacao[i].entidades = temp;

          myTree.push({
            data: listaLegislacao[i].data,
            tipo: listaLegislacao[i].tipo,
            entidades: listaLegislacao[i].entidades,
            numero: listaLegislacao[i].numero,
            sumario: listaLegislacao[i].sumario,
            operacoes: this.operacoes,
            id: listaLegislacao[i].id
          });
        }
      } else {
        for (let i = 0; i < listaLegislacao.length; i++) {
          let temp = "";

          for (let j = 0; j < listaLegislacao[i].entidades.length; j++) {
            if (temp === "") {
              temp = listaLegislacao[i].entidades[j].sigla;
            } else {
              temp = temp + "," + listaLegislacao[i].entidades[j].sigla;
            }
          }

          listaLegislacao[i].entidades = temp;

          myTree.push({
            data: listaLegislacao[i].data,
            tipo: listaLegislacao[i].tipo,
            entidades: listaLegislacao[i].entidades,
            numero: listaLegislacao[i].numero,
            sumario: listaLegislacao[i].sumario,
            id: listaLegislacao[i].id
          });
        }
      }

      return myTree;
    },

    preparaIds(listaLegislacao) {
      let ids = [];

      for (let i = 0; i < listaLegislacao.length; i++) {
        ids.push({
          numero: listaLegislacao[i].numero,
          id: listaLegislacao[i].id
        });
      }

      return ids;
    }
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/api/legislacao");

      let level = await this.$userLevel(this.$store.state.token);

      this.preparaCabecalhos(level);

      this.preparaOperacoes(level);

      this.legislacao = this.preparaLista(response.data);

      this.ids = this.preparaIds(response.data);

      this.legislacaoReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
