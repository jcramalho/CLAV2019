<template>
  <div>
    <v-card class="ma-4">
      <v-app-bar color="expansion-panel-heading" dark>
        <v-toolbar-title class="card-heading">Novo Auto de Eliminação</v-toolbar-title>
      </v-app-bar>

      <v-card-text>
        <v-stepper v-model="steps" vertical>
          <v-stepper-step :complete="steps > 1" step="1">Seleção de Fonte e Fundo</v-stepper-step>

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
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="PGD_LC">
                    <template v-slot:label>
                      <div class="mt-2">
                        PGD/LC
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="PGD">
                    <template v-slot:label>
                      <div class="mt-2">
                        PGD
                      </div>
                    </template>
                  </v-radio>
                  <v-radio disabled value="RADA">
                    <template v-slot:label>
                      <div class="mt-2">
                        RADA
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
                <div v-if="tipo=='PGD_LC'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portariaLC"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
                <div v-else-if="tipo=='TS_LC'">
                  <v-autocomplete
                    label="Selecione a Tabela de Seleção"
                    :items="tabelasSelecao"
                    v-model="auto.legislacao"
                    solo 
                    dense
                  />
                </div>
                <div v-else-if="tipo=='PGD'">
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portaria"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
                <div v-else>
                  <v-autocomplete
                    label="Selecione a fonte de legitimação"
                    :items="portariaRada"
                    v-model="auto.legislacao"
                    solo
                    dense
                  ></v-autocomplete>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="2">
                <div class="info-label">Fundo</div>
              </v-col>
              <v-col>
                <v-autocomplete
                  deletable-chips
                  label="Selecione a entidade responsável pelo fundo"
                  :items="entidades"
                  v-model="auto.fundo"
                  solo
                  dense
                  chips
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-btn class="ma-2" color="primary darken-4" @click="filtrarDonos(); steps = 2" :disabled="!auto.legislacao || auto.fundo.length==0">Avançar</v-btn>
          </v-stepper-content>

          <v-stepper-step step="2">Tratamento das classes de controlo</v-stepper-step>

          <v-stepper-content step="2">
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

            <div class="mx-2">
              <v-btn @click="steps = 1" class="ma-2">Voltar</v-btn>
              <v-btn
                medium
                color="warning darken-2"
                @click="guardarTrabalho"
                :disabled="
                  !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
                "
                class="ma-2"
              >Guardar Auto de Eliminação</v-btn>
              <v-btn
                medium
                color="primary darken-4"
                @click="successDialog=true"
                :disabled="
                  !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
                "
                class="ma-2"
              >Submeter Auto de Eliminação</v-btn>
            </div>
            
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title
          class="teal darken-4 title white--text"
          dark
        >Validação de auto de eliminação executada com sucesso</v-card-title>

        <v-card-text>
          Caso pretenda finalizar o mesmo e submeter o Auto de Eliminação, selecione "Confirmar". Caso ainda pretenda realizar alguma alteração ao AE, clique em "Voltar".
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-4" text @click="successDialog=false">Voltar</v-btn>
          <v-btn color="green darken-4" text @click="successDialog=false; submit()">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Não foi possível criar o pedido de criação de auto de eliminação</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Trabalho pendente guardado com sucesso -->
    <v-dialog v-model="pendenteGuardado" width="60%">
      <v-card>
        <v-card-title>Trabalho pendente guardado</v-card-title>
        <v-card-text>
          <div>
            <strong>
              Os seus dados foram guardados para que possa retomar o trabalho mais
              tarde.
            </strong>
          </div>

          <v-row v-if="auto.legislacao" class="my-2">
            <v-col cols="2">
              <div class="info-label">Fonte de Legitimação:</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ auto.legislacao }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fundo:</div>
            </v-col>

            <v-col v-if="auto.fundo" class="info-content">
              <div v-for="(f,i) in auto.fundo" :key="i">{{ f }}</div>
            </v-col>
          </v-row>
          <v-row v-if="auto.zonaControlo" class="mt-2">
            <v-col cols="2">
              <div class="info-label">Classes e Agregações:</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="c in auto.zonaControlo" :key="c.codigo">
                {{ c.codigo +" - "+c.titulo }}
                <li
                  class="ml-4"
                  v-for="a in c.agregacoes"
                  :key="a.codigo"
                >{{+a.codigo + " - " + a.titulo}}</li>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" dark @click="$router.push('/')">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AdicionarZonaControlo from "@/components/autosEliminacao/criacao/AdicionarZonaControlo.vue";
import ListaZonasControlo from "@/components/autosEliminacao/criacao/ListaZonasControlo.vue";
const help = require("@/config/help").help;

