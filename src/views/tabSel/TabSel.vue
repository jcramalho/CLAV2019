<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
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
              'px-2': $vuetify.breakpoint.mdAndDown,
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
              Consultar Tabelas de Seleção
            </p>
            <!-- CONTENT -->
            <v-card-text class="mt-0">
              <v-row justify="center" class="mt-3">
                <v-col cols="12" md="3" class="text-center">
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
                <v-col cols="12" md="3" class="text-center">
                  <v-btn
                    @click="closeAll"
                    rounded
                    class="white--text"
                    :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown,
                    }"
                    style="background-color: rgb(153, 17, 17);"
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

              <v-expansion-panels flat multiple v-model="tabsSel" class="mt-4">
                <v-expansion-panel popout v-if="fontesTSReady">
                  <v-expansion-panel-header
                    style="outline: none"
                    :class="{
                      'text-center': $vuetify.breakpoint.smAndDown,
                      'text-left': $vuetify.breakpoint.mdAndUp,
                    }"
                    class="pa-3"
                  >
                    <div
                      :class="{
                        'px-3': $vuetify.breakpoint.mdAndUp,
                      }"
                      class="separador"
                    >
                      <unicon
                        class="mt-3"
                        name="ts-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 23.668"
                        fill="#ffffff"
                      />
                      <span class="ml-3 mr-1"
                        >Tabelas de Seleção inseridas na Clav</span
                      >
                      <InfoBox header="Tabelas de Seleção criadas na Clav" :text="myhelp.TS_LC" helpColor="white" helpWidth="80%"/>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="expanded-content">
                    <v-row>
                      <v-col>
                        <ListagemLeg
                          :lista="fontesTS"
                          tipo="TABELAS DE SELEÇÃO INSERIDAS NA CLAV"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                
                <Loading
                  v-if="!fontesPGDLCReady"
                  :message="'fontes de legitimação'"
                />
                <v-expansion-panel popout v-if="fontesPGDLCReady">
                  <v-expansion-panel-header
                    style="outline: none"
                    :class="{
                      'text-center': $vuetify.breakpoint.smAndDown,
                      'text-left': $vuetify.breakpoint.mdAndUp,
                    }"
                    class="pa-3"
                  >
                    <div
                      :class="{
                        'px-3': $vuetify.breakpoint.mdAndUp,
                      }"
                      class="separador"
                    >
                      <unicon
                        class="mt-3"
                        name="ts-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 23.668"
                        fill="#ffffff"
                      />
                      <span class="ml-3 mr-1"
                        >Tabelas de Seleção (derivadas da LC) inseridas em
                        portaria de gestão de documentos</span
                      >
                      <InfoBox header="PGD/LC inseridas em PGD" :text="myhelp.PGD_LC" helpColor="white" helpWidth="80%"/>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="expanded-content">
                    <v-row>
                      <v-col>
                        <ListagemLeg
                          :lista="fontesPGDLC"
                          tipo="TABELAS DE SELEÇÃO (DERIVADAS DA LC) INSERIDAS EM PORTARIA DE GESTÃO DE DOCUMENTOS"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <Loading
                  v-if="!fontesPGDTSReady"
                  :message="'fontes de legitimação'"
                />
                <v-expansion-panel popout v-if="fontesPGDTSReady">
                  <v-expansion-panel-header
                    style="outline: none"
                    :class="{
                      'text-center': $vuetify.breakpoint.smAndDown,
                      'text-left': $vuetify.breakpoint.mdAndUp,
                    }"
                    class="pa-3"
                  >
                    <div
                      :class="{
                        'px-3': $vuetify.breakpoint.mdAndUp,
                      }"
                      class="separador"
                    >
                      <unicon
                        class="mt-3"
                        name="ts-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20.71 23.668"
                        fill="#ffffff"
                      />
                      <span class="ml-3 mr-1"
                        >Tabelas de Seleção (não derivadas da LC) inseridas em portaria de gestão de
                        documentos</span
                      >
                      <InfoBox header="TS inseridas em PGD" :text="myhelp.PGD" helpColor="white" helpWidth="80%"/>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content id="expanded-content">
                    <v-row>
                      <v-col>
                        <ListagemLeg
                          :lista="fontesPGDTS"
                          tipo="TABELAS DE SELEÇÃO INSERIDAS EM PORTARIA DE GESTÃO DE DOCUMENTOS"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<script>
import ListagemLeg from '@/components/tabSel/consulta/ListagemLeg.vue'; // @ is an alias to /src
import Loading from '@/components/generic/Loading';

import { NIVEL_MINIMO_ALTERAR } from '@/utils/consts';
const help = require("@/config/help").help.TS.Consulta;
import InfoBox from "@/components/generic/infoBox.vue";

export default {
  data: () => ({
    fontesPGD: [],
    fontesPGDLC: [],
    fontesPGDTS: [],
    fontesPGDLCReady: false,
    fontesPGDTSReady: false,
    fontesTS: [],
    fontesTSReady: false,
    // Array para poder expandir/fechar todos os panels
    tabsSel: [],
    tabsSelItems: 3,
    myhelp: help
  }),

  components: {
    ListagemLeg,
    Loading,
    InfoBox
  },
  methods: {
    goBack() {
      this.$router.push('/tsInfo');
    },
    // Abrir todos os v-expansion-panel
    expandAll() {
      this.tabsSel = [...Array(this.tabsSelItems).keys()].map((k, i) => i);
    },
    // Fechar todos os v-expansion-panel
    closeAll() {
      this.tabsSel = [];
    },
  },
  created: async function() {
    await this.$request('get', '/pgd/lc')
      .then((response2) => {
        this.fontesPGDLC = response2.data.map((f) => {
          return {
            idPGD: f.idPGD,
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link,
          };
        });
        this.fontesPGDLCReady = true;
      })
      .catch((e) => {
        return e;
      });

    await this.$request('get', '/legislacao?fonte=PGD')
      .then((response) => {
        this.fontesPGD = response.data.map((f) => {
          return {
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            sumario: f.sumario,
            link: f.link,
          };
        });
        this.fontesPGDReady = true;
      })
      .catch((e2) => {
        return e2;
      });

    await this.$request('get', '/pgd')
      .then((response) => {
        this.fontesPGDTS = this.fontesPGD.map((f) => {
          var obj = response.data.find(
            (res) => res.tipo == f.tipo && res.numero == f.numero
          );
          if (obj)
            return {
              idPGD: obj.idPGD,
              data: obj.data,
              tipo: obj.tipo,
              numero: obj.numero,
              sumario: obj.sumario,
              link: obj.link,
            };
          else
            return {
              idPGD: '',
              data: f.data,
              tipo: f.tipo,
              numero: f.numero,
              sumario: f.sumario,
              link: f.link,
            };
        });
        this.fontesPGDTSReady = true;
      })
      .catch((e2) => {
        return e2;
      });

    await this.$request('get', '/tabelasSelecao')
      .then((response) => {
        this.fontesTS = response.data.map((f) => {
          return {
            id: f.id.split('clav#')[1],
            data: f.data,
            designacao: f.designacao,
            entidades: f.entidades.map((e) => {
              return e.split('ent_')[1];
            }),
            link: '',
          };
        });
        this.fontesTSReady = true;
      })
      .catch((e) => {
        return e;
      });
  },
};
</script>
<style scoped>
.separador {
  color: white;
  padding: 5px;
  margin: 5px;
  font-weight: 400;
  width: 100%;
  min-height: 50px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
#expanded-content {
  margin-right: 12px !important;
  margin-left: 17px !important;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>
