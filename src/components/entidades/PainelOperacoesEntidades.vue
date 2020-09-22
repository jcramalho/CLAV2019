z<template>
<div>
    <v-row class="align-center pa-3" style="text-align:center;">
        <ValidarEntidadeInfoBox :e="e" :original="original" :acao="acao" />

        <v-col>
            <v-btn v-if="this.acao == 'Criação'" @click="criarAlterarEntidade" color="success darken-1" rounded class="white--text" :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }" id="botao-verde">
                <unicon name="adicionar-icon" width="20" height="20" viewBox="0 0 20.71 20.71" fill="#ffffff" />
                <p class="ml-2">Criar</p>
            </v-btn>

            <v-btn v-else-if="this.acao == 'Alteração'" @click="criarAlterarEntidade" color="success darken-1" rounded class="white--text" :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }" id="botao-verde">
                <unicon name="alterar-icon" width="20" height="20" viewBox="0 0 20.71 20.727" fill="#ffffff" />
                <p class="ml-2">Alterar</p>
            </v-btn>

            <v-btn v-else-if="this.acao == 'Extinção'" @click="criarAlterarEntidade" color="success darken-1" rounded class="white--text" :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }" id="botao-verde">
                <unicon name="eliminar-icon" width="20" height="20" viewBox="0 0 20.71 20.71" fill="#ffffff" />
                <p class="ml-2">Extinguir</p>
            </v-btn>
        </v-col>

        <v-col>
            <v-btn @click="eliminarEntidade" color="red darken-4" rounded class="white--text" :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }" id="botao-vermelho">
                <unicon name="remove-icon" width="20" height="20" viewBox="0 0 20.71 20.697" fill="#ffffff" />
                <p v-if="this.acao == 'Criação'" class="ml-2">Eliminar</p>
                <p v-if="this.acao == 'Alteração' || this.acao == 'Extinção'" class="ml-2">
                    Cancelar
                </p>
            </v-btn>
        </v-col>
    </v-row>
    <!-- Erros de Validação -->
    <v-row justify-center>
        <v-dialog v-model="errosValidacao" width="60%">
            <v-card dark class="info-card">
                <v-card-title class="headline mb-2">Erros detetados na validação</v-card-title>
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
                    <v-btn color="red darken-4" rounded dark elevation="0" class="px-4" @click="errosValidacao = false">
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <!-- Pedido de "Ação" de entidade submetido com sucesso -->
    <v-row justify-center>
        <v-dialog v-model="dialogEntidadeCriada" persistent max-width="60%">
            <DialogEntidadeSucesso :e="e" :codigoPedido="codigoPedido" :acao="acao" />
        </v-dialog>
    </v-row>

    <!-- Cancelamento da criação de uma entidade: confirmação -->
    <v-row justify-center>
        <v-dialog v-model="pedidoEliminado" persistent max-width="60%">
            <v-card dark class="info-card">
                <v-card-title class="headline mb-2">
                    Cancelamento e eliminação do pedido de
                    {{ formatarLabel(this.acao) }} de entidade
                </v-card-title>
                <div class="info-content px-3 mx-6 mb-2">
                    <v-card-text class="pa-2 px-4 font-weight-medium">
                        <p>
                            Selecionou o cancelamento de {{ formatarLabel(this.acao) }} da
                            entidade.
                        </p>
                        <p>Toda a informação introduzida será eliminada.</p>
                        <p>
                            Confirme a decisão para ser reencaminhado para a página
                            principal.
                        </p>
                    </v-card-text>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success darken-1" rounded dark elevation="0" class="px-4" @click="cancelarCriacaoEntidade">
                        Confirmo
                    </v-btn>
                    <v-btn color="red darken-4" rounded dark elevation="0" class="px-4" @click="pedidoEliminado = false">
                        Enganei-me, desejo continuar o trabalho
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>

    <v-row>
        <v-snackbar v-model="loginErrorSnackbar" :timeout="8000" color="error" :top="true">
            {{ loginErrorMessage }}
            <v-btn icon color="white" @click="loginErrorSnackbar = false">
                <unicon name="remove-icon" width="15" height="15" viewBox="0 0 20.71 20.697" fill="#ffffff" />
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
import ValidarEntidadeInfoBox from "@/components/entidades/ValidarEntidadeInfoBox";
import ErroDialog from "@/components/generic/ErroDialog";

import {
    criarHistorico,
    extrairAlteracoes
} from "@/utils/utils";
import {
    eNUV,
    eNV,
    eUndefined,
    eDataFormatoErrado,
    testarRegex,
} from "@/utils/validadores";

