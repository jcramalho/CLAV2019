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
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="portarias"
                  v-model="auto.legislacao"
                  solo
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col :md="2">
                <div class="info-label">Fundo</div>
              </v-col>
              <v-col>
                <v-autocomplete
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
            />

            <!-- Zonas de Controlo -->
            <ListaZonasControlo
              v-bind:auto="auto"
              v-bind:classes="classes"
              v-bind:entidades="entidades"
              v-bind:classesCompletas="classesCompletas"
              v-bind:donos="donos"
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
                @click="submit"
                :disabled="
                  !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
                "
                class="ma-2"
              >Criar Auto de Eliminação</v-btn>
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
        >Pedido de criação de auto de eliminação criado com sucesso: {{ codigoPedido }}</v-card-title>

        <v-card-text>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Código do pedido</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ codigoPedido }}</div>
            </v-col>
          </v-row>

          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fonte de Legitimação</div>
            </v-col>

            <v-col class="info-content">
              <div>{{ auto.legislacao }}</div>
            </v-col>
          </v-row>
          <v-row class="my-2">
            <v-col cols="2">
              <div class="info-label">Fundo</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="(f,i) in auto.fundo" :key="i">{{ f }}</div>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="2">
              <div class="info-label">Classes e Agregações</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="c in auto.zonaControlo" :key="c.codigo">
                <strong>{{ c.codigo +" - "+c.titulo }}</strong>
                Agregações: 
                <li
                  class="ml-4"
                  v-for="a in c.agregacoes"
                  :key="a.codigo"
                >{{a.codigo + " - " + a.titulo}}</li>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="$router.push('/')">Fechar</v-btn>
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
  props: ["obj"],
  components: {
    AdicionarZonaControlo,
    ListaZonasControlo
  },
  data: () => ({
    entidades: [],
    portarias: [],
    classes: [],
    classesCompletas: [],
    auto: {
      legislacao: null,
      fundo: [],
      zonaControlo: []
    },
    apagarAE: false,
    steps: 1,
    erro: null,
    erroDialog: false,
    success: null,
    successDialog: false,
    pendenteGuardado: false,
    pendenteGuardadoInfo: null
  }),
  created: async function() {
    try {
      var response2 = await this.$request("get", "/legislacao?fonte=PGD/LC");
      this.portarias = await this.prepararLeg(response2.data);

      var response = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response.data);

      var response3 = await this.$request(
        "get",
        "/classes?nivel=3&info=completa"
      );
      var response4 = await this.$request(
        "get",
        "/classes?nivel=4&info=completa"
      );
      this.classesCompletas = await this.prepararClassesCompletas(
        response3.data,
        response4.data
      );
      this.classes = await this.prepararClasses(this.classesCompletas);

      this.auto = this.obj.objeto;
      this.pendenteID = this.obj._id;
    } catch (e) {
      this.entidades = [];
      this.portarias = [];
      this.classes = [];

      this.auto = this.obj.objeto;
      this.pendenteID = this.obj._id;
    }
  },
  methods: {
    prepararEntidade: async function(ent) {
      try {
        var myEntidades = [];
        for (var e of ent) {
            myEntidades.push(e.sigla + " - " + e.designacao);
        }
        return myEntidades;
      } catch (error) {
        return [];
      }
    },
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push("Portaria " + l.numero + " \n " + l.sumario);
        }
        return myPortarias;
      } catch (error) {
        return [];
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
          if (c.df.valor !== "NE") myClasses.push(c);
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
    eliminarAE: async function() {
      this.apagarAE = false;
      this.$request("delete", "/pendentes/" + this.obj._id);
      this.$router.push("/");
    },
    submit: async function() {
      this.erro = ""
      for(var zc of this.auto.zonaControlo) {
        if(zc.dono.length === 0) {
          this.erroDialog = true;
          this.erro = "Dono do PN não preenchido em " + zc.codigo +" - "+zc.titulo+".\n"
        }
        if(zc.agregacoes.length === 0) {
          this.erroDialog = true;
          this.erro = "Não existem agregações em " + zc.codigo +" - "+zc.titulo+".\n"
        }
      }
      if(this.erro==="") {

        this.auto.legislacao = "Portaria " + this.auto.legislacao.split(" ")[1];

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

        this.codigoPedido = codigoPedido.data;

      this.$request("delete", "/pendentes/" + this.obj._id);
      this.successDialog = true;
      }
    },
    guardarTrabalho: async function() {
      try {
        this.obj.numInterv++;
        var cDate = Date.now();

        var pendenteParams = {
          _id: this.obj._id,
          dataAtualizacao: cDate,
          numInterv: this.obj.numInterv,
          acao: this.obj.acao,
          tipo: this.obj.tipo,
          objeto: this.auto,
          criadoPor: this.obj.criadoPor,
          user: {
            token: this.$store.state.token
          }
        };

        var response = await this.$request("put", "/pendentes", pendenteParams);
        this.pendenteGuardado = true;
        this.pendenteGuardadoInfo = JSON.stringify(response.data);
      } catch (error) {
        return error;
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
</style>