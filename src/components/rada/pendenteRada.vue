<template>
  <v-card flat class="ma-4">
    <v-card-title class="indigo darken-4 white--text">
      Criar Relatório de Avaliação de Documentação Acumulada
      <v-spacer />
      <v-btn style="background-color: #1a237e;" dark @click="guardarTrabalho">
        Guardar Trabalho
        <v-icon right>save</v-icon>
      </v-btn>

      <v-icon dark color="red" @click="toDelete = true" right>delete_sweep</v-icon>
    </v-card-title>
    <v-card-text>
      <!-- {{ obj.objeto.entidades}}
      {{ obj.objeto.legislacao}} -->
      <!-- {{ obj }} -->
      <v-dialog v-model="toDelete" width="500">
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >Pretende mesmo eliminar o trabalho?</v-card-title>

          <v-card-text align="center">
            <br />
            <v-btn class="ma-3 pa-3" color="indigo lighten-3" @click="toDelete = false">Voltar</v-btn>
            <v-btn class="ma-3 pa-5" color="red lighten-1" @click="eliminarTrabalho">Sim</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      <br />
      <v-stepper v-model="e1" vertical class="elevation-0">
        <!-- Informação Geral -->
        <v-stepper-step color="amber accent-3" :key="1" :complete="e1 > 1" :step="1" editable>
          <font size="4">
            <b>Informação Geral</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="1">
          <InformacaoGeral @seguinte="changeE1" :RADA="RADA" :entidades="entidades" />
        </v-stepper-content>

        <!-- Relatório Expositivo -->
        <v-stepper-step color="amber accent-3" :key="2" :complete="e1 > 2" :step="2" editable>
          <font size="4">
            <b>Relatório Expositivo</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="2">
          <RelatorioExpositivo
            @seguinte="changeE1"
            :RE="RADA.RE"
            :classes="RADA.tsRada.classes"
            :entidades="entidades"
            :tipologias="tipologias"
          />
        </v-stepper-content>

        <!-- Tabela de Seleção -->
        <v-stepper-step color="amber accent-3" :key="3" :complete="e1 > 3" :step="3" editable>
          <font size="4">
            <b>Tabela de Seleção</b>
          </font>
        </v-stepper-step>
        <v-stepper-content step="3">
          <TSRada
            @done="done"
            @voltar="changeE1"
            :legislacao="legislacao"
            :RE="RADA.RE"
            :TS="RADA.tsRada"
            :entidades="entidades"
          />
        </v-stepper-content>
      </v-stepper>
      <v-row justify-center>
        <v-dialog v-model="dialogRADAPendente" persistent max-width="60%">
          <v-card>
            <v-card-title class="headline">Trabalho pendente guardado</v-card-title>
            <v-card-text>
              <p>
                Os seus dados foram guardados para que possa retomar o trabalho
                mais tarde.
              </p>
              <!-- <p>{{ mensagemPendenteCriadoOK }}</p> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/pendentes')">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify-center>
        <v-dialog v-model="dialogRADACriado" persistent max-width="60%">
          <v-card>
            <v-card-title class="headline">Pedido de Criação do RADA Submetido</v-card-title>
            <v-card-text>{{ mensagemPedidoCriadoOK }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$router.push('/')">Fechar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import RelatorioExpositivo from "@/components/rada/criacao/RelatorioExpositivo.vue";
import TSRada from "@/components/rada/criacao/TSRadaManual.vue";
import InformacaoGeral from "@/components/rada/criacao/InformacaoGeral";

export default {
  props: ["obj"],
  components: {
    RelatorioExpositivo,
    TSRada,
    InformacaoGeral
  },
  data() {
    return {
      toDelete: false,
      mensagemPendenteCriadoOK: "",
      dialogRADAPendente: false,
      mensagemPedidoCriadoOK: "",
      dialogRADACriado: false,
      entidades: [],
      tipologias: [],
      legislacao: [],
      e1: 1,
      titulo: "",
      guardar: false,
      userEmail: "",
      RADA: this.obj.objeto.rada
    };
  },
  methods: {
    guardarTrabalho: function() {
      let updatePendente = {
        _id: this.obj._id,
        objeto: {
          rada: this.RADA,
          entidades: this.entidades.filter(e => e.estado == "Nova"),
          legislacao: this.legislacao.filter(e => e.estado == "Nova")
        }
      };

      let response = this.$request("put", "/pendentes", updatePendente);

      response.then(resp => {
        this.dialogRADAPendente = true;
      });
    },
    changeE1: function(e) {
      this.e1 = e;
    },
    eliminarTrabalho: function() {
      this.$request("delete", "/pendentes/" + this.obj._id).then(response => {
        this.$router.push("/pendentes");
      });
    },
    done: async function() {
      let pedidoParams = {
        tipoPedido: "Criação",
        tipoObjeto: "RADA",
        novoObjeto: this.RADA,
        user: {
          email: this.userEmail
        },
        token: this.$store.state.token,
        criadoPor: this.userEmail
      };

      let response = await this.$request("post", "/pedidos", pedidoParams);

      await this.$request("delete", "/pendentes/" + this.obj._id);

      this.mensagemPedidoCriadoOK += JSON.stringify(response.data);
      this.dialogRADACriado = true;
    }
  },
  created: async function() {
    let l = await this.$request("get", "/legislacao");
    this.legislacao = l.data;

    // Inserir as legislações que foram criadas na sessão antiga
    for (let i = 0; i < this.obj.objeto.legislacao.length; i++) {
      if (
        !this.legislacao.some(
          e =>
            e.tipo == this.obj.objeto.legislacao[i].tipo &&
            e.numero == this.obj.objeto.legislacao[i].numero
        )
      ) {
        this.legislacao.push(this.obj.objeto.legislacao[i]);
      }
    }

    let response = await this.$request("get", "/entidades");
    this.entidades = response.data;

    // Inserir as entidades que foram criadas na sessão antiga
    for (let j = 0; j < this.obj.objeto.entidades.length; j++) {
      if (
        !this.entidades.some(
          e =>
            e.sigla == this.obj.objeto.entidades[j].sigla &&
            e.designacao == this.obj.objeto.entidades[j].designacao
        )
      ) {
        this.entidades.push(this.obj.objeto.entidades[j]);
      }
    }

    response = await this.$request("get", "/tipologias");
    this.tipologias = response.data;

    let userBD = await this.$request(
      "get",
      "/users/" + this.$store.state.token + "/token"
    );
    this.userEmail = userBD.data.email;

    // let userEntidade = await this.$request(
    //   "get",
    //   "/entidades/" + userBD.data.entidade
    // );

    // if (
    //   this.RADA.entRes.indexOf(
    //     userEntidade.data.sigla + " - " + userEntidade.data.designacao
    //   ) == -1
    // ) {
    //   this.RADA.entRes.push(
    //     userEntidade.data.sigla + " - " + userEntidade.data.designacao
    //   );
    // }
  }
};
</script>

<style>
.expansion-panel-heading {
  color: #1a237e !important;
  background-image: linear-gradient(to bottom, #e8eaf6 0, #8c9eff 100%);
}

.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #8c9eff;
}

.info-label {
  color: #1a237e;
  padding: 6px;
  font-weight: 400;
  height: 35px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  margin: 5px;
}
</style>
