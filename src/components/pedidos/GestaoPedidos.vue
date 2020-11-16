<template>
<v-content :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }">
    <v-container fluid class="pa-0 ma-0" style="max-width:100%">
        <v-row>
            <!-- HEADER -->
            <v-col class="py-0 my-0">
                <v-btn @click="goBack" rounded class="white--text mb-6" :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }" id="default-button">
                    <unicon name="arrow-back-icon" width="20" height="20" viewBox="0 0 20.71 37.261" fill="#ffffff" />
                    <p class="ml-2">Voltar</p>
                </v-btn>
                <v-card flat style="border-radius: 10px !important;">
                    <p class="content-title-1 pt-5" style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;">
                        Gestão de Pedidos
                    </p>
                    <!-- CONTENT -->
                    <v-card-text class="mt-0">
                        <v-row justify="center" class="mt-3">
                            <v-col cols="12" md="3" class="text-center">
                                <v-btn @click="expandAll" rounded class="white--text" :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown,
                    }" color="success darken-1" id="botao-shadow">
                                    <unicon name="expand-all-icon" width="20" height="20" viewBox="0 0 20.714 20.71" fill="#ffffff" />
                                    <p class="ml-2">Expandir Tudo</p>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" md="3" class="text-center">
                                <v-btn @click="closeAll" rounded class="white--text" :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown,
                    }" style="background-color: rgb(153, 17, 17);" id="botao-shadow">
                                    <unicon name="close-all-icon" width="20" height="20" viewBox="0 0 20.71 20.818" fill="#ffffff" />
                                    <p class="ml-2">Fechar Tudo</p>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-expansion-panels flat multiple v-model="panelsArr" class="mt-4">
                            <PedidosNovos :pedidos="pedidosSubmetidos" :pesquisaPedidos="pesquisaPedidos" @distribuir="distribuiPedido($event)" />

                            <PedidosAnalise :pedidos="pedidosDistribuidos" :pesquisaPedidos="pesquisaPedidos" @analisar="analisaPedido($event)" />

                            <PedidosValidacao :pedidos="pedidosValidados" :pesquisaPedidos="pesquisaPedidos" @validar="validaPedido($event)" />

                            <PedidosEmDespacho :pedidos="pedidosEmDespacho" :pesquisaPedidos="pesquisaPedidos" @despachar="despacharPedido($event)" />

                            <PedidosDevolvidos :pedidos="pedidosDevolvidos" :pesquisaPedidos="pesquisaPedidos" />

                            <PedidosProcessados :pedidos="pedidosProcessados" :pesquisaPedidos="pesquisaPedidos" />
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>

                <v-dialog v-model="distribuir" width="80%" persistent>
                    <AvancarPedido :utilizadores="utilizadoresParaAnalisar" :texto="{
                textoTitulo: 'Distribuição',
                textoAlert: 'análise',
                textoBotao: 'Distribuir',
              }" :pedido="pedidoParaDistribuir.codigo" @fecharDialog="fecharDialog()" @avancarPedido="atribuirPedido($event)" />
                </v-dialog>
            </v-col>
        </v-row>
    </v-container>
</v-content>
</template>

<script>
import PedidosNovos from '@/components/pedidos/PedidosNovos';
import PedidosAnalise from '@/components/pedidos/PedidosAnalise';
import PedidosValidacao from '@/components/pedidos/PedidosValidacao';
import PedidosDevolvidos from '@/components/pedidos/PedidosDevolvidos';
import PedidosEmDespacho from '@/components/pedidos/PedidosEmDespacho';
import PedidosProcessados from '@/components/pedidos/PedidosProcessados';
import AvancarPedido from '@/components/pedidos/generic/AvancarPedido';

import {
    NIVEIS_ANALISAR_PEDIDO,
    NIVEIS_DISTRIBUIR_PEDIDO,
} from '@/utils/consts';
import {
    filtraNivel
} from '@/utils/permissoes';

