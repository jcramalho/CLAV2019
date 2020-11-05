<template>
<v-container>
    <v-row>
        <v-dialog v-model="dialog" width="95%" persistent>
            <v-card class="info-card">
                <v-card-title class="headline mb-4 white--text">
                    {{ p.codigo }} - {{ p.titulo }}
                </v-card-title>

                <v-card-text>
                    <v-row justify="center" class="mb-4">
                        <v-col cols="2">
                            <div class="info-label px-3">Aplica a todos</div>
                        </v-col>
                        <v-col cols="8" class="info-label py-0">
                            <v-row>
                                <v-col cols="2" class="py-0 pl-8">
                                    <span class="table-header subtitle-2 font-weight-bold">Dono</span>
                                    <v-checkbox id="centerffs" v-model="todosDonos"></v-checkbox>
                                </v-col>
                                <v-col cols="10" class="py-0">
                                    <span class="table-header subtitle-2 pl-5 font-weight-bold">Participante</span>
                                    <v-radio-group row v-model="todosParticipantes">
                                        <v-radio class="mx-auto" label="Não part." value="NP"></v-radio>
                                        <v-radio class="mx-auto caption" v-for="p in participacao" :key="p.idtermo" :label="p.termo.substring(0, 3)" :value="p.termo"></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <div class="info-content px-3 mx-6 mb-2">
                        <v-row justify="center">
                            <v-data-table class="content-table" :items="p.entidades" :headers="headers" :footer-props="footerConfig">
                                <template v-slot:item="props">
                                    <tr>
                                        <td>
                                            {{ props.item.label }}
                                        </td>
                                        <td>
                                            <v-checkbox class="ml-1" v-model="props.item.dono"></v-checkbox>
                                        </td>
                                        <td>
                                            <v-radio-group v-model="props.item.participante" row>
                                                <v-radio label="Não part." value="NP"></v-radio>
                                                <v-radio v-for="p in participacao" :key="p.idtermo" :label="p.termo.substring(0, 3)" :value="p.termo" class="caption"></v-radio>
                                            </v-radio-group>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-row>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success darken-1" rounded dark elevation="0" class="px-4" @click="selecionar">
                        Guardar
                    </v-btn>
                    <v-btn color="red darken-4" rounded dark elevation="0" class="px-4" @click="cancelar">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</v-container>
</template>

<script>
export default {
    props: ['p'],

    data: function () {
        return {
            dialog: false,
            participacao: [],
            todosDonos: false,
            todosParticipantes: 'NP',

            headers: [{
                    text: 'Entidade',
                    value: 'searchField',
                    width: '40%',
                    class: ['table-header', 'subtitle-2', 'font-weight-bold'],
                    sortable: false,
                },
                {
                    text: 'Dono',
                    value: 'dono',
                    class: ['table-header', 'subtitle-2', 'font-weight-bold'],
                    sortable: false,
                },
                {
                    text: 'Participante',
                    value: 'participante',
                    class: ['table-header', 'subtitle-2', 'font-weight-bold'],
                    sortable: false,
                },
            ],
            footerConfig: {
                'items-per-page-text': 'Entidades por página',
                'items-per-page-options': [10, 20, 50, 100, -1],
                'items-per-page-all-text': 'Todos',
            },
        };
    },

    watch: {
        todosDonos: function () {
            for (let i = 0; i < this.p.entidades.length; i++)
                this.p.entidades[i].dono = this.todosDonos;
        },
        todosParticipantes: function () {
            for (let i = 0; i < this.p.entidades.length; i++)
                this.p.entidades[i].participante = this.todosParticipantes;
        },
    },

    created: async function () {
        try {
            await this.tipoParticipacao();
        } catch (e) {
            console.log(
                'Erro no carregamento da travessia ou dos tipos de participação...'
            );
        }
    },

    mounted: function () {
        this.dialog = true;
    },

    methods: {
        // Lista com todos os tipos de intervenção possíveis
        tipoParticipacao: async function () {
            var resPar = await this.$request(
                'get',
                '/vocabularios/vc_processoTipoParticipacao'
            );

            this.participacao = resPar.data;
        },

        // Cancela sem alterar nada
        cancelar: function () {
            this.$emit('cancelada');
        },

        // Devolve a seleção para cima
        selecionar: function () {
            var contador = 0; // Controla se este proc entra ou não na contagem dos selecionados
            let i = 0,
                encontreiDono = false,
                encontreiParticipante = false;
            while (
                i < this.p.entidades.length &&
                (!encontreiDono || !encontreiParticipante)
            ) {
                if (this.p.entidades[i].dono) encontreiDono = true;
                if (this.p.entidades[i].participante != 'NP')
                    encontreiParticipante = true;
                i++;
            }
            if (encontreiDono) this.p.dono = true;
            else this.p.dono = false;
            if (encontreiParticipante) this.p.participante = true;
            else this.p.participante = false;

            if (encontreiDono || encontreiParticipante) {
                if (!this.p.edited) {
                    this.p.edited = true;
                    contador++;
                }
            } else {
                if (this.p.edited) {
                    this.p.edited = false;
                    contador = -1;
                }
            }

            this.p.chave = this.p.chave * -1;
            this.p.inc = contador;
            this.$emit('selecionadas', this.p);
        },
    },
};
</script>

<style scoped>
.info-card {
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
    text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

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

.content-table {
    background-color: #f1f6f8 !important;
    border-radius: 10px;
}

.v-data-table td {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>
