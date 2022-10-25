<template>
  <div>
    <v-card class="ma-4">
      <v-app-bar class="clav-linear-background white--text">
        <v-toolbar-title class="card-heading">Novo Auto de Eliminação</v-toolbar-title>
      </v-app-bar>

      <v-card-text>
        <v-stepper v-model="steps" vertical>
          <v-stepper-step :complete="steps > 1" step="1">
            Seleção de fonte e fundo
            <span v-if="steps > 1">
              <v-chip class="ma-2" color="indigo darken-4" text-color="white" label>
                <v-icon left>description</v-icon>
                <span v-if="auto.legislacao">{{ console.log(JSON(auto.legislacao))}}</span>
              </v-chip>
            </span>
            <span v-if="steps > 1">
              <v-chip
                v-for="e in auto.entidades"
                :key="e.entidade"
                class="ma-2"
                color="indigo darken-4"
                text-color="white"
                label
              >
                <v-icon left>account_balance</v-icon>
                {{ e.entidade + ' - ' + e.designacao }}
              </v-chip>
            </span>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-row>
              <v-col :md="2">
                <div class="info-label">Fonte de legitimação</div>
              </v-col>
              <v-col>
                <v-radio-group row v-model="tipo" :mandatory="true" :disabled="steps > 1">
                  <v-radio value="TS_LC">
                    <template v-slot:label>
                      <div class="mt-2">
                        TS/LC
                        <InfoBox
                          header="Fonte de Legitimação - TS/LC"
                          :text="myhelp.AutoEliminacao.Campos.TS_LC"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="PGD_LC">
                    <template v-slot:label>
                      <div class="mt-2">
                        PGD/LC
                        <InfoBox
                          header="Fonte de Legitimação - PGD/LC"
                          :text="myhelp.AutoEliminacao.Campos.PGD_LC"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="PGD">
                    <template v-slot:label>
                      <div class="mt-2">
                        PGD
                        <InfoBox
                          header="Fonte de Legitimação - PGD"
                          :text="myhelp.AutoEliminacao.Campos.PGD"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="RADA">
                    <template v-slot:label>
                      <div class="mt-2">
                        RADA
                        <InfoBox
                          header="Fonte de Legitimação - RADA"
                          :text="myhelp.AutoEliminacao.Campos.RADA"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>

                  <v-radio value="RADA_CLAV">
                    <template v-slot:label>
                      <div class="mt-2">
                        RADA/CLAV
                        <InfoBox
                          header="Fonte de Legitimação - RADA/CLAV"
                          :text="myhelp.AutoEliminacao.Campos.RADA_CLAV"
                          helpColor="indigo darken-4"
                          dialogColor="#E0F2F1"
                        />
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
                <div v-if="tipo == 'PGD_LC'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portariaLC"
                    item-text="label"
                    item-value="codigo"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
                <div v-else-if="tipo == 'TS_LC'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="tabelasSelecao"
                    item-text="titulo"
                    return-object
                    v-model="auto.legislacao"
                    solo
                    dense
                  />
                </div>
                <div v-else-if="tipo == 'PGD'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portaria"
                    item-text="label"
                    item-value="codigo"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
                <div v-else-if="tipo == 'RADA'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portariaRada"
                    item-text="label"
                    item-value="codigo"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
                <div v-else>
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="tsRada"
                    item-text="titulo"
                    return-object
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="2">
                <div class="info-label">Entidades</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  deletable-chips
                  label="Selecione a(s) entidade(s) produtora(s) da documentação"
                  :items="entidades"
                  item-value="entidade"
                  item-text="designacao"
                  v-model="auto.entidades"
                  solo
                  dense
                  chips
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-btn
              class="ma-2"
              color="indigo darken-4"
              dark
              rounded
              @click="carregaFonteLegitimacao(); steps=2;"
              :disabled="!auto.legislacao || auto.entidades.length == 0"
              >Continuar</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="steps > 2" step="2">
            Identificação de classes / séries e agregações / unidades de instalação
          </v-stepper-step>

          <v-stepper-content step="2">
            <Loading v-if="classes.length == 0" :message="'Fonte de Legitimação'" />

            <div class="mt-5" v-else>
              <!-- Adicionar Zona Controlo -->
              <AdicionarZonaControlo
                v-bind:classes="classes"
                v-bind:entidades="entidades"
                v-bind:auto="auto"
                v-bind:classesCompletas="classesCompletas"
                v-bind:donos="donos"
                v-bind:tipo="tipo"
              />

              <!-- Zonas de Controlo -->
              <ListaZonasControlo
                v-bind:auto="auto"
                v-bind:classes="classes"
                v-bind:entidades="entidades"
                v-bind:classesCompletas="classesCompletas"
                v-bind:donos="donos"
                v-bind:tipo="tipo"
              />
            </div>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
    
  </div>