export default {
    components: {
        PedidosNovos,
        PedidosAnalise,
        PedidosValidacao,
        PedidosDevolvidos,
        PedidosProcessados,
        AvancarPedido,
        PedidosEmDespacho,
    },

    data() {
        return {
            pedidoParaDistribuir: {},
            distribuir: false,
            utilizadoresParaAnalisar: [],
            pedidosSubmetidos: [],
            pedidosDistribuidos: [],
            pedidosValidados: [],
            pedidosEmDespacho: [],
            pedidosDevolvidos: [],
            pedidosProcessados: [],
            pesquisaPedidos: {
                painel: undefined,
                pesquisa: '',
                pagina: 1,
            },
            // Array para poder expandir/fechar todos os panels
            panelsArr: [],
            panelsArrItems: 6,
        };
    },

    async created() {
        await this.carregaPedidos();

        const storage = JSON.parse(localStorage.getItem('pesquisa-pedidos'));

        if (storage !== null && storage !== undefined) {
            if (storage.limpar) localStorage.removeItem('pesquisa-pedidos');
            else {
                this.pesquisaPedidos = storage;
                this.panelsArr = [this.pesquisaPedidos.painel]
            }

            localStorage.removeItem('pesquisa-pedidos');
        }
    },

    methods: {
        goBack() {
            this.$router.push('/tsInfo');
        },
        // Abrir todos os v-expansion-panel
        expandAll() {
            this.panelsArr = [...Array(this.panelsArrItems).keys()].map((k, i) => i);
            console.log(this.panelsArr)
        },
        // Fechar todos os v-expansion-panel
        closeAll() {
            this.panelsArr = [];
        },
        temPermissaoDistribuir() {
            return NIVEIS_DISTRIBUIR_PEDIDO.includes(this.$userLevel());
        },

        async carregaPedidos() {
            try {
                let pedidos = await this.$request('get', '/pedidos');
                pedidos = pedidos.data;

                this.pedidosSubmetidos = pedidos.filter(
                    (p) => p.estado === 'Submetido'
                );
                this.pedidosDistribuidos = pedidos.filter((p) => {
                    if (p.estado === 'Distribuído' || p.estado === 'Redistribuído')
                        return p;
                });
                this.pedidosValidados = pedidos.filter((p) => {
                    if (p.estado === 'Apreciado' || p.estado === 'Reapreciado') return p;
                });
                this.pedidosDevolvidos = pedidos.filter(
                    (p) => p.estado === 'Devolvido'
                );
                this.pedidosProcessados = pedidos.filter(
                    (p) => p.estado === 'Validado'
                );

                if (this.temPermissaoDistribuir())
                    await this.listaUtilizadoresParaAnalisar();
            } catch (e) {
                console.warn('e', e);
                return e;
            }
        },

        fecharDialog() {
            this.distribuir = false;
        },

        distribuiPedido(dados) {
            this.pedidoParaDistribuir = dados;
            this.distribuir = true;
        },

        async listaUtilizadoresParaAnalisar() {
            const response = await this.$request('get', '/users');

            const utilizadoresFiltrados = filtraNivel(
                response.data,
                NIVEIS_ANALISAR_PEDIDO
            );

            this.utilizadoresParaAnalisar = utilizadoresFiltrados;
        },

        analisaPedido(pedido) {
            this.$router.push('/pedidos/analisar/' + pedido.codigo);
        },

        validaPedido(pedido) {
            this.$router.push('/pedidos/validar/' + pedido.codigo);
        },

        despacharPedido(pedido) {
            this.$router.push('/pedidos/despachar/' + pedido.codigo);
        },

        async atribuirPedido(dados) {
            try {
                let pedido = JSON.parse(JSON.stringify(this.pedidoParaDistribuir));

                let estado = 'Distribuído';

                let dadosUtilizador = this.$verifyTokenUser();

                pedido.estado = estado;

                pedido.historico.push(pedido.historico[pedido.historico.length - 1]);

                const novaDistribuicao = {
                    estado: estado,
                    responsavel: dadosUtilizador.email,
                    proximoResponsavel: {
                        nome: dados.utilizadorSelecionado.name,
                        entidade: dados.utilizadorSelecionado.entidade,
                        email: dados.utilizadorSelecionado.email,
                    },
                    data: new Date(),
                    despacho: dados.mensagemDespacho,
                };

                await this.$request('put', '/pedidos', {
                    pedido: pedido,
                    distribuicao: novaDistribuicao,
                });

                this.carregaPedidos();
                // this.$router.push("/pedidos");
                this.fecharDialog();
            } catch (e) {
                console.log('e :', e);
            }
        },
    },
};
</script>
