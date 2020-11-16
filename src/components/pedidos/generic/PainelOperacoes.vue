<template>
<div>
    <v-row class="ma-2 text-center">
        <v-col>
            <v-btn v-if="temPermissaoDevolver()" dark rounded class="red darken-4" @click="devolverPedidoDialog = true">
                Devolver
            </v-btn>
        </v-col>

        <v-col>
            <v-btn v-if="operacao === 'Analisar'" rounded class="indigo accent-4 white--text" @click="avancarPedidoDialog = true">
                Encaminhar
            </v-btn>

            <v-btn v-else-if="operacao === 'Validar'" rounded class="indigo accent-4 white--text" @click="finalizarPedidoDialog = true">
                Finalizar
            </v-btn>
        </v-col>
    </v-row>

    <!-- Dialog Avançar Pedido -->
    <v-dialog v-model="avancarPedidoDialog" width="60%">
        <AvancarPedido :utilizadores="utilizadores" :texto="{
          textoTitulo: 'Distribuição',
          textoAlert: 'validação',
          textoBotao: 'Distribuir'
        }" :pedido="this.$route.params.idPedido" @fecharDialog="fecharDialog()" @avancarPedido="avancarPedido($event)" />
    </v-dialog>

    <!-- Campo despacho -->
    <v-dialog v-model="devolverPedidoDialog" width="60%">
        <DevolverPedido @fecharDialog="fecharDialog()" @devolverPedido="devolverPedido($event)" />
    </v-dialog>

    <!-- Dialog de Confirmação de Operação -->
    <v-dialog v-model="finalizarPedidoDialog" width="50%">
        <FinalizarPedido @fecharDialog="fecharDialog()" @finalizarPedido="finalizarPedido($event)" :vai_para_despacho="vai_para_despacho" />
    </v-dialog>
</div>
</template>

<script>
import AvancarPedido from "@/components/pedidos/generic/AvancarPedido";
import DevolverPedido from "@/components/pedidos/generic/DevolverPedido";
import FinalizarPedido from "@/components/pedidos/generic/FinalizarPedido";
import {
    filtraNivel
} from "@/utils/permissoes";
import {
    NIVEIS_VALIDAR_PEDIDO,
    NIVEIS_DEVOLVER_PEDIDO
} from "@/utils/consts";

export default {
    props: {
        operacao: {},
        vai_para_despacho: {
            type: Boolean,
            default: false,
        }
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
        };
    },

    async created() {
        try {
            await this.preparaUtilizadores();
        } catch (e) {
            return e;
        }
    },

    methods: {
        temPermissaoDevolver() {
            return NIVEIS_DEVOLVER_PEDIDO.includes(this.$userLevel());
        },

        async preparaUtilizadores() {
            const {
                data
            } = await this.$request("get", "/users");

            this.utilizadores = filtraNivel(data, NIVEIS_VALIDAR_PEDIDO);
        },

        fecharDialog() {
            this.avancarPedidoDialog = false;
            this.devolverPedidoDialog = false;
            this.finalizarPedidoDialog = false;
        },

        avancarPedido(dados) {
            this.$emit("avancarPedido", dados);
        },

        devolverPedido(dados) {
            this.$emit("devolverPedido", dados);
        },

        finalizarPedido(dados) {
            this.fecharDialog();
            this.$emit("finalizarPedido", dados);
        }
    },
};
</script>

<style scoped>
.info-label {
    color: #1a237e !important;
    padding: 8px;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 6px;
    text-align: center;
}

.info-content {
    padding: 5px;
    width: 100%;
    background-color: #f1f6f8 !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 10px;
}
</style>
