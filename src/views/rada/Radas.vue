<template>
  <v-card fluid class="pa-3">
    <!-- HEADER -->
    <v-row align="center">
      <v-col cols="12" md="3" align="center">
        <Voltar />
      </v-col>
      <v-col cols="12" md="6" align="center" justify="center">
        <p class="clav-content-title-1">Consultar RADA's</p>
      </v-col>
      <v-col cols="12" md="3"></v-col>
    </v-row>
    <v-card-text>
      <v-row justify="center" class="my-3">
        <v-col cols="12" sm="3" class="text-center">
          <v-btn
            @click="expandAll"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            color="success darken-1"
            id="botao-shadow"
          >
            <unicon
              name="expand-all-icon"
              width="20"
              height="20"
              viewBox="0 0 20.714 20.71"
              fill="#ffffff"
            />
            <p class="ml-2">Expandir Tudo</p>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="3" class="text-center">
          <v-btn
            @click="closeAll"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            style="background-color: rgb(153, 17, 17)"
            id="botao-shadow"
          >
            <unicon
              name="close-all-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.818"
              fill="#ffffff"
            />
            <p class="ml-2">Fechar Tudo</p>
          </v-btn>
        </v-col>
      </v-row>

      <v-expansion-panels multiple v-model="toggles">
        <PainelCLAV titulo="RADA/CLAV" icon="mdi-book">
          <template v-slot:conteudo>
            <Loading v-if="!radasReady" message="fontes de legitimação" />
            <ListagemRADA
              v-else
              :lista="radas"
              @download="fazerDownloadRADA"
              @ver="redirecionar"
            />
          </template>
        </PainelCLAV>
        <PainelCLAV titulo="RADA">
          <template v-slot:icon>
            <v-icon color="secondary"> mdi-book-arrow-up </v-icon>
          </template>
          <template v-slot:conteudo>
            <Loading
              v-if="!radaAntigosReady"
              :message="'fontes de legitimação'"
            />
            <ListagemRADA
              v-else
              :lista="radaAntigos"
              tipo="RadaAntigo"
              @download="fazerDownloadRADA"
              @ver="redirecionar"
            />
          </template>
        </PainelCLAV>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import ListagemRADA from "@/components/rada/consulta/ListagemRADA.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";
import PainelCLAV from "@/components/generic/PainelCLAV";
import Voltar from "@/components/generic/Voltar";
//import { gerarPDF } from "@/utils/pdfRADA";

export default {
  data: () => ({
    radas: [],
    radasReady: false,
    radaAntigos: [],
    radaAntigosReady: false,
    toggles: [],
    sizetoggles: 2,
  }),
  components: {
    ListagemRADA,
    Loading,
    PainelCLAV,
    Voltar,
  },
  methods: {
    // Abrir todos os v-expansion-panel
    expandAll() {
      this.toggles = [...Array(this.sizetoggles).keys()].map((k, i) => i);
    },
    // Fechar todos os v-expansion-panel
    closeAll() {
      this.toggles = [];
    },
    redirecionar(codigo, tipo) {
      if (tipo == "RadaAntigo") this.$router.push("/pgd/" + codigo);
      else this.$router.push("/rada/" + codigo);
    },
    async fazerDownloadRADA(codigo, tipo) {
      alert("Funcionalidade desativada para ser revista.");
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
        this.radaAntigos = response2.data.map((f) => {
          var idEntidade = f.ent.split("#")[1];
          var isEntidade = idEntidade.split("_")[0] == "ent";
          return {
            idRADA: f.idRADA,
            idLeg: f.idLeg,
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link,
            entidade: idEntidade.split("_")[1],
            tipoEntidade: isEntidade ? "Entidade" : "Tipologia",
            estado: f.estado == "Ativo" ? "Em vigor" : "Revogado",
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
      this.radas = response.data.map((f) => {
        var idEntidade = f.ent.split("#")[1];
        var isEntidade = idEntidade.split("_")[0] == "ent";
        return {
          idRADA: f.idRADA,
          idLeg: f.idLeg,
          data: f.data,
          tipo: f.tipo,
          numero: f.numero,
          sumario: f.sumario,
          link: f.link,
          entidade: idEntidade.split("_")[1],
          tipoEntidade: isEntidade ? "Entidade" : "Tipologia",
          estado: f.estado == "Ativo" ? "Em vigor" : "Revogado",
        };
      });
      this.radasReady = true;
    } catch (e) {
      console.log("Erro no GET dos Rada: " + e);
    }
  },
};
</script>
