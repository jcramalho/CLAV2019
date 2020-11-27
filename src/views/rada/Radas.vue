<template>
  <div>
    <Loading v-if="!fontesRadaReady" :message="'fontes de legitimação'" />
    <Listagem
      :lista="radas"
      v-else
      tipo="RADA/CLAV"
      :cabecalho="[
        'Data de Aprovação',
        'Título',
        'Entidades Responsáveis',
        'Estado',
        'Acessos',
      ]"
      :campos="['titulo', 'dataAprovacao', 'entResp', 'estado']"
      @download="fazerDownloadRADA"
      @ver="redirecionar"
    />
    
    <Loading v-if="!fontesRadaOldReady" :message="'fontes de legitimação'" />
    <ListagemLeg v-else :lista="fontesRADA" tipo="RADA" />
  </div>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import ListagemLeg from "@/components/tabSel/consulta/ListagemLeg.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";
import { gerarPDF } from "@/utils/pdfRADA";

export default {
  data: () => ({
    radas: [],
    fontesRadaReady: false,
    fontesRADA: [],
    fontesRadaOldReady: false
  }),
  components: {
    Listagem,
    ListagemLeg,
    Loading
  },
  methods: {
    redirecionar(codigo) {
      this.$router.push("/rada/" + codigo);
    },
    async fazerDownloadRADA(codigo) {
      let response = await this.$request("get", "/rada/" + codigo);
      let rada = response.data;

      if (!!rada) {
        gerarPDF(rada);
      }
    },
  },
  async created() {
    await this.$request("get", "/rada/old")
      .then(response2 => {
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
        this.fontesRadaOldReady = true
      })
      .catch((e) => {
          return e;
      });
  },
  async mounted() {
    try {
      var response = await this.$request("get", "/rada");
      this.radas = response.data;
      this.fontesRadaReady = true
    } catch (e) {
      console.log('Erro no GET dos Rada: ' + e)
    }
  },
};
</script>
