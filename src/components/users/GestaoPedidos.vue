<template>
    <v-card>
        <v-card-title style="outline: none;" class="pa-0 ma-0">
            <v-row class="separador ma-0 ml-0">
                <v-col cols=6 align="left">
                    <unicon name="pedido-em-validacao-icon" width="20" height="20" viewBox="0 0 20.71 20.709" fill="#ffffff" />
                    Lista de pedidos submetidos
                </v-col>
                <v-spacer />
                <v-col>
                    <b>Total de pedidos: {{ pedidos.length }}</b>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card class="ma-0 pa-5">
            <div class="info-content">
                <v-tooltip top color="info" open-delay="500">
                    <template v-slot:activator="{ on }">
                        <v-text-field v-on="on" v-model="procurar" append-icon="search" label="Procurar pedido" text single-line hide-details clearable color="blue darken-3" class="mt-n2 mb-3 mx-6 font-weight-medium" />
                    </template>

                    <span> Filtrar tabela</span>
                </v-tooltip>

                <v-data-table class="content-table" :headers="headers" :items="pedidos" :search.sync="procurar" sort-by="codigo" :custom-sort="ordenaTabela" :footer-props="footerProps" :items-per-page="5" @click:row="showPedido($event)">
                    <template v-slot:no-data>
                        <v-alert type="error" width="50%" class="m-auto mb-2 mt-2" outlined>
                            Não existem pedidos neste estado...
                        </v-alert>
                    </template>

                    <template v-slot:no-results>
                        <v-alert type="info" width="50%" class="m-auto mb-2 mt-2" outlined>
                            Sem resultados para "<strong>{{ procurar }}</strong>".
                        </v-alert>
                    </template>

                    <template v-slot:item.estado="{ item }">
                        <v-chip v-if="item.estado === 'Validado'" outlined color="green">
                            {{ item.estado }}
                            <v-icon right>assignment_turned_in</v-icon>
                        </v-chip>

                        <v-chip v-else-if="item.estado === 'Devolvido'" outlined color="red">
                            {{ item.estado }}
                            <v-icon right>assignment_late</v-icon>
                        </v-chip>

                        <v-chip v-else-if="item.estado === 'Submetido'" outlined color="blue">
                            {{ item.estado }}
                            <v-icon right>send</v-icon>
                        </v-chip>

                        <v-chip v-else outlined color="orange">
                            {{ item.estado }}
                            <v-icon right>assignment</v-icon>
                        </v-chip>
                    </template>

                    <template v-slot:footer.page-text="props">
                        {{ props.pageStart }} - {{ props.pageStop }} de
                        {{ props.itemsLength }}
                    </template>
                </v-data-table>
            </div>
        </v-card>
    </v-card>
</template>

<script>
export default {
    props: ["pedidos"],

    data() {
        return {
            procurar: "",
            headers: [{
                    text: "Código",
                    value: "codigo",
                    class: "title",
                    sortable: true,
                    filterable: true,
                },
                {
                    text: "Tipo",
                    value: "tipo",
                    class: "title",
                    sortable: true,
                    filterable: true,
                },
                {
                    text: "Data",
                    value: "data",
                    class: "title",
                    sortable: true,
                    filterable: true,
                },
                {
                    text: "Estado",
                    value: "estado",
                    class: "title",
                    sortable: true,
                    filterable: true,
                },
            ],
            footerProps: {
                "items-per-page-options": [10, 20, -1],
                "items-per-page-text": "Mostrar",
                "items-per-page-all-text": "Todos"
            },
        };
    },

    methods: {
        ordenaTabela(items, index, isDesc) {
            items.sort((a, b) => {
                if (index[0] === "codigo") {
                    if (!isDesc[0]) {
                        return (
                            parseInt(b[index].split("-")[0].concat(b[index].split("-")[1])) -
                            parseInt(a[index].split("-")[0].concat(a[index].split("-")[1]))
                        );
                    } else {
                        return (
                            parseInt(a[index].split("-")[0].concat(a[index].split("-")[1])) -
                            parseInt(b[index].split("-")[0].concat(b[index].split("-")[1]))
                        );
                    }
                } else if (index[0] === "data") {
                    if (!isDesc[0]) {
                        const dataA = a[index]
                            .split("-")
                            .reverse()
                            .join("");

                        const dataB = b[index]
                            .split("-")
                            .reverse()
                            .join("");

                        return dataB.localeCompare(dataA);
                    } else {
                        const dataA = a[index]
                            .split("-")
                            .reverse()
                            .join("");

                        const dataB = b[index]
                            .split("-")
                            .reverse()
                            .join("");

                        return dataA.localeCompare(dataB);
                    }
                } else {
                    if (
                        typeof a[index] !== "undefined" &&
                        typeof b[index] !== "undefined"
                    ) {
                        if (!isDesc[0]) {
                            return a[index]
                                .toLowerCase()
                                .localeCompare(b[index].toLowerCase());
                        } else {
                            return b[index]
                                .toLowerCase()
                                .localeCompare(a[index].toLowerCase());
                        }
                    }
                }
            });

            return items;
        },

        showPedido(pedido) {
            this.$router.push("/users/pedidos/" + pedido.codigo);
        },
    },
};
</script>

<style scoped>
.content-table {
    background-color: #f1f6f8 !important;
    border-radius: 10px;
}

.info-content {
    padding: 5px;
    width: 100%;
    background-color: #f1f6f8 !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}

.separador {
    color: white;
    padding: 5px;
    margin: 5px;
    font-weight: 400;
    width: 100%;
    min-height: 50px;
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
    font-size: 14pt;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
}
</style>
