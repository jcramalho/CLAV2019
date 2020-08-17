<template>
  <v-content class="px-12">
    <p class="content-title-1">Entidades</p>
    <p class="content-text px-8 py-2">
      Entidades públicas que intervêm nos processos de negócio (classes de 3º
      nível) da Lista Consolidada. Podem integrar uma ou mais tipologias de
      entidades.
    </p>
    <p class="content-title-2 px-8 py-10 pb-3">
      Para aceder ao catálogo das entidades selecione a opção CONSULTAR.
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor uma nova entidade</b> para a Lista Consolidada selecione a
      opção <b>CRIAR</b>. Deve estar <b>registado na CLAV</b> para aceder a esta
      funcionalidade.
    </p>
    <p class="content-text px-8 py-2">
      Para <b>propor uma alteração</b> a uma entidade da Lista Consolidada
      selecione a opção <b>ALTERAR</b>. Deve estar <b>registado na CLAV</b> para
      aceder a esta funcionalidade.
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
            @click="$router.push('/entidades/criar')"
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
            @click="$router.push('/entidades/consultar')"
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
            @click="entidadesDialog = true"
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
      <!-- Selecionar Entidade a Editar-->
      <v-row justify="center" align="center">
        <v-dialog v-model="entidadesDialog" max-width="80%">
          <v-card dark class="info-card">
            <v-card-title class="headline mb-2">
              Selecione a entidade a alterar</v-card-title
            >
            <div class="info-content px-3 mx-6 mb-2">
              <v-card-text class="pa-2 px-4 font-weight-medium">
                <v-row>
                  <v-col v-if="entidades.ready">
                    <v-tooltip top color="info" open-delay="500">
                      <template v-slot:activator="{ on }">
                        <v-autocomplete
                          light
                          clearable
                          color="blue darken-3"
                          label="Entidade"
                          :items="entidades.entidades"
                          v-model="dadosEditar"
                          v-on="on"
                        />
                      </template>
                      <span v-if="dadosEditar">{{ dadosEditar }}</span>
                      <span v-else>Selecionar entidade</span>
                    </v-tooltip>
                  </v-col>
                  <v-col v-else style="text-align: center;">
                    <p>A carregar entidades...</p>
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
              <v-spacer></v-spacer>
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
                  entidadesDialog = false;
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
      entidadesDialog: false,
      entidades: {
        entidades: [],
        ready: false
      },
      dadosEditar: null
    };
  },
  methods: {
    preparaEntidades(dados) {
      let dadosTratados = dados.filter(dado => dado.estado === "Ativa");
      dadosTratados = dadosTratados.map(
        dado => `${dado.sigla} - ${dado.designacao}`
      );
      this.entidades.entidades = dadosTratados;
      this.entidades.ready = true;
    },
    go: function(url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
    editar() {
      this.go(`/entidades/editar/ent_${this.dadosEditar.split(" ")[0]}`);
    }
  },
  async created() {
    let responseEntidades = await this.$request(
      "get",
      "/entidades?processos=sem"
    );
    this.preparaEntidades(responseEntidades.data);
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
