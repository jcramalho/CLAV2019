<template>
  <div>
    <div>
      <Loading v-if="!radasReady" :message="'fontes de legitimação'" />

      <ListagemRADA 
        v-else
        :lista="radas"
        titulo="RADA/CLAV"
        @download="fazerDownloadRADA"
        @ver="redirecionar"
      />
    </div>

    <div>
      <Loading v-if="!radaAntigosReady" :message="'fontes de legitimação'" />

      <ListagemRADA 
        v-else
        :lista="radaAntigos"
        tipo="RadaAntigo"
        titulo="RADA"
        @download="fazerDownloadRADA"
        @ver="redirecionar"
      />
    </div>
  </div> 
</template>

<script>
import ListagemRADA from "@/components/rada/consulta/ListagemRADA.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";
//import { gerarPDF } from "@/utils/pdfRADA";

export default {
  data: () => ({
    radas: [],
    radasReady: false,
    radaAntigos: [],
    radaAntigosReady: false,
  }),
  components: {
    ListagemRADA, Loading,
  },
  methods: {
    redirecionar(codigo, tipo) {
      if(tipo == 'RadaAntigo')
        this.$router.push("/pgd/" + codigo);
      else
        this.$router.push("/rada/" + codigo);
    },
    async fazerDownloadRADA(codigo, tipo) {
        alert('Funcionalidade desativada para ser revista.')
        //let response = await this.$request("get", "/rada/" + codigo);
        //let rada = response.data;
        //if (!!rada) {
        //  gerarPDF(rada);
      //}
    },
  },
  async created() {
    await this.$request("get", "/rada/old")
      .then((response2) => {
        this.radaAntigos = response2.data.map(f => {
          var idEntidade = f.ent.split('#')[1]
          var isEntidade = idEntidade.split('_')[0] == 'ent'
          return {
            idRADA: f.idRADA,
            idLeg: f.idLeg,
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link,
            entidade: idEntidade.split('_')[1],
            tipoEntidade: isEntidade? 'Entidade' : 'Tipologia',
            estado: f.estado == 'Ativo' ? 'Em vigor' : 'Revogado'
          };
        });
        this.radaAntigosReady = true;
      })
      .catch((e) => {
        console.log("Erro no GET dos RadaOld: " + e);
      });
  },
  async mounted() {
    try {
      var response = await this.$request("get", "/rada");
      this.radas = response.data.map(f => {
          var idEntidade = f.ent.split('#')[1]
          var isEntidade = idEntidade.split('_')[0] == 'ent'
          return {
            idRADA: f.idRADA,
            idLeg: f.idLeg,
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link,
            entidade: idEntidade.split('_')[1],
            tipoEntidade: isEntidade? 'Entidade' : 'Tipologia',
            estado: f.estado == 'Ativo' ? 'Em vigor' : 'Revogado'
          };
        });
      this.radasReady = true;
    } catch (e) {
      console.log("Erro no GET dos Rada: " + e);
    }
  },
};
</script>
