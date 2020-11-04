<template>
  <div>
    <v-row class="align-center pa-3" style="text-align:center;">
      <ValidarLegislacaoInfoBox :l="l" :original="original" :acao="acao" />

      <v-col>
        <v-btn
          v-if="this.acao == 'Criação'"
          @click="criarAlterarLegislacao"
          color="success darken-1"
          rounded
          class="white--text"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
          id="botao-shadow"
        >
          <unicon
            name="adicionar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.71"
            fill="#ffffff"
          />
          <p class="ml-2">Criar</p>
        </v-btn>
        <v-btn
          v-else-if="this.acao == 'Alteração'"
          @click="criarAlterarLegislacao"
          color="success darken-1"
          rounded
          class="white--text"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
          id="botao-shadow"
        >
          <unicon
            name="alterar-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.727"
            fill="#ffffff"
          />
          <p class="ml-2">Alterar</p>
        </v-btn>
      </v-col>

      <v-col>
        <v-btn
          @click="eliminarLegislacao"
          color="red darken-4"
          rounded
          class="white--text"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
          id="botao-shadow"
        >
          <unicon
            name="remove-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
          <p class="ml-2">
            Cancelar
          </p>
        </v-btn>
      </v-col>
    </v-row>
    <!-- Erros de Validação -->
    <v-row justify-center>
      <v-dialog v-model="errosValidacao" width="60%">
        <v-card dark class="info-card">
          <v-card-title class="headline mb-2"
            >Erros detetados na validação</v-card-title
          >
          <div class="info-content px-3 mx-6 mb-2">
            <v-card-text class="pa-2 px-4 font-weight-medium">
              <p>
                Há erros de validação. Selecione "Validar" para ver exatamente
                quais e proceder à sua correção.
              </p>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-4"
              rounded
              dark
              elevation="0"
              class="px-4"
              @click="errosValidacao = false"
            >
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <!-- Cancelamento da criação de uma legislacao: confirmação -->
    <v-dialog v-model="pedidoEliminado" width="50%">
      <v-card>
        <v-card-title>Cancelamento do pedido.</v-card-title>
        <v-card-text>
          <p>Selecionou o cancelamento do pedido.</p>
          <p>Toda a informação introduzida será eliminada.</p>
          <p>
            Confirme a decisão para ser reencaminhado para a página principal.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success darken-1"
            rounded
            dark
            elevation="0"
            class="px-4"
            @click="cancelarCriacaoLegislacao"
          >
            Confirmo
          </v-btn>
          <v-btn
            color="red darken-4"
            rounded
            dark
            elevation="0"
            class="px-4"
            @click="pedidoEliminado = false"
          >
            Enganei-me, desejo continuar o trabalho
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-snackbar
        v-model="loginErrorSnackbar"
        :timeout="8000"
        color="error"
        :top="true"
      >
        {{ loginErrorMessage }}
        <v-btn icon color="white" @click="loginErrorSnackbar = false">
          <unicon
            name="remove-icon"
            width="15"
            height="15"
            viewBox="0 0 20.71 20.697"
            fill="#ffffff"
          />
        </v-btn>
      </v-snackbar>
    </v-row>

    <!-- Dialog de erro no caso de algum erro ocorrer -->
    <v-dialog v-model="erroDialog" width="50%" persistent>
      <ErroDialog :erros="erros" @fecharErro="fecharErro()" />
    </v-dialog>
  </div>
</template>

<script>
import ValidarLegislacaoInfoBox from '@/components/legislacao/ValidarLegislacaoInfoBox';
import ErroDialog from '@/components/generic/ErroDialog';

import { criarHistorico, extrairAlteracoes } from '@/utils/utils';
import { eNUV, eDataFormatoErrado, eNV } from '@/utils/validadores';

