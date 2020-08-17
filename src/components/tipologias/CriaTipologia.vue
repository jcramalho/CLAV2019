<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
      <!-- HEADER -->
      <v-col class="py-0 my-0">
        <v-btn
          @click="goBack"
          rounded
          class="white--text mb-6"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }"
          id="default-button"
        >
          <unicon
            name="arrow-back-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 37.261"
            fill="#ffffff"
          />
          <p class="ml-2">Voltar</p>
        </v-btn>
        <v-card flat style="border-radius: 10px !important;">
          <p
            class="content-title-1 pt-5"
            style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;"
          >
            Criar Tipologia de Entidade
          </p>
          <!-- Content -->
          <v-card-text class="px-8">
            <v-row>
              <v-col cols="12" lg="2">
                <div class="info-label">Nome da Tipologia</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content pt-3 pb-5 px-5"
                  style="min-height: 50px;"
                >
                  <v-text-field
                    class="mt-n3 px-3"
                    text
                    hide-details
                    single-line
                    clearable
                    label="Nome da Tipologia"
                    color="blue darken-3"
                    maxlength="50"
                    v-model="tipologia.designacao"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Sigla</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content pt-3 pb-5 px-5"
                  style="min-height: 50px;"
                >
                  <v-text-field
                    class="mt-n3 px-3"
                    text
                    hide-details
                    single-line
                    clearable
                    label="Sigla"
                    color="blue darken-3"
                    maxlength="10"
                    v-model="tipologia.sigla"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <!-- Blocos expansivos -->
            <v-expansion-panels flat class="mb-4">
              <v-expansion-panel popout class="mt-6">
                <v-expansion-panel-header
                  style="outline: none;"
                  :class="{
                    'text-center': $vuetify.breakpoint.smAndDown,
                    'text-left': $vuetify.breakpoint.mdAndUp
                  }"
                  class="pa-0"
                >
                  <div
                    :class="{
                      'px-3': $vuetify.breakpoint.mdAndUp
                    }"
                    class="separador"
                  >
                    <unicon
                      class="mt-3"
                      name="entidade-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.711 21.105"
                      fill="#ffffff"
                    />
                    <span class="ml-3 mr-1">Entidades</span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content id="expanded-content">
                  <DesSelEnt
                    :entidades="entSel"
                    tipo="tipologias"
                    @unselectEntidade="unselectEntidade($event)"
                  />

                  <hr style="border-top: 1px dashed #dee2f8;" />

                  <SelEnt
                    :entidadesReady="entidadesReady"
                    :entidades="entidades"
                    @selectEntidade="selectEntidade($event)"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
          <v-snackbar
            v-model="snackbar"
            :timeout="8000"
            color="error"
            :top="true"
          >
            {{ text }}
            <v-btn icon color="white" @click="fecharSnackbar">
              <unicon
                name="remove-icon"
                width="15"
                height="15"
                viewBox="0 0 20.71 20.697"
                fill="#ffffff"
              />
            </v-btn>
          </v-snackbar>
        </v-card>
        <!-- Painel Operações -->
        <PainelOpsTip :t="tipologia" :acao="'Criação'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";
import PainelOpsTip from "@/components/tipologias/PainelOperacoesTipologias";

export default {
  data: () => ({
    tipologia: {
      designacao: "",
      sigla: "",
      estado: "Ativa",
      entidadesSel: [],
      codigo: ""
    },

    // Para o seletor
    entidades: [],
    entSel: [],
    entidadesReady: false,

    snackbar: false,
    text: ""
  }),

  components: {
    DesSelEnt,
    SelEnt,
    PainelOpsTip
  },

  methods: {
    goBack() {
      this.$router.push("/tipologias");
    },
    // Vai à API buscar todas as entidades
    loadEntidades: async function() {
      try {
        let response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
        this.entidadesReady = true;
      } catch (error) {
        return error;
      }
    },

    unselectEntidade: function(entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      let index = this.entSel.findIndex(e => e.id === entidade.id);
      this.entSel.splice(index, 1);
      this.tipologia.entidadesSel = this.entSel;
    },

    selectEntidade: function(entidade) {
      this.entSel.push(entidade);
      this.tipologia.entidadesSel = this.entSel;
      // Remove dos selecionáveis
      let index = this.entidades.findIndex(e => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    }
  },

  created: function() {
    this.loadEntidades();
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  min-height: 50px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
#expanded-content {
  margin-top: -1.1rem;
  margin-right: -0.3rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>
