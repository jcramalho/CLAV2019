<template>
  <div>
    <Listagem
      :lista="radas"
      tipo="Relatórios de Avaliação de Documentação Acumulada"
      :cabecalho="[
          'Data de Aprovação',
          'Título',
          'Entidades Responsáveis'
        
      ]"
      :campos="['titulo', 'dataAprovacao', 'entResp']"
    />
    <!--Loading v-if="!fontesRADAReady" :message="'fontes de legitimação'" /-->
    <ListagemLeg
      v-if="fontesRADA.length>0"
      :lista="fontesRADA"
      tipo="TABELAS DE SELEÇÃO INSERIDAS EM RELATÓRIO DE DOCUMENTAÇÃO ACUMULADA"
    />
  </div>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import ListagemLeg from "@/components/tabSel/consulta/ListagemLeg.vue"; // @ is an alias to /src

export default {
  data: () => ({
    radas: [],
    fontesRADA: [],
    fontesRADAReady: false
  }),
  components: {
    Listagem,
    ListagemLeg
  },
  async created() {
    await this.$request("get", "/pgd/rada")
      .then(response2 => {
        this.fontesRADA = response2.data.map(f => {
          return {
            data: f.rada.split("_")[3],
            tipo: "RADA",
            entidade: f.entidade.split("_")[1],
            sumario: "Tabela de Seleção para Documentação Acumulada de " + f.entidade.split("_")[1] + ", relativo ao ano " + f.rada.split("_")[3] +".",
            link: ""
          };
        });
        this.fontesRADAReady = true;
      })
      .catch(e => {
        return e;
      });

  },
  async mounted() {
    try {
      var response = await this.$request("get", "/rada");
      this.radas = response.data;
    } catch (e) {
      return e;
    }
  }
};
</script>
