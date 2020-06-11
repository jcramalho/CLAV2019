<template>
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
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src

export default {
  data: () => ({
    radas: []
  }),
  components: {
    Listagem
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
