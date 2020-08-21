<template>
  <v-content class="px-12">
    <p class="content-title-1">Legislação</p>
    <p class="content-text px-8 py-2">
      Legislação que regula os processos de negócio e enquadra os respetivos
      prazos de conservação administrativa (PCA) e destino final (DF).
    </p>
    <p class="content-title-2 px-8 py-10 pb-3">
      Para aceder ao catálogo das legislações selecione a opção CONSULTAR.
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor uma nova legislação</b> selecione a opção <b>CRIAR</b>.
      Deve estar <b>registado na CLAV</b> para aceder a esta funcionalidade.
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor uma alteração</b> a uma legislação selecione a opção
      <b>ALTERAR</b>. Deve estar <b>registado na CLAV</b> para aceder a esta
      funcionalidade.
    </p>
    <v-container fluid style="text-align: center;">
      <v-row justify="center" align="center">
        <v-col cols="12" md="4">
          <v-btn
            v-if="
              [1, 3, 3.5, 4, 5, 6, 7].includes(this.$verifyTokenUser().level) &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="$router.push('/legislacao/criar')"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="criar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.721"
              fill="#ffffff"
            />
            <p class="ml-2">Criar</p>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            @click="$router.push('/legislacao/consultar')"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="consultar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.697"
              fill="#ffffff"
            />
            <p class="ml-2">Consultar</p>
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            v-if="
              [4, 5, 6, 7].includes(this.$verifyTokenUser().level) &&
                this.$store.state.token != '' &&
                this.$store.state.name != ''
            "
            @click="legislacaoDialog = true"
            rounded
            class="white--text"
            :class="{
              'px-12': $vuetify.breakpoint.lgAndUp,
              'px-8': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="alterar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.727"
              fill="#ffffff"
            />
            <p class="ml-2">Alterar</p>
          </v-btn>
        </v-col>
      </v-row>
      <!-- Selecionar Legislação a Editar-->
      <v-row justify="center" align="center">
        <v-dialog v-model="legislacaoDialog" max-width="80%">
          <v-card dark class="info-card">
            <v-card-title class="headline mb-2"
              >Selecione a legislação a alterar</v-card-title
            >
            <div class="info-content px-3 mx-6 mb-2">
              <v-card-text class="pa-2 px-4 font-weight-medium">
                <v-row>
                  <v-col v-if="legislacao.ready">
                    <v-tooltip top color="info" open-delay="500">
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          light
                          clearable
                          color="blue darken-3"
                          label="Legislação"
                          :items="legislacao.legislacaoItems"
                          v-model="dadosEditar"
                          v-on="on"
                        />
                      </template>
                      <span v-if="dadosEditar">{{ dadosEditar }}</span>
                      <span v-else>Selecionar legislação</span>
                    </v-tooltip>
                  </v-col>
                  <v-col v-else style="text-align: center;">
                    <p>A carregar legislações...</p>
                    <v-progress-circular
                      indeterminate
                      size="100"
                      width="10"
                      color="blue darken-3"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </div>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="success darken-1"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="editar()"
              >
                Alterar
              </v-btn>
              <v-btn
                color="red darken-4"
                rounded
                dark
                elevation="0"
                class="px-4"
                @click="
                  legislacaoDialog = false;
                  dadosEditar = null;
                "
                >Fechar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "Entidades",
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
      legislacaoDialog: false,
      legislacao: {
        legislacao: [],
        legislacaoItems: [],
        ready: false
      },
      dadosEditar: null
    };
  },
  methods: {
    preparaLegislacoes(legislacoes) {
      this.legislacao.legislacao = JSON.parse(JSON.stringify(legislacoes));
      let dadosTratados = legislacoes.filter(leg => leg.estado === "Ativo");

      dadosTratados = dadosTratados.map(
        legislacao =>
          `${legislacao.numero} - ${legislacao.sumario} - ${legislacao.tipo}`
      );

      this.legislacao.legislacaoItems = dadosTratados;
      this.legislacao.ready = true;
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    editar() {
      let leg = null;
      leg = this.legislacao.legislacao.find(
        legislacao => legislacao.numero === this.dadosEditar.split(" ")[0]
      );
      this.go(`/legislacao/editar/${leg.id}`);
    }
  },
  async created() {
    let responseLegislacoes = await this.$request("get", "/legislacao");
    this.preparaLegislacoes(responseLegislacoes.data);
  }
};
</script>
<style scoped>
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