</template>

<script>
import AdicionarClasse from "@/components/autosEliminacao/criacao/AdicionarClasse.vue";
import ListaZonasControlo from "@/components/autosEliminacao/criacao/ListaZonasControlo.vue";
import InfoBox from "@/components/generic/infoBox.vue";
const help = require("@/config/help").help;
import Loading from "@/components/generic/Loading";
import { criarHistorico } from "@/utils/utils";

export default {
  props: ["entidades"],
  components: {
    AdicionarClasse,
    ListaZonasControlo,
    InfoBox,
    Loading,
  },
  data: () => ({
    myhelp: help,
    classes: [],
    classesCompletas: [],
    auto: {
      legislacao: {},
      entidades: [],
      classes: [],
    },
    portariaLC: [],
    portaria: [],
    portariaRada: [],
    tabelasSelecao: [],
    tsRada: [],
    numInterv: 0,
    _id: null,
    tipo: "",
    donos: [],
    steps: 1,
    erro: null,
    erroDialog: false,
    success: null,
    successDialog: false,
    codigoPedido: "",
    guardadoSuccess: false,
    pendenteGuardado: false,
    pendenteGuardadoInfo: null,
    eliminar: false,
  }),
  created: async function () {
    try {
      var user = this.$verifyTokenUser();
      let user_entidade = await this.$request("get", "/entidades/" + user.entidade);

      this.auto.entidades.push({
        entidade: user_entidade.data.sigla,
        designacao: user_entidade.data.designacao
      });
    } catch (e) {
      // Criar dialog para abortar o processo...
      console.log("Erro ao carregar a informação inicial: " + e);
    }
  },

  methods: {
    showMe: function(){
        console.log(JSON.stringify(this.auto.legislacao))
    },

    carregaFonteLegitimacao: async function(){
        if(this.tipo == "RADA")
            var fonte = await this.$request("get", "/rada/old/tsRada_leg_" + this.auto.legislacao);
        else if(this.tipo == "PGD")
            var fonte = await this.$request("get", "/pgd/pgd_leg_" + this.auto.legislacao);
        else if(this.tipo == "PGD/LC")
            var fonte = await this.$request("get", "/pgd/pgd_lc_leg_" + this.auto.legislacao);
        else 
            console.log("Tipo de fonte ainda não suportado...")

        this.classesCompletas = fonte.data
          .filter((c) => c.nivel > 2)
          .map((c) => {
            return {
              idClasse: c.classe,
              nivel: c.nivel,
              codigo: c.codigo,
              referencia: c.referencia,
              titulo: c.titulo,
              df: { valor: c.df, nota: c.notaDF },
              pca: { valores: c.pca, notas: c.notaPCA },
            };
          });

        this.classes = this.classesCompletas.map((c) => {
          if (c.codigo && c.referencia)
            return "" + c.codigo + " - " + c.referencia + " - " + c.titulo;
          else if (c.codigo) return "" + c.codigo + " - " + c.titulo;
          else if (c.referencia) return "" + c.referencia + " - " + c.titulo;
        });
        console.log(JSON.stringify(this.classesCompletas))
    },

    prepararLeg: async function (leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          l.label = l.tipo + " " + l.numero + " - " + l.sumario
          myPortarias.push(l);
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },
    filtrarDonos: async function () {
      if (typeof this.auto.legislacao != "string") {
        this.auto.referencial = this.auto.legislacao.codigo;
        this.auto.legislacao = this.auto.legislacao.titulo;
      }
      this.donos = this.entidades;

      for (var entidade of this.auto.entidades) {
        this.donos = this.donos.filter((e) => e.entidade != entidade);

        for (var classe of this.auto.classes) {
          classe.dono = classe.dono.filter((e) => !e.includes(entidade.entidade));
        }
      }

      if (this.tipo == "TS_LC") {
        var response = await this.$request(
          "get",
          "/tabelasSelecao/" + this.auto.referencial
        );
        this.classesCompletas = response.data.classes
          .filter((c) => c.nivel > 2)
          .map((c) => {
            return {
              idClasse: "c" + c.codigo + "_" + this.auto.referencial,
              nivel: c.nivel,
              codigo: c.codigo,
              referencia: c.referencia,
              titulo: c.titulo,
              df: { valor: c.df.valor, nota: c.df.nota || "" },
              pca: { valores: c.pca.valores, notas: c.pca.nota || "" },
            };
          });
        this.classesCompletas = this.classesCompletas.filter((c) => this.validaPCAeDF(c));
        this.classes = this.classesCompletas.map((c) => {
          return c.codigo + " - " + c.titulo;
        });
      } else if (this.tipo == "PGD" || this.tipo == "PGD_LC" || this.tipo == "RADA") {
        var response = await this.$request("get", "/legislacao");
        var legAux = this.auto.legislacao.split(" - ");
        legAux = legAux[0].split(" ");
        var indLeg = legAux.length - 1;
        var autoAux = this.auto.legislacao.split(" ");

        var leg = response.data.filter(
          (l) => l.numero === autoAux[indLeg] && l.tipo === autoAux[0]
        );

        if (this.tipo == "PGD")
          var response2 = await this.$request("get", "/pgd/pgd_" + leg[0].id);
        else if (this.tipo == "PGD_LC")
          var response2 = await this.$request("get", "/pgd/pgd_lc_" + leg[0].id);
        else var response2 = await this.$request("get", "/rada/old/tsRada_" + leg[0].id);

        this.classesCompletas = response2.data
          .filter((c) => c.nivel > 2)
          .map((c) => {
            return {
              idClasse: c.classe,
              nivel: c.nivel,
              codigo: c.codigo,
              referencia: c.referencia,
              titulo: c.titulo,
              df: { valor: c.df, nota: c.notaDF },
              pca: { valores: c.pca, notas: c.notaPCA },
            };
          });

        this.classesCompletas = this.classesCompletas.filter((c) => this.validaPCAeDF(c));
        if (this.tipo == "PGD" || this.tipo == "RADA")
          this.classesCompletas = this.classesCompletas.filter((c) => c.df.valor != "C");

        this.classes = this.classesCompletas.map((c) => {
          if (c.codigo && c.referencia)
            return "" + c.codigo + " - " + c.referencia + " - " + c.titulo;
          else if (c.codigo) return "" + c.codigo + " - " + c.titulo;
          else if (c.referencia) return "" + c.referencia + " - " + c.titulo;
        });
      } else if (this.tipo == "RADA_CLAV") {
        var response = await this.$request("get", "/rada/" + this.auto.referencial);
        this.classesCompletas = response.data.tsRada
          .filter((c) => c.df && c.pca)
          .map((c) => {
            return {
              idClasse: c.classes.split("#")[1],
              codigo: c.codigo,
              referencia: c.referencia,
              titulo: c.titulo,
              df: { valor: c.df.df, nota: c.df.notadf },
              pca: { valores: c.pca.pca, notas: c.pca.notaPCA },
            };
          });
        this.classesCompletas = this.classesCompletas.filter((c) => c.df.valor != "C");
        this.classes = this.classesCompletas.map((c) => {
          if (c.codigo && c.referencia)
            return "" + c.codigo + " - " + c.referencia + " - " + c.titulo;
          else if (c.codigo) return "" + c.codigo + " - " + c.titulo;
          else if (c.referencia) return "" + c.referencia + " - " + c.titulo;
        });
      } else {
        this.classes = [];
        this.classesCompletas = [];
      }
    },
  },
  watch: {
    tipo: async function () {
      try {
        this.auto.legislacao = null;
        if (this.tipo == "TS_LC") {
          var response = await this.$request("get", "/tabelasSelecao");
          this.tabelasSelecao = response.data.map((ts) => {
            return {
              titulo: ts.designacao,
              codigo: ts.id.split("clav#")[1],
            };
          });
        }
        if (this.tipo == "PGD_LC") {
          var response = await this.$request("get", "/pgd/lc");
          this.portariaLC = await this.prepararLeg(response.data);
        }
        if (this.tipo == "PGD") {
          // var response = await this.$request("get", "/pgd");
          var response = await this.$request("get", "/legislacao?fonte=PGD");
          this.portaria = await this.prepararLeg(response.data);
        }
        if (this.tipo == "RADA") {
          var response = await this.$request("get", "/legislacao?fonte=RADA");
          this.portariaRada = await this.prepararLeg(response.data);
        } else {
          var response = await this.$request("get", "/rada");
          this.tsRada = response.data;
        }
      } catch (e) {
        this.portariaLC = [];
        this.portaria = [];
        this.portariaRada = [];
        this.tabelasSelecao = [];
        this.tsRada = [];
        console.log("Erro ao carregar a informação inicial: " + e);
      }
    },
  },
};
</script>

<style>
.info-label {
  color: #1a237e; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.expansion-panel-heading {
  background-color: #1a237e !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}
</style>
