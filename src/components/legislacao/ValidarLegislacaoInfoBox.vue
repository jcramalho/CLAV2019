<template>
<v-col>
    <!-- Infobox com os resultados da validação -->
    <v-btn @click="validarLegislacao" rounded class="white--text" :class="{
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
                >Erros detetados na validação:
                {{ mensagensErro.length }}
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
    eDataFormatoErrado,
    eNV
} from "@/utils/validadores";

export default {
    props: ["l", "acao", "original"],

    data() {
        return {
            dialog: false,
            dialogSemErros: false,
            mensagensErro: [],
        };
    },

    methods: {
        fecharDialog() {
            this.dialog = false;
            this.limpaErros();
        },

        async validarLegislacaoCriacao() {
            let numeroErros = 0;

            //Tipo
            if (eNUV(this.l.tipo)) {
                this.mensagensErro.push({
                    sobre: "Tipo de Diploma",
                    mensagem: "O tipo de diploma não pode ser vazio."
                });
                numeroErros++;
            }

            // Número Diploma
            if (eNUV(this.l.numero)) {
                this.mensagensErro.push({
                    sobre: "Número de Diploma",
                    mensagem: "O número de diploma não pode ser vazio."
                });
                numeroErros++;
            } else {
                try {
                    let existeNumero = await this.$request(
                        "get",
                        "/legislacao/numero?valor=" + encodeURIComponent(this.l.numero)
                    );

                    if (existeNumero.data) {
                        numeroErros++;
                        this.mensagensErro.push({
                            sobre: "Número de Diploma",
                            mensagem: "O número de diploma já existente na BD."
                        });
                    }
                } catch (err) {
                    numeroErros++;
                    this.mensagensErro.push({
                        sobre: "Acesso à Ontologia",
                        mensagem: "Não consegui verificar a existência do número do diploma."
                    });
                }
            }

            // Data
            if (eNUV(this.l.data)) {
                this.mensagensErro.push({
                    sobre: "Data do Diploma",
                    mensagem: "A data do diploma não pode ser vazia.",
                });
                numeroErros++;
            } else if (eDataFormatoErrado(this.l.data)) {
                this.mensagensErro.push({
                    sobre: "Data do Diploma",
                    mensagem: "A data do diploma está no formato errado.",
                });
                numeroErros++;
            }

            // Sumário
            if (eNUV(this.l.sumario)) {
                this.mensagensErro.push({
                    sobre: "Sumário",
                    mensagem: "O sumário não pode ser vazio."
                });
                numeroErros++;
            }

            // Data Revogação
            if (!eNUV(this.l.data) && !eNUV(this.l.dataRevogacao)) {
                if (eDataFormatoErrado(this.l.dataRevogacao)) {
                    this.mensagensErro.push({
                        sobre: "Data de Revogação",
                        mensagem: "A data de revogação está no formato errado.",
                    });
                    numeroErros++;
                } else if (new Date(this.l.data) >= new Date(this.l.dataRevogacao)) {
                    this.mensagensErro.push({
                        sobre: "Data de revogação",
                        mensagem: "A data de revogação tem de ser superior à data do diploma."
                    });
                    numeroErros++;
                }
            }

            return numeroErros;
        },

        validarLegislacaoAlteracao(dados) {
            let numeroErros = 0;

            // Sumário
            if (eNV(dados.sumario)) {
                this.mensagensErro.push({
                    sobre: "Sumário",
                    mensagem: "O sumário não pode ser vazio."
                });
                numeroErros++;
            }

            return numeroErros;
        },

        validarLegislacaoRevogacao(dados) {
            let numeroErros = 0;

            // Data Revogação
            if (eNUV(dados.dataRevogacao)) {
                this.mensagensErro.push({
                    sobre: "Data de Revogação",
                    mensagem: "A data de revogação não pode ser vazia.",
                });
                numeroErros++;
            } else if (!eNUV(dados.dataRevogacao)) {
                if (eDataFormatoErrado(dados.dataRevogacao)) {
                    this.mensagensErro.push({
                        sobre: "Data de Revogação",
                        mensagem: "A data de revogação está no formato errado.",
                    });
                    numeroErros++;
                } else if (new Date(dados.data) >= new Date(dados.dataRevogacao)) {
                    this.mensagensErro.push({
                        sobre: "Data de revogação",
                        mensagem: "A data de revogação tem de ser superior à data do diploma."
                    });
                    numeroErros++;
                }
            }

            return numeroErros;
        },

        async validarLegislacao() {
            let erros = 0;
            let dataObj = JSON.parse(JSON.stringify(this.l));

            switch (this.acao) {
                case "Criação":
                    erros = await this.validarLegislacaoCriacao();
                    break;

                case "Alteração":
                    erros = this.validarLegislacaoAlteracao(dataObj);
                    for (const key in dataObj) {
                        if (
                            typeof dataObj[key] === "string" &&
                            dataObj[key] === this.original[key]
                        ) {
                            if (key !== "id") delete dataObj[key];
                        }
                    }

                    break;

                case "Revogação":
                    erros = this.validarLegislacaoRevogacao(dataObj);

                    for (const key in dataObj) {
                        if (key !== "sigla" && key !== "dataRevogacao") delete dataObj[key];
                    }
                    break;

                default:
                    erros = 0;
                    break;
            }

            if (erros !== 0) {
                this.dialog = true;
            } else {
                this.dialogSemErros = true;
            }
        },

        limpaErros() {
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
