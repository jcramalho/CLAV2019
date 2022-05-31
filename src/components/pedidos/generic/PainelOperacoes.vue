<template>
  <div>
    <v-row class="ma-2 text-center">
      <v-col>
        <v-btn
          v-if="temPermissaoDevolver() && $route.path.split('/')[1]=='bpmn' && options.includes('Devolver Pedido')"
          dark
          rounded
          class="red darken-4"
          @click="devolverPedido()"
        >
          Devolver
        </v-btn>

        <v-btn
          v-else-if="temPermissaoDevolver()"
          dark
          rounded
          class="red darken-4"
          @click="devolverPedidoDialog = true"
        >
          Devolver
        </v-btn>
      </v-col>

      
      <v-col>
        <v-btn
          v-if="
            (operacao === 'Analisar' || pedido.estado === 'Apreciado' || pedido.estado === 'Reapreciado') && 
            $route.path.split('/')[1]=='bpmn' && 
            (options.includes('Distribuir Pedido') || options.includes('Validação 2'))"
          rounded
          class="indigo accent-4 white--text"
          @click="avancarPedido()"
        >
          Encaminhar
        </v-btn>
        
        <v-btn
          v-else-if="
            (operacao === 'Analisar' || pedido.estado === 'Apreciado' || pedido.estado === 'Reapreciado') &&
            $route.path.split('/')[1]!='bpmn'
          "
          rounded
          class="indigo accent-4 white--text"
          @click="avancarPedidoDialog = true"
        >
          Encaminhar
        </v-btn>
      </v-col>

      <v-col>
        <v-btn
          v-if="$route.path.split('/')[1]=='bpmn' &&  (pedido.estado === 'Distribuído' ||
          pedido.estado === 'Apreciado' || pedido.estado === 'Redistribuído' || pedido.estado === 'Reapreciado') &&
          temPermissaoSubstituirResponsavel() && options.includes('Substituir Responsavel')"
          rounded
          class="indigo accent-4 white--text"
          @click="substituirResponsavel()"
        >
          Substituir Responsável
        </v-btn>

      </v-col>

    
      <v-col>
         <v-btn
          v-if="operacao === 'Validar' && $route.path.split('/')[1]=='bpmn' &&  (pedido.estado === 'Apreciado2v' || pedido.estado === 'Reapreciado2v' || pedido.estado === 'Apreciado' || pedido.estado === 'Reapreciado' ||
          pedido.estado === 'Em Despacho' || pedido.estado === 'Devolvido para validação') && options.includes('Reapreciar Pedido')"
          rounded
          class="indigo accent-4 white--text"
          @click="reapreciarPedido()"
        >
          Reapreciar
        </v-btn>

      </v-col>

      <v-col>
        <v-btn
          v-if="$route.path.split('/')[1]=='bpmn' && operacao === 'Validar' && options.includes('Aprovar Pedido')"
          rounded
          class="indigo accent-4 white--text"
          @click="finalizarPedido()"
        >
          Finalizar
        </v-btn>

        <v-btn
          v-else-if="operacao === 'Validar' && $route.path.split('/')[1]!='bpmn'"
          rounded
          class="indigo accent-4 white--text"
          @click="finalizarPedidoDialog = true"
        >
          Finalizar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dialog Avançar Pedido -->
    <v-dialog v-model="avancarPedidoDialog" width="60%">
      <AvancarPedido
        :utilizadores="utilizadores"
        :texto="{
          textoTitulo: 'Distribuição',
          textoAlert: 'validação',
          textoBotao: 'Distribuir',
        }"
        :pedido="this.$route.params.idPedido"
        @fecharDialog="fecharDialog()"
        @avancarPedido="avancarPedido($event)"
      />
    </v-dialog>

    <!-- Campo despacho -->
    <v-dialog v-model="devolverPedidoDialog" width="60%">
      <DevolverPedido
        @fecharDialog="fecharDialog()"
        @devolverPedido="devolverPedido($event)"
      />
    </v-dialog>

    <!-- Dialog de Confirmação de Operação -->
    <v-dialog v-model="finalizarPedidoDialog" width="50%">
      <FinalizarPedido
        @fecharDialog="fecharDialog()"
        @finalizarPedido="finalizarPedido($event)"
        :vai_para_despacho="vai_para_despacho"
      />
    </v-dialog>
  </div>