export default {
  props: ["entidades"],
  components: {
    AdicionarZonaControlo,
    ListaZonasControlo
  },
  data: () => ({
    classes: [],
    classesCompletas: [],
    auto: {
      legislacao: null,
      fundo: [],
      zonaControlo: []
    },
    portariaLC: [],
    portaria: [],
    portariaRada: [],
    tabelasSelecao: [],
    tipo: "TS_LC",
    donos: [],
    steps: 1,
    erro: null,
    erroDialog: false,
    success: null,
    successDialog: false,
    codigoPedido: "",
    pendenteGuardado: false,
    pendenteGuardadoInfo: null
  }),
  created: async function() {
    try {
      var user = this.$verifyTokenUser();
      let user_entidade = await this.$request(
        "get",
        "/entidades/" + user.entidade
      );

      this.auto.fundo.push(
        user_entidade.data.sigla + " - " + user_entidade.data.designacao
      );

      var response = await this.$request("get", "/legislacao?fonte=PGD/LC");
      this.portariaLC = await this.prepararLeg(response.data);
      var response2 = await this.$request("get", "/pgd");
      this.portaria = await this.prepararLeg(response2.data);
      var response3 = await this.$request("get", "/legislacao?fonte=RADA");
      this.portariaRada = await this.prepararLeg(response3.data);
      this.tabelasSelecao.push("Lista Consolidada")

    } catch (e) {
      this.auto.fundo = [];
      this.portariaLC = [];
      this.portaria = [];
      this.portariaRada = [];
      this.tabelasSelecao = [];
    }
  },
  methods: {
    submit: async function() {
      this.erro = ""
      for(var zc of this.auto.zonaControlo) {
        if(zc.destino=="C" && zc.dono.length === 0 && this.tipo!='RADA' && this.tipo!='PGD') {
          this.erroDialog = true;
          this.erro = "Dono do PN não preenchido em " + zc.codigo +" - "+zc.titulo+".\n"
        }
      }
      if(this.erro==="") {
        if(this.tipo=="TS_LC") {
          delete this.auto["legislacao"]
          //Para já apenas LC
          this.auto.referencial = "lc1"
        }
        var user = this.$verifyTokenUser();

        this.auto.responsavel = user.email;
        this.auto.entidade = user.entidade;

        var pedidoParams = {
          tipoPedido: "Criação",
          tipoObjeto: "Auto de Eliminação",
          novoObjeto: {
            ae: this.auto
          },
          user: { email: user.email },
          entidade: user.entidade,
          token: this.$store.state.token
        };

        const codigoPedido = await this.$request(
          "post",
          "/pedidos",
          pedidoParams
        );

        this.$router.push('/pedidos/submissao')
      }
    },
    guardarTrabalho: async function() {
      try {
        if (this.$store.state.name === "") {
          this.loginErrorSnackbar = true;
        } else {
          var userBD = this.$verifyTokenUser();
          var pendenteParams = {
            numInterv: 1,
            acao: "Criação",
            tipo: "Auto de Eliminação",
            objeto: this.auto,
            criadoPor: userBD.email,
            user: { email: userBD.email },
            token: this.$store.state.token
          };
          var response = await this.$request(
            "post",
            "/pendentes",
            pendenteParams
          );
          this.pendenteGuardado = true;
          this.pendenteGuardadoInfo = JSON.stringify(response.data);
        }
      } catch (error) {
        return error;
      }
    },
    prepararClasses: async function(classes) {
      try {
        var myClasses = [];
        for (var c of classes)
          myClasses.push(c.codigo + " - " + c.titulo);
        return myClasses;
      } catch (error) {
        return [];
      }
    },
    prepararClassesCompletas: async function(classes, nivel4) {
      try {
        var myClasses = [];
        for (var c of classes) {
          if (c.df.valor && c.df.valor !== "NE") myClasses.push(c);
          else {
            var indexs = 0;
            for (var n of nivel4) {
              if (n.codigo.includes(c.codigo)) {
                myClasses.push(n);
                indexs++;
              } else break;
            }
            nivel4.splice(0, indexs);
          }
        }
        return myClasses;
      } catch (error) {
        return [];
      }
    },
    
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push("Portaria " + l.numero + " - " + l.sumario);
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },
    filtrarDonos: async function() {
      this.donos = this.entidades

      for(var f of this.auto.fundo) {
        this.donos = this.donos.filter(e => !e.includes(f))

        for(var zc of this.auto.zonaControlo) {
          zc.dono = zc.dono.filter(e => !e.includes(f))
        }
      }

      if(this.tipo == "TS_LC") {
        var response = await this.$request(
          "get",
          "/classes?nivel=3&info=completa"
        );
        var response2 = await this.$request(
          "get",
          "/classes?nivel=4&info=completa"
        );
        this.classesCompletas = await this.prepararClassesCompletas(
          response.data,
          response2.data
        );
        this.classes = await this.prepararClasses(this.classesCompletas);
      }
      else if(this.tipo == "PGD" || this.tipo == "PGD_LC") {
        var response = await this.$request(
          "get",
          "/legislacao"
        )

        var leg = response.data.filter(l => l.numero == this.auto.legislacao.split(" ")[1])

        if(this.tipo=="PGD") 
          var response2 = await this.$request(
            "get",
            "/pgd/pgd_"+leg[0].id
          )
        else 
          var response2 = await this.$request(
            "get",
            "/pgd/pgd_lc_"+leg[0].id
          )
        this.classes = response2.data.filter(c => c.nivel>2).map(c => {
            if(c.codigo && c.referencia) return ""+c.codigo+" "+c.referencia+" - "+c.titulo
            else if(c.codigo) return ""+c.codigo+" - "+c.titulo
            else if(c.referencia) return ""+c.referencia+" - "+c.titulo
        })
        this.classesCompletas = response2.data.filter(c=> c.nivel>2).map(c => {
            return {
              idClasse: c.classe,
              codigo: c.codigo,
              referencia: c.referencia,
              titulo: c.titulo,
              df: {valor: c.df},
              pca: {valores: c.pca},
            }
          })
      }
      else {
        this.classes = [];
        this.classesCompletas = [];
      }
    }
  },
  watch: {
    tipo: function() {
      this.auto.legislacao = null;
    } 
  }
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
