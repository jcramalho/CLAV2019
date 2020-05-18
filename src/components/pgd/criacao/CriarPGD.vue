<template>
  <v-card class="ma-2">
    <v-app-bar color="indigo darken-4" dark>
      <v-toolbar-title class="card-heading"
        >Nova Portaria de Gestão de Documentos</v-toolbar-title
      >
    </v-app-bar>
    <v-card-text class="panel-body">
      <v-stepper v-model="steps" vertical>
        <v-stepper-step :complete="steps > 1" step="1">
          Entidades abrangidas e Data de Criação
          <span v-if="steps > 1">
            <v-chip
              v-for="(e,i) in entSel" :key="i"
              class="ma-2"
              color="indigo darken-4"
              text-color="white"
              label
            >
              <v-icon left>account_balance</v-icon>
              {{ e }}
            </v-chip>
          </span>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-row>
            <v-col cols="7">
            <div  v-if="entidades.length>0">
            <v-autocomplete
              class="mt-1"
              v-model="entSel"
              :items="entidades"
              item-text="label"
              placeholder="Selecione as entidades abrangidas pela TS"
              multiple
              chips
              filled
              deletable-chips
              return-object
            />
            </div>
            <div v-else>
              <v-alert dense type="info">
                Ainda não foi possível carregar as entidades...
              </v-alert>
            </div>
          </v-col>
          <v-col class="ma-1">
            <SelecionarData
                :d="dataCriacao"
                :label="'Data de Criação'"
                @dataSelecionada="dataCriacao = $event"
              />
            </v-col>
          </v-row>
          <hr style="border-top: 0px" />
          <v-btn
            color="primary"
            :disabled="entSel.length==0 || !dataCriacao"
            @click="steps = 2;"
            >Continuar</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="steps > 2" step="2">
          Designação da Portaria de Gestão de Documentos
          <span v-if="steps > 2">
            <v-chip
              class="ma-2"
              color="indigo darken-4"
              text-color="white"
              label
            >
              {{ designacao }}
            </v-chip>
          </span>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-col xs12 sm6 md10>
            <v-text-field
              placeholder="Designação da Nova Portaria de Gestão de Documentos"
              v-model="designacao"
            ></v-text-field>
          </v-col>
          <v-btn color="primary" @click="steps = 3;" :disabled="!designacao"
            >Continuar</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="steps > 3" step="3">
          Criação de Classes / Séries
        </v-stepper-step>
        <v-stepper-content step="3">
          <CriarClassesPGD
            class="mb-4"
            :classes="classes"
          />

          <v-data-table
            v-if="classes.length>0"
            :headers="headers"
            :items="classes"
            class="elevation-1 mt-2"
          />

        </v-stepper-content>
        <hr style="border-top: 0px" />

              <v-row align="center" justify="space-around">
              
                <v-btn v-if="steps>2" color="primary" @click=" steps = 2;">Voltar</v-btn>
                <v-btn color="primary" v-if="steps>2" @click="guardarTrabalho">Guardar trabalho</v-btn>
                <!--<v-btn
                  v-if="steps>2"
                  color="primary"
                  @click="guardarTrabalho()"
                  >Guardar trabalho
                  <DialogPendenteGuardado 
                    v-if="pendenteGuardado" 
                    :pendente="pendente"
                    @continuar="pendenteGuardado = false"/>
                </v-btn>-->

                <v-btn color="primary" v-if="steps>2 && classes.length>0" @click="submeter">Submeter</v-btn>
                <!--<v-btn v-if="stepNo>2" color="primary" @click="submeterTS">Submeter</v-btn>-->

                <v-btn dark color="red darken-4">Sair / Cancelar</v-btn> 
                <!--<v-btn
                  dark
                  color="red darken-4"
                  @click="eliminarTabela = true"
                  >Sair / Cancelar
                  <DialogCancelar 
                    v-if="eliminarTabela" 
                    @continuar="eliminarTabela=false"
                    @sair="abortar"/>
                </v-btn>-->
              </v-row>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>
<script>
import SelecionarData from "@/components/generic/SelecionarData";
import CriarClassesPGD from "@/components/pgd/criacao/CriarClasses.vue"

export default {
  props: ["entidades"],
  components: {
    CriarClassesPGD,
    SelecionarData
  },
  data: () => ({
    steps: 1,
    entSel: [],
    designacao: "",
    classes: [],
    dataCriacao: "",
    menu1: false,
    basicRule: [v => !!v || "Campo de preenchimento obrigatório!"],
    headers: [
      { text: "Código", value: "codigo", class: "subtitle-1" },
      { text: "Referência", value: "referencia", class: "subtitle-1" },
      { text: "Séries Documentais", value: "seriesDocumentais", class: "subtitle-1" },
      { text: "PCA", value: "pca", class: "subtitle-1" },
      { text: "Destino Final", value: "df", class: "subtitle-1" }
    ]
  }),

  created: async function () {
    try {
      var user = await this.$verifyTokenUser();

      let user_entidade = await this.$request(
        "get",
        "/entidades/" + user.entidade
      );

      this.entSel.push(
        user_entidade.data.sigla + " - " + user_entidade.data.designacao
      );
    }
    catch (e) {
      this.entSel = [];
    }
  },
  methods: {
    submeter: async function() {
      var user = this.$verifyTokenUser();
      var obj = {
        entidades: this.entSel,
        dataCriacao: this.dataCriacao,
        designacao: this.designacao,
        classes: this.classes
      }

      var pedidoParams = {
        tipoPedido: "Criação",
        tipoObjeto: "PGD",
        novoObjeto: obj,
        user: { email: user.email },
        entidade: user.entidade,
        token: this.$store.state.token
      };

      await this.$request(
        "post",
        "/pedidos",
        pedidoParams
      );

      this.$router.push('/pedidos/submissao')

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
            tipo: "Portaria de Gestão de Documentos",
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
  }
}
</script>