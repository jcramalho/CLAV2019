<template>
<v-dialog v-model="legislacaoDialog" max-width="80%">
    <v-card dark class="info-card">
        <v-card-title class="headline mb-2">Selecione a legislação a alterar</v-card-title>
        <div class="info-content px-3 mx-6 mb-2">
            <v-card-text class="pa-2 px-4 font-weight-medium">
                <v-row>
                    <v-col v-if="legislacao.ready">
                        <v-tooltip top color="info" open-delay="500">
                            <template v-slot:activator="{ on }">
                                <v-autocomplete light clearable color="blue darken-3" label="Legislação" :items="legislacao.legislacaoItems" v-model="dadosEditar" v-on="on" />
                            </template>
                            <span v-if="dadosEditar">{{ dadosEditar }}</span>
                            <span v-else>Selecionar legislação</span>
                        </v-tooltip>
                    </v-col>
                    <v-col v-else style="text-align: center;">
                        <p>A carregar legislações...</p>
                        <v-progress-circular indeterminate size="100" width="10" color="blue darken-3" />
                    </v-col>
                </v-row>
            </v-card-text>
        </div>
        <v-card-actions>
            <v-spacer />
            <v-btn color="success darken-1" rounded dark elevation="0" class="px-4" @click="editar()">
                Alterar
            </v-btn>
            <v-btn color="red darken-4" rounded dark elevation="0" class="px-4" @click="
                  legislacaoDialog = false;
                  dadosEditar = null;
                ">Fechar
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    props: ['open', 'nome', 'msg'],
    mounted() {
        window.scrollTo(0, 0);
    },
    data() {
        return {
            legislacaoDialog: open,
            legislacao: {
                legislacao: [],
                legislacaoItems: [],
                ready: false
            },
            dadosEditar: null
        };
    },
    watch: {
        open: function (val) {
            this.legislacaoDialog = val;
        }
    },
    methods: {
        go: function (url) {
            if (url.startsWith("http")) {
                window.location.href = url;
            } else {
                this.$router.push(url);
            }
        },
        editar() {
            let leg = null;
            leg = this.legislacao.legislacao.find(
                legislacao => legislacao.numero === this.dadosEditar.split(" ")[0]
            );
            this.go(`/legislacao/editar/${leg.id}`);
        }
    },
};
</script>
