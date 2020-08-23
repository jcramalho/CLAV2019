<template>
  <div>
    <Listagem
      :lista="radas"
      v-if="radas.length>0"
      tipo="RADA/CLAV"
      :cabecalho="[
          'Data de Aprovação',
          'Título',
          'Entidades Responsáveis'
        
      ]"
      :campos="['titulo', 'dataAprovacao', 'entResp']"
    />
    <!--Loading v-if="!fontesRADAReady" :message="'fontes de legitimação'" /-->
    <ListagemLeg v-if="fontesRADA.length>0" :lista="fontesRADA" tipo="RADA" />
  </div>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import ListagemLeg from "@/components/tabSel/consulta/ListagemLeg.vue"; // @ is an alias to /src

export default {
  data: () => ({
    radas: [],
    fontesRADA: [],
    fontesRADAReady: false,
  }),
  components: {
    Listagem,
    ListagemLeg,
  },
  async created() {
    await this.$request("get", "/rada/old")
      .then((response2) => {
        this.fontesRADA = response2.data.map((f) => {
          return {
            idRADA: f.idRADA,
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link,
          };
        });
        this.fontesRADAReady = true;
      })
      .catch((e) => {
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
  },
};
</script>
