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
          v-bind:classesCompletas="classesCompletas"
        />

        <!-- Zonas de Controlo -->
        <v-expansion-panels class="my-2">
          <v-expansion-panel
            v-if="this.auto.zonaControlo.length > 0"
            popout
            focusable
          >
            <v-expansion-panel-header class="expansion-panel-heading">
              <div>Classes</div>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <ListaZonasControlo
                v-bind:auto="auto"
                v-bind:classes="classes"
                v-bind:entidades="entidades"
                v-bind:classesCompletas="classesCompletas"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <div class="mx-2">
      <v-btn
        rounded
        color="warning"
        @click="guardarTrabalho"
        :disabled="
          !auto.legislacao || !auto.fundo || auto.zonaControlo.length == 0
        "
        class="elevation-2 ma-2"
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
        class="elevation-2 ma-2"
      >
        Criar Auto de Eliminação
      </v-btn>
    </div>
    <v-dialog v-model="successDialog" width="950" persistent>
      <v-card outlined>
        <v-card-title class="teal darken-4 title white--text" dark>
          Pedido de criação de auto de eliminação criado com sucesso: {{ codigoPedido }}
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
  props: ["entidades", "portarias", "classes", "classesCompletas"],
  components: {
    AdicionarZonaControlo,
    ListaZonasControlo
  },
  data: () => ({
    auto: {
      legislacao: null,
      fundo: [],
      zonaControlo: []
    },
    erro: null,
    erroDialog: false,
    success: null,
    successDialog: false,
    codigoPedido: null,
    pendenteGuardado: false,
    pendenteGuardadoInfo: null
  }),
  methods: {
    submit: async function() {
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
      }
      
      const codigoPedido = await this.$request(
              "post",
              "/pedidos",
              pedidoParams
            );

      this.codigoPedido = codigoPedido.data;

      this.successDialog = true;
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
