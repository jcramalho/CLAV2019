<template>
<v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn @click="validarEntidade" rounded class="white--text" :class="{
        'px-8': $vuetify.breakpoint.lgAndUp,
        'px-2': $vuetify.breakpoint.mdAndDown
      }" id="default-button">
        <unicon name="validar-icon" width="20" height="20" viewBox="0 0 20.709 20.696" fill="#ffffff" />
        <p class="ml-2">Validar</p>
    </v-btn>
    <!-- Erros na Validação ....................... -->
    <v-dialog v-model="dialog" width="80%">
        <v-card dark class="info-card">
            <v-card-title class="headline mb-4">
                Erros detetados na validação: {{ mensagensErro.length }}
            </v-card-title>
            <v-card-text class="font-weight-medium">
                <v-row v-for="(m, i) in mensagensErro" :key="i">
                    <v-col cols="3">
                        <div class="info-label px-3">{{ m.sobre }}</div>
                    </v-col>
                    <v-col>
                        <div class="info-content px-3">{{ m.mensagem }}</div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-4" rounded dark elevation="0" class="px-4" @click="dialog = false">
                    Fechar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Validação não detetou erros ........... -->
    <v-row justify-center>
        <v-dialog v-model="dialogSemErros" persistent max-width="60%">
            <v-card dark class="info-card">
                <v-card-title class="headline mb-2">Validação sem erros</v-card-title>
                <div class="info-content px-3 mx-6 mb-2">
                    <v-card-text class="pa-2 px-4 font-weight-medium">
                        <p>A informação introduzida não apresenta erros.</p>
                    </v-card-text>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-4" rounded dark elevation="0" class="px-4" @click="dialogSemErros = false">
                        Fechar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</v-col>
</template>

<script>
import {
    eNUV,
    eNV,
    eUndefined,
    eDataFormatoErrado,
    testarRegex,
} from "@/utils/validadores";