</template>

<script>
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";
import FinalizarPedido from "@/components/pedidos/generic/FinalizarPedido";
import { filtraNivel } from "@/utils/permissoes";
import { NIVEIS_VALIDAR_PEDIDO, NIVEIS_SUBSTITUIR_RESPONSAVEL, NIVEIS_DEVOLVER_PEDIDO } from "@/utils/consts";

import CamundaRest from './../../../services/camunda-rest.js';
import DataTransformation from './../../../utils/data-transformation';

export default {
  props: {
    operacao: {},
    vai_para_despacho: {
      type: Boolean,
      default: false,
    },
    pedido: {
      type: Object
    },
    options: {},
    historico: {}
  },

  components: {
    AvancarPedido,
    DevolverPedido,
    FinalizarPedido,
  },

  data() {
    return {
      avancarPedidoDialog: false,
      devolverPedidoDialog: false,
      finalizarPedidoDialog: false,
      utilizadores: [],
      taskId: this.$route.params.taskId,
      formdata: {
        "opcao": '',
        "historico":'',
      }
    };
  },

/*
  async beforeMount() {
    this.pedido = (
      await this.$request("get", "/pedidos/" + this.$route.params.idPedido)
    ).data;
  },*/

  async created() {
    try {
      await this.preparaUtilizadores();
      console.log("painel de operações com historico: " + JSON.stringify(this.historico))
    } catch (e) {
      return e;
    }
  },

  methods: {

    submit() {
      const variables = DataTransformation.generateVariablesFromFormFields(this.formdata);
      console.log(variables)
      console.log(this.taskId)
      CamundaRest.postCompleteTask(this.taskId, variables).then((result) => {
        if (result.status === 200 || result.status === 204) {
          this.$router.push({ path: '/bpmn/tasklist/' });
        }
      });
    },
    
    temPermissaoDevolver() {
      return NIVEIS_DEVOLVER_PEDIDO.includes(this.$userLevel());
    },

    temPermissaoSubstituirResponsavel() {
      return NIVEIS_SUBSTITUIR_RESPONSAVEL.includes(this.$userLevel());
    },

    async preparaUtilizadores() {
      const { data } = await this.$request("get", "/users");

      this.utilizadores = filtraNivel(data, NIVEIS_VALIDAR_PEDIDO);
    },

    fecharDialog() {
      this.avancarPedidoDialog = false;
      this.devolverPedidoDialog = false;
      this.finalizarPedidoDialog = false;
    },

    avancarPedido(dados) {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'distribuirPedido'
        this.formdata.historico = this.historico
        this.submit()
      } 
      else {
        this.fecharDialog()
        this.$emit("avancarPedido", dados);
      }
    },


    devolverPedido(dados) {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'devolverPedido'
        this.formdata.historico = this.historico
        this.submit()
      } 
      else {
        this.$emit("devolverPedido", dados);
      }
    },

    reapreciarPedido() {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'reapreciarPedido'
        this.formdata.historico = this.historico
        this.submit()
      } 
    },

    substituirResponsavel() {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'substituirResponsavel'
        this.formdata.historico = this.historico
        this.submit()
      } 
    },

    finalizarPedido(dados) {
      if (this.$route.path.split("/")[1]=='bpmn') {
        this.formdata.opcao = 'aprovarPedido'
        this.formdata.historico = this.historico
        this.submit()
      }
      else {
        this.fecharDialog();
        this.$emit("finalizarPedido", dados);
      }
    },
  },
};
</script>

<style scoped>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>
