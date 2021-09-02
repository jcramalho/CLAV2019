<template>
  <v-card flat class="ma-3">
    <v-row>
      <!-- HEADER -->
      <v-col>
        <v-row align="center" justify="center">
          <v-col cols="3" align="center" justify="center">
            <Voltar />
          </v-col>
          <v-col cols="6" align="center" justify="center">
            <p class="clav-content-title-1">Consultar Tabelas de Seleção</p>
          </v-col>
          <v-col cols="3"> </v-col>
        </v-row>
        <!-- CONTENT -->
        <v-card-text class="mt-0">
          <v-row justify="center" class="my-3">
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

          <v-expansion-panels flat multiple v-model="tabsSel">
            <PainelCLAV
              v-if="fontesTSReady"
              titulo="Tabelas de Seleção inseridas na Clav"
              infoHeader="Tabelas de Seleção criadas na Clav"
              :infoBody="myhelp.TS_LC"
            >
              <template v-slot:icon>
                <unicon
                  name="ts-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.71 23.668"
                  fill="#ffffff"
                />
              </template>
              <template v-slot:conteudo>
                <ListagemLeg
                  :lista="fontesTS"
                  tipo="TABELAS DE SELEÇÃO INSERIDAS NA CLAV"
                  :entidades="entidades"
                />
              </template>
            </PainelCLAV>

            <Loading
              v-if="!fontesPGDLCReady"
              :message="'fontes de legitimação'"
            />

            <PainelCLAV
              v-if="fontesPGDLCReady"
              titulo="Tabelas de Seleção (derivadas da LC) inseridas em portaria
                    de gestão de documentos"
              infoHeader="Tabelas de Seleção (derivadas da LC) inseridas em portaria
                    de gestão de documentos"
              :infoBody="myhelp.PGD_LC"
            >
              <template v-slot:icon>
                <unicon
                  name="ts-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.71 23.668"
                  fill="#ffffff"
                />
              </template>
              <template v-slot:conteudo>
                <ListagemLeg
                  :lista="fontesPGDLC"
                  tipo="TABELAS DE SELEÇÃO (DERIVADAS DA LC) INSERIDAS EM PORTARIA DE GESTÃO DE DOCUMENTOS"
                  :entidades="entidades"
                />
              </template>
            </PainelCLAV>

            <Loading
              v-if="!fontesPGDTSReady"
              :message="'fontes de legitimação'"
            />

            <PainelCLAV
              v-if="fontesPGDTSReady"
              titulo="Tabelas de Seleção (não derivadas da LC) inseridas em
                    portaria de gestão de documentos"
              infoHeader="Tabelas de Seleção (não derivadas da LC) inseridas em
                    portaria de gestão de documentos"
              :infoBody="myhelp.PGD"
            >
              <template v-slot:icon>
                <unicon
                  name="ts-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20.71 23.668"
                  fill="#ffffff"
                />
              </template>
              <template v-slot:conteudo>
                <ListagemLeg
                  :lista="fontesPGDTS"
                  tipo="TABELAS DE SELEÇÃO INSERIDAS EM PORTARIA DE GESTÃO DE DOCUMENTOS"
                  :entidades="entidades"
                />
              </template>
            </PainelCLAV>
          </v-expansion-panels>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import ListagemLeg from "@/components/tabSel/consulta/ListagemLeg.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";
import Voltar from "@/components/generic/Voltar";
import PainelCLAV from "@/components/generic/PainelCLAV";

import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";
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
    entidades: [],
    // Array para poder expandir/fechar todos os panels
    tabsSel: [],
    tabsSelItems: 3,
    myhelp: help,
  }),

  components: {
    ListagemLeg,
    Loading,
    //InfoBox,
    Voltar,
    PainelCLAV,
  },
  methods: {
    goBack() {
      this.$router.push("/tsInfo");
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
  created: async function () {
    await this.$request("get", "/pgd/lc")
      .then((response2) => {
        this.fontesPGDLC = response2.data.map((f) => {
          return {
            idPGD: f.idPGD,
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            entidades: f.entidades.map((e) => {
              return e.includes("ent_")
                ? e.split("ent_")[1]
                : e.split("tip_")[1];
            }),
            sumario: f.sumario,
            estado: f.estado,
            link: f.link,
          };
        });
        this.fontesPGDLCReady = true;
      })
      .catch((e) => {
        return e;
      });

    await this.$request("get", "/legislacao?fonte=PGD")
      .then((response) => {
        this.fontesPGD = response.data.map((f) => {
          return {
            data: f.data,
            tipo: f.tipo,
            numero: f.numero,
            entidades: f.entidades,
            sumario: f.sumario,
            estado: f.estado,
            link: f.link,
          };
        });
        this.fontesPGDReady = true;
      })
      .catch((e2) => {
        return e2;
      });

    await this.$request("get", "/pgd")
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
              entidades: obj.entidades.map((e) => {
                return e.includes("ent_")
                  ? e.split("ent_")[1]
                  : e.split("tip_")[1];
              }),
              sumario: obj.sumario,
              estado: obj.estado,
              link: obj.link,
            };
          else
            return {
              idPGD: "",
              data: f.data,
              tipo: f.tipo,
              numero: f.numero,
              entidades: f.entidades ? f.entidades : [],
              sumario: f.sumario,
              estado: f.estado ? f.estado : "Ativo",
              link: f.link,
            };
        });
        this.fontesPGDTSReady = true;
      })
      .catch((e2) => {
        return e2;
      });

    await this.$request("get", "/tabelasSelecao")
      .then((response) => {
        this.fontesTS = response.data.map((f) => {
          return {
            id: f.id.split("clav#")[1],
            data: f.data,
            tipo: f.tipoLeg,
            numero: f.numLeg,
            sumario: f.designacao,
            entidades: f.entidades.map((e) => {
              return e.includes("ent_")
                ? e.split("ent_")[1]
                : e.split("tip_")[1];
            }),
            estado: f.estado ? f.estado : "Ativo",
            link: "",
          };
        });
        this.fontesTSReady = true;
      })
      .catch((e) => {
        return e;
      });

    await this.fontesPGDTS.map(async (obj) => {
      var leg =
        obj.idPGD != ""
          ? await this.$request(
              "get",
              `/legislacao/${obj.idPGD.split("pgd_")[1]}`
            )
          : "";
      leg && leg.data.entidades1.length > 0
        ? (obj.entidades = leg.data.entidades1.map((e) => {
            return e.id.includes("ent_")
              ? e.id.split("ent_")[1]
              : e.id.split("tip_")[1];
          }))
        : "";
    });

    await this.fontesPGDLC.map(async (obj) => {
      var leg =
        obj.idPGD != ""
          ? await this.$request(
              "get",
              `/legislacao/${obj.idPGD.split("pgd_lc_")[1]}`
            )
          : "";
      leg && leg.data.entidades1.length > 0
        ? (obj.entidades = leg.data.entidades1.map((e) => {
            return e.id.includes("ent_")
              ? e.id.split("ent_")[1]
              : e.id.split("tip_")[1];
          }))
        : "";
    });
    // Faz load de todas as entidades

    await this.$request("get", "/entidades")
      .then((response) => {
        this.entidades = response.data.map(function (item) {
          return item.sigla;
        });
      })
      .catch((err) => {
        return err;
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
