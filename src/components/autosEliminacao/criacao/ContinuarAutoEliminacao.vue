<template>
  <div>
    <v-card class="ma-4">
      <v-app-bar color="expansion-panel-heading" dark>
        <v-toolbar-title class="card-heading">
          Novo Auto de Eliminação
        </v-toolbar-title>
      </v-app-bar>

      <v-card-text>
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
        <!-- Adicionar Zona Controlo -->
        <AdicionarZonaControlo
          v-bind:classes="classes"
          v-bind:entidades="entidades"
          v-bind:auto="auto"
        />

        <!-- Zonas de Controlo -->
        <v-expansion-panels class="my-2">
          <v-expansion-panel
            v-if="this.auto.zonaControlo.length > 0"
            popout
            focusable
          >
            <v-expansion-panel-header class="expansion-panel-heading">
              <div>Zonas de Controlo</div>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <ListaZonasControlo
                v-bind:auto="auto"
                v-bind:classes="classes"
                v-bind:entidades="entidades"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <div>
      <v-btn
        rounded
        color="warning"
        @click="guardarTrabalho"
        :disabled="
          !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
        "
        class="elevation-2 mx-4 ma-1"
      >
        Guardar Auto de Eliminação
      </v-btn>
      <v-btn
        rounded
        color="primary"
        @click="submit"
        :disabled="
          !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
        "
        class="elevation-2 mx-4"
      >
        Criar Auto de Eliminação
      </v-btn>
      <v-btn
        rounded
        color="error"
        @click="apagarAE = true"
        class="elevation-2 mx-4 ma-1"
      >
        Eliminar Auto de Eliminação
      </v-btn>
    </div>
    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark>
          Pedido de criação de auto de eliminação criado com sucesso
        </v-card-title>

        <v-card-text>
          <v-row class="my-2">
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

            <v-col class="info-content">
              <div v-for="(f,i) in auto.fundo" :key="i">{{ f }}</div>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="2">
              <div class="info-label">Classes e Agregações:</div>
            </v-col>

            <v-col class="info-content">
              <div v-for="c in auto.zonaControlo" :key="c.codigo">
                {{ c.codigo +" - "+c.titulo }}
                <li class="ml-4" v-for="a in c.agregacoes" :key="a.codigo">{{+a.codigo + " - " + a.titulo}}</li>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="$router.push('/')">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Não foi possível criar o pedido de criação de auto de eliminação
        </v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro">
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="apagarAE" width="700" persistent>
      <v-card outlined>
        <v-card-title class="red darken-4 title white--text" dark>
          Eliminar Auto de Eliminação
        </v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap">
            Este método remove <strong>permanentemente</strong> o Auto de
            Eliminação, assim como as suas Zonas de Controlo e Agregações.
          </span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="green darken-4" text @click="apagarAE = false">
            Fechar
          </v-btn>
          <v-btn color="red darken-4" text @click="eliminarAE">
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Trabalho pendente guardado com sucesso -->
    <v-dialog v-model="pendenteGuardado" width="60%">
      <v-card>
        <v-card-title>Trabalho pendente guardado</v-card-title>
        <v-card-text>
          <div><strong>
            Os seus dados foram guardados para que possa retomar o trabalho mais
            tarde.
          </strong></div>
          
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
                <li class="ml-4" v-for="a in c.agregacoes" :key="a.codigo">{{+a.codigo + " - " + a.titulo}}</li>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" dark @click="$router.push('/')">
            Fechar
          </v-btn>
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
    auto: {
      legislacao: null,
      fundo: [],
      zonaControlo: []
    },
    apagarAE: false,
    erro: null,
    erroDialog: false,
    success: null,
    successDialog: false,
    pendenteGuardado: false,
    pendenteGuardadoInfo: null
  }),
  created: async function() {
    try {
      var response = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response.data);

      var response2 = await this.$request("get", "/legislacao/portarias");
      this.portarias = await this.prepararLeg(response2.data);

      var response3 = await this.$request("get", "/classes?nivel=3");
      this.classes = await this.prepararClasses(response3.data);

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
        for (var c of classes) {
          myClasses.push(c.codigo + " - " + c.titulo);
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
      this.auto.legislacao = "Portaria " + this.auto.legislacao.split(" ")[1];
      var fundo = [];
      this.auto.fundo.forEach(f => {
        fundo.push(f.split(" - ")[1]);
      })
      this.auto.fundo = fundo;
      this.$request("post", "/autosEliminacao/", { auto: this.auto })
        .then(r => {
          this.$request("delete", "/pendentes/" + this.obj._id);
          this.successDialog = true;
        })
        .catch(e => {
          this.erro = e.response.data;
          this.erroDialog = true;
        });
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
    }
  }
};
</script>


<style>
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

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #696969;
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

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