export default {
    props: ["e", "acao", "original"],

    data() {
        return {
            dialog: false,
            dialogSemErros: false,

            mensagensErro: []
        };
    },

    watch: {
        dialog: function (val) {
            if (!val) this.limpaErros();
        }
    },

    methods: {
        async validarEntidadeCriacao() {
            let numeroErros = 0;

            // Designação
            if (eNUV(this.e.designacao)) {
                this.mensagensErro.push({
                    sobre: "Nome da Entidade",
                    mensagem: "O nome da entidade não pode ser vazio."
                });
                numeroErros++;
            } else {
                try {
                    let existeDesignacao = await this.$request(
                        "get",
                        "/entidades/designacao?valor=" +
                        encodeURIComponent(this.e.designacao)
                    );
                    if (existeDesignacao.data) {
                        this.mensagensErro.push({
                            sobre: "Nome da Entidade",
                            mensagem: "Nome da entidade já existente na BD."
                        });
                        numeroErros++;
                    }
                } catch (err) {
                    numeroErros++;
                    this.mensagensErro.push({
                        sobre: "Acesso à Ontologia",
                        mensagem: "Não consegui verificar a existência da designação."
                    });
                }
            }

            // Sigla
            if (eNUV(this.e.sigla)) {
                this.mensagensErro.push({
                    sobre: "Sigla",
                    mensagem: "A sigla não pode ser vazia."
                });
                numeroErros++;
            } else {
                try {
                    let existeSigla = await this.$request(
                        "get",
                        "/entidades/sigla?valor=" + encodeURIComponent(this.e.sigla)
                    );
                    if (existeSigla.data) {
                        this.mensagensErro.push({
                            sobre: "Sigla",
                            mensagem: "Sigla já existente na BD."
                        });
                        numeroErros++;
                    }
                } catch (err) {
                    numeroErros++;
                    this.mensagensErro.push({
                        sobre: "Acesso à Ontologia",
                        mensagem: "Não consegui verificar a existência da sigla."
                    });
                }
            }

            // Internacional
            if (eNUV(this.e.internacional)) {
                this.mensagensErro.push({
                    sobre: "Internacional",
                    mensagem: "O campo internacional tem de ter uma opção."
                });
                numeroErros++;
            }

            // SIOE
            if (!eNUV(this.e.sioe)) {
                if (this.e.sioe.length > 12) {
                    this.mensagensErro.push({
                        sobre: "SIOE",
                        mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos."
                    });
                    numeroErros++;
                } else if (!testarRegex(this.e.sioe, /^\d+$/)) {
                    this.mensagensErro.push({
                        sobre: "SIOE",
                        mensagem: "O campo SIOE só pode ter digitos numéricos.",
                    });
                    numeroErros++;
                }
            }

            //Data Criação
            if (!eNUV(this.e.dataCriacao)) {
                if (eDataFormatoErrado(this.e.dataCriacao)) {
                    this.mensagensErro.push({
                        sobre: "Data de Criação",
                        mensagem: "A data de criação está no formato errado",
                    });
                    numeroErros++;
                }
            }

            // Data de Extinção
            if (!eNUV(this.e.dataCriacao) && !eNUV(this.e.dataExtincao)) {
                if (new Date(this.e.dataCriacao) >= new Date(this.e.dataExtincao)) {
                    this.mensagensErro.push({
                        sobre: "Data de Extinção",
                        mensagem: "A data de extinção tem de ser superior à data de criação."
                    });
                    numeroErros++;
                }
            }

            return numeroErros;
        },

        async validarEntidadeAlteracao(dados) {
            let numeroErros = 0;

            // Designação
            if (eNV(dados.designacao)) {
                this.mensagensErro.push({
                    sobre: "Nome da Entidade",
                    mensagem: "O nome da entidade não pode ser vazio."
                });
                numeroErros++;
            } else if (!eUndefined(dados.designacao)) {
                try {
                    let existeDesignacao = await this.$request(
                        "get",
                        "/entidades/designacao?valor=" +
                        encodeURIComponent(dados.designacao)
                    );
                    if (existeDesignacao.data) {
                        this.mensagensErro.push({
                            sobre: "Nome da Entidade",
                            mensagem: "Nome da entidade já existente na BD."
                        });
                        numeroErros++;
                    }
                } catch (err) {
                    numeroErros++;
                    this.mensagensErro.push({
                        sobre: "Acesso à Ontologia",
                        mensagem: "Não consegui verificar a existência da designação."
                    });
                }
            }

            // Internacional
            if (eNV(dados.internacional)) {
                this.mensagensErro.push({
                    sobre: "Internacional",
                    mensagem: "O campo internacional tem de ter uma opção."
                });
                numeroErros++;
            }

            // SIOE
            if (!eNUV(dados.sioe)) {
                if (dados.sioe.length > 12) {
                    this.mensagensErro.push({
                        sobre: "SIOE",
                        mensagem: "O campo SIOE tem de ter menos que 12 digitos numéricos.",
                    });
                    numeroErros++;
                } else if (!testarRegex(this.e.sioe, /^\d+$/)) {
                    this.mensagensErro.push({
                        sobre: "SIOE",
                        mensagem: "O campo SIOE só pode ter digitos numéricos.",
                    });
                    numeroErros++;
                }
            }

            //Data Criação
            if (!eNUV(this.e.dataCriacao)) {
                if (eDataFormatoErrado(this.e.dataCriacao)) {
                    this.mensagensErro.push({
                        sobre: "Data de Criação",
                        mensagem: "A data de criação está no formato errado",
                    });
                    numeroErros++;
                }
            }

            return numeroErros;
        },

        validarEntidadeExtincao(dados) {
            let numeroErros = 0;

            // Data de Extinção
            if (eNUV(dados.dataExtincao)) {
                this.mensagensErro.push({
                    sobre: "Data de Extinção",
                    mensagem: "A data de extinção não pode ser vazia.",
                });
                numeroErros++;
            } else if (!eNUV(dados.dataExtincao)) {
                if (eDataFormatoErrado(dados.dataExtincao)) {
                    this.mensagensErro.push({
                        sobre: "Data de Extinção",
                        mensagem: "A data de extinção está no formato errado.",
                    });
                    numeroErros++;
                }
            } else if (!eNUV(dados.dataCriacao) && !eNUV(dados.dataExtincao)) {
                if (new Date(dados.dataCriacao) >= new Date(dados.dataExtincao)) {
                    this.mensagensErro.push({
                        sobre: "Data de Extinção",
                        mensagem: "A data de extinção tem de ser superior à data de criação."
                    });
                    numeroErros++;
                }
            }

            return numeroErros;
        },

        async validarEntidade() {
            let erros = 0;
            let dataObj = JSON.parse(JSON.stringify(this.e));

            switch (this.acao) {
                case "Criação":
                    erros = await this.validarEntidadeCriacao();
                    break;

                case "Alteração":
                    for (const key in dataObj) {
                        if (
                            typeof dataObj[key] === "string" &&
                            dataObj[key] === this.original[key]
                        ) {
                            if (key !== "sigla") delete dataObj[key];
                        }
                    }

                    erros = await this.validarEntidadeAlteracao(dataObj);

                    break;

                case "Extinção":
                    erros = this.validarEntidadeExtincao(dataObj);

                    for (const key in dataObj) {
                        if (key !== "sigla" && key !== "dataExtincao") delete dataObj[key];
                    }

                    break;

                default:
                    break;
            }

            if (erros > 0) {
                this.dialog = true;
            } else {
                this.dialogSemErros = true;
            }
        },

        limpaErros: function () {
            this.mensagensErro = [];
        }
    }
};
</script>

<style scoped>
.info-label {
    color: #1a237e !important;
    padding: 8px;
    background-color: #dee2f8;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 6px;
}

.info-content {
    padding: 8px;
    background-color: #f1f6f8 !important;
    color: #606060;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
    border-radius: 10px;
}

.info-card {
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
    text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}
</style>