export default {
    props: ["e", "acao", "original"],

    components: {
        ValidarEntidadeInfoBox,
        ErroDialog,
    },

    data() {
        return {
            erroDialog: false,
            erros: [],
            loginErrorSnackbar: false,
            loginErrorMessage: "Precisa de fazer login para criar a Entidade!",
            pedidoEliminado: false,
            errosValidacao: false,
        };
    },

    methods: {
        fecharErro() {
            this.erroDialog = false;
            this.erros = [];
        },

        async validarEntidadeCriacao() {
            let numeroErros = 0;

            // Designação
            if (eNUV(this.e.designacao)) {
                numeroErros++;
            } else {
                try {
                    let existeDesignacao = await this.$request(
                        "get",
                        "/entidades/designacao?valor=" +
                        encodeURIComponent(this.e.designacao)
                    );
                    if (existeDesignacao.data) numeroErros++;
                } catch (err) {
                    numeroErros++;
                }
            }

            // Sigla
            if (eNUV(this.e.sigla)) {
                numeroErros++;
            } else {
                try {
                    let existeSigla = await this.$request(
                        "get",
                        "/entidades/sigla?valor=" + encodeURIComponent(this.e.sigla)
                    );
                    if (existeSigla.data) numeroErros++;
                } catch (err) {
                    numeroErros++;
                }
            }

            // Internacional
            if (eNUV(this.e.internacional)) {
                numeroErros++;
            }

            // SIOE
            if (!eNUV(this.e.sioe)) {
                if (this.e.sioe.length > 12) numeroErros++;
                else if (!testarRegex(this.e.sioe, /^\d+$/)) numeroErros++;
            }

            //Data Criação
            if (!eNUV(this.e.dataCriacao)) {
                if (eDataFormatoErrado(this.e.dataCriacao)) {
                    numeroErros++;
                }
            }

            // Data de Extinção
            if (!eNUV(this.e.dataCriacao) && !eNUV(this.e.dataExtincao)) {
                if (new Date(this.e.dataCriacao) >= new Date(this.e.dataExtincao))
                    numeroErros++;
            }

            return numeroErros;
        },

        async validarEntidadeAlteracao(dados) {
            let numeroErros = 0;

            // Designação
            if (eNV(dados.designacao)) {
                numeroErros++;
            } else if (!eUndefined(dados.designacao)) {
                try {
                    let existeDesignacao = await this.$request(
                        "get",
                        "/entidades/designacao?valor=" +
                        encodeURIComponent(dados.designacao)
                    );
                    if (existeDesignacao.data) {
                        numeroErros++;
                    }
                } catch (err) {
                    numeroErros++;
                }
            }

            // Internacional
            if (eNV(dados.internacional)) {
                numeroErros++;
            }

            // SIOE
            if (!eNUV(dados.sioe)) {
                if (dados.sioe.length > 12) numeroErros++;
                else if (!testarRegex(this.e.sioe, /^\d+$/)) numeroErros++;
            }

            //Data Criação
            if (!eNUV(dados.dataCriacao)) {
                if (eDataFormatoErrado(dados.dataCriacao)) {
                    numeroErros++;
                }
            }

            return numeroErros;
        },

        validarEntidadeExtincao(dados) {
            let numeroErros = 0;

            // Data de Extinção
            if (eNUV(dados.dataExtincao)) {
                numeroErros++;
            } else if (!eNUV(dados.dataExtincao)) {
                if (eDataFormatoErrado(dados.dataExtincao)) {
                    numeroErros++;
                }
            } else if (!eNUV(dados.dataCriacao) && !eNUV(dados.dataExtincao)) {
                if (new Date(dados.dataCriacao) >= new Date(dados.dataExtincao)) {
                    numeroErros++;
                }
            }

            return numeroErros;
        },

        // Lança o pedido de criação da entidade no worflow
        async criarAlterarEntidade() {
            try {
                if (this.$store.state.name === "") {
                    this.loginErrorSnackbar = true;
                } else {
                    let erros = 0;
                    let dataObj = JSON.parse(JSON.stringify(this.e));

                    const historico = [];

                    switch (this.acao) {
                        case "Criação":
                            erros = await this.validarEntidadeCriacao();

                            historico.push(criarHistorico(dataObj));

                            break;

                        case "Alteração":
                            dataObj = extrairAlteracoes(this.e, this.original);

                            erros = await this.validarEntidadeAlteracao(dataObj);

                            historico.push(criarHistorico(this.e, this.original));
                            break;

                        case "Extinção":
                            erros = this.validarEntidadeExtincao(dataObj);

                            for (const key in dataObj) {
                                if (key !== "dataExtincao") delete dataObj[key];
                            }

                            historico.push({
                                dataExtincao: {
                                    cor: "amarelo",
                                    dados: dataObj.dataExtincao,
                                    nota: null
                                }
                            });
                            break;

                        default:
                            break;
                    }

                    if (erros === 0) {
                        const objKeys = Object.keys(dataObj);

                        if (objKeys.length === 0)
                            throw new Error(
                                "Não foram alterados dados. Altere a informação pretendida e volte a submeter o pedido."
                            );

                        let userBD = this.$verifyTokenUser();

                        let pedidoParams = {
                            tipoPedido: this.acao,
                            tipoObjeto: "Entidade",
                            novoObjeto: dataObj,
                            user: {
                                email: userBD.email
                            },
                            entidade: userBD.entidade,
                            token: this.$store.state.token,
                            historico: historico
                        };

                        if (this.original !== undefined)
                            pedidoParams.objetoOriginal = this.original;
                        else pedidoParams.objetoOriginal = dataObj;

                        const codigoPedido = await this.$request(
                            "post",
                            "/pedidos",
                            pedidoParams
                        );

                        this.$router.push(`/pedidos/submissao/${codigoPedido.data}`);
                    } else {
                        this.errosValidacao = true;
                    }
                }
            } catch (err) {
                if (typeof err.message === "string") {
                    this.erros.push(err.message);
                    this.erroDialog = true;
                }
            }
        },

        criacaoPendenteTerminada: function () {
            this.$router.push("/");
        },

        // Cancela a criação da Entidade
        eliminarEntidade: function () {
            this.pedidoEliminado = true;
        },

        cancelarCriacaoEntidade: function () {
            this.$router.push("/entidades");
        }
    }
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