export default {
  props: ['l', 'acao', 'original'],

  components: {
    ValidarLegislacaoInfoBox,
    ErroDialog,
  },

  data() {
    return {
      erroDialog: false,
      erros: [],
      loginErrorSnackbar: false,
      loginErrorMessage: 'Precisa de fazer login para criar o Diploma!',
      errosValidacao: false,
      pedidoEliminado: false,
    };
  },

  methods: {
    fecharErro() {
      this.erroDialog = false;
      this.erros = [];
    },

    async validarLegislacaoCriacao() {
      let numeroErros = 0;

      // Tipo
      if (eNUV(this.l.tipo)) {
        numeroErros++;
      }

      // Número Diploma
      if (eNUV(this.l.numero)) {
        numeroErros++;
      } else {
        try {
          let existeNumero = await this.$request(
            'get',
            '/legislacao/numero?valor=' + encodeURIComponent(this.l.numero)
          );

          if (existeNumero.data) {
            this.numeroErros++;
          }
        } catch (err) {
          numeroErros++;
        }
      }

      // Data
      if (eNUV(this.l.data)) {
        numeroErros++;
      } else if (eDataFormatoErrado(this.l.data)) {
        numeroErros++;
      }

      // Sumário
      if (eNUV(this.l.sumario)) {
        numeroErros++;
      }

      // Data revogação
      if (!eNUV(this.l.data) && !eNUV(this.l.dataRevogacao)) {
        if (eDataFormatoErrado(this.l.dataRevogacao)) {
          numeroErros++;
        } else if (new Date(this.l.data) >= new Date(this.l.dataRevogacao)) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    validarLegislacaoAlteracao(dados) {
      let numeroErros = 0;

      // Sumário
      if (eNV(dados.sumario)) {
        numeroErros++;
      }

      return numeroErros;
    },

    validarLegislacaoRevogacao(dados) {
      let numeroErros = 0;

      // Data Revogação
      if (eNUV(dados.dataRevogacao)) {
        numeroErros++;
      } else if (!eNUV(dados.dataRevogacao)) {
        if (eDataFormatoErrado(dados.dataRevogacao)) {
          numeroErros++;
        } else if (new Date(dados.data) >= new Date(dados.dataRevogacao)) {
          numeroErros++;
        }
      }

      return numeroErros;
    },

    // Lança o pedido de criação da legislacao no worflow
    async criarAlterarLegislacao() {
      try {
        if (this.$store.state.name === '') {
          this.loginErrorSnackbar = true;
        } else {
          let erros = 0;
          let dataObj = JSON.parse(JSON.stringify(this.l));

          const historico = [];

          switch (this.acao) {
            case 'Criação':
              erros = await this.validarLegislacaoCriacao();

              historico.push(criarHistorico(dataObj));

              break;

            case 'Alteração':
              dataObj = extrairAlteracoes(this.l, this.original);

              erros = this.validarLegislacaoAlteracao(dataObj);

              historico.push(criarHistorico(this.l, this.original));

              break;

            case 'Revogação':
              erros = this.validarLegislacaoRevogacao(dataObj);

              for (const key in dataObj) {
                if (key !== 'dataRevogacao') delete dataObj[key];
              }

              historico.push({
                dataRevogacao: {
                  cor: 'amarelo',
                  dados: dataObj.dataRevogacao,
                  nota: null,
                },
              });
              break;

            default:
              break;
          }

          if (erros === 0) {
            const objKeys = Object.keys(dataObj);

            if (objKeys.length === 0)
              throw new Error(
                'Não foram alterados dados. Altere a informação pretendida e volte a submeter o pedido.'
              );

            let userBD = this.$verifyTokenUser();

            let pedidoParams = {
              tipoPedido: this.acao,
              tipoObjeto: 'Legislação',
              novoObjeto: dataObj,
              user: {
                email: userBD.email,
              },
              entidade: userBD.entidade,
              token: this.$store.state.token,
              historico: historico,
            };

            if (this.original !== undefined)
              pedidoParams.objetoOriginal = this.original;
            else pedidoParams.objetoOriginal = dataObj;

            const codigoPedido = await this.$request(
              'post',
              '/pedidos',
              pedidoParams
            );

            this.$router.push(`/pedidos/submissao/${codigoPedido.data}`);
          } else {
            this.errosValidacao = true;
          }
        }
      } catch (err) {
        if (typeof err.message === 'string') {
          this.erros.push(err.message);
          this.erroDialog = true;
        }
      }
    },

    // Cancela a criação da Legislacao
    eliminarLegislacao: function() {
      this.pedidoEliminado = true;
    },

    cancelarCriacaoLegislacao: function() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
