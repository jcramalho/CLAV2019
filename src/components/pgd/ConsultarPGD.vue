<template>
<div>
    <v-card class="ma-4">
        <v-card-title class="indigo darken-4 white--text">
            {{ titulo }}
            <v-spacer />
            <v-tooltip left>
                <template v-slot:activator="{ on }">
                    <v-btn @click="csvExport()" color="white" icon v-on="on">
                        <v-icon>get_app</v-icon>
                    </v-btn>
                </template>
                <span>Transferir Tabela de Seleção</span>
            </v-tooltip>
        </v-card-title>

        <v-card-text class="ma-1">
            <v-row v-for="(item, index) in objeto" v-bind:key="index">
                <v-col cols="2" v-if="item.text">
                    <div class="info-label">
                        {{ item.campo }}

                        <InfoBox v-if="item.tipo === 'Legislação'" :header="item.campo" :text="myhelp.Legislacao.Campos[item.campo]" />
                    </div>
                </v-col>

                <v-col v-if="item.text">
                    <div v-if="item.campo === 'Link'" class="info-content">
                        <a :href="item.text" target="_blank">{{ item.text }}</a>
                    </div>
                    <div v-else>
                        <div v-if="item.campo === 'Entidades'" class="info-content">
                            <ul>
                                <li v-for="(ent, i) in item.text" :key="i">
                                    <a :href="'/entidades/ent_' + ent.sigla">{{ ent.sigla }}</a>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="info-content">{{ item.text }}</div>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col xs="2" sm="2" class="mt-3">
                    <div class="info-label">
                        Tabela de Seleção
                    </div>
                </v-col>
                <v-col xs="3" sm="3" />
                <v-col xs="5" sm="5">
                    <v-text-field v-if="!tree_ou_tabela" label="Procurar" v-model="search" append-icon="search" single-line hide-details />
                </v-col>
                <v-col xs="2" sm="2">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-switch prepend-icon="table_view" inset hide-details v-model="tree_ou_tabela" v-on="on"></v-switch>
                        </template>
                        <span>Alterar modo de visualização da Tabela de Seleção</span>
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-list v-if="tree_ou_tabela">
                        <v-list-group v-for="(classe, i) in classesTree" :key="i" multiple>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <span v-if="classe.codigo">{{ classe.codigo }}
                                            <span class="ml-7">{{ classe.titulo }}</span></span>
                                        <span v-else class="ml-9">{{ classe.titulo }}</span>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <ShowPGD :classe="classe" />
                        </v-list-group>
                    </v-list>
                    <v-data-table v-else :headers="headers" :items="classes" item-key="idClasse" :search="search" class="elevation-1" :footer-props="footer_props" :page.sync="paginaTabela" :expanded="expanded" :single-expand="true" @click:row="clicked">
                        >
                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length">
                                <v-card class="ma-1 elevation-0">
                                    <v-card-text>
                                        <v-row v-if="item.descricao">
                                            <v-col cols="2">
                                                <div class="info-label">Descrição</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">{{ item.descricao }}</div>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="item.diplomas">
                                            <v-col cols="2">
                                                <div class="info-label">
                                                    Diplomas Jurídico-Administrativo
                                                </div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">
                                                    <div v-for="(d, index) in item.diplomas.split('#')" :key="index">
                                                        {{ d }}
                                                    </div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="item.notaPCA">
                                            <v-col cols="2">
                                                <div class="info-label">Nota do PCA</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">{{ item.notaPCA }}</div>
                                            </v-col>
                                        </v-row>

                                        <v-row v-if="item.formaContagem">
                                            <v-col cols="2">
                                                <div class="info-label">Forma de Contagem</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">
                                                    {{ item.formaContagem }}
                                                </div>
                                            </v-col>
                                            <v-col cols="2" v-if="item.subFormaContagem">
                                                <div class="info-label">Subforma de Contagem</div>
                                            </v-col>
                                            <v-col v-if="item.subFormaContagem">
                                                <div class="info-content">
                                                    {{ item.subFormaContagem }}
                                                </div>
                                            </v-col>
                                        </v-row>

                                        <v-row v-if="item.justificacaoPCA">
                                            <v-col cols="2">
                                                <div class="info-label">Justificação do PCA</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">
                                                    {{ item.justificacaoPCA }}
                                                </div>
                                            </v-col>
                                        </v-row>

                                        <v-row v-if="item.notaDF">
                                            <v-col cols="2">
                                                <div class="info-label">Nota do Destino Final</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">{{item.notaDF}}</div>
                                            </v-col>
                                        </v-row>

                                        <v-row v-if="item.justificacaoDF">
                                            <v-col cols="2">
                                                <div class="info-label">Justificação do DF</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">{{item.justificacaoDF}}</div>
                                            </v-col>
                                        </v-row>

                                        <v-row v-if="item.donos">
                                            <v-col cols="2">
                                                <div class="info-label">Dono</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">
                                                    <div v-for="(d,index) in item.donos" :key="index"><a :href="'/entidades/' + d.entDono">{{d.designacaoDono}};</a></div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                        <v-row v-if="item.participantes">
                                            <v-col cols="2">
                                                <div class="info-label">Participante</div>
                                            </v-col>
                                            <v-col>
                                                <div class="info-content">
                                                    <div v-for="(p,index) in item.participantes" :key="index"><a :href="'/entidades/' + p.entParticipante">{{p.designacaoParticipante}}</a>;</div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </td>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</div>
</template>

<script>
import ShowPGD from "@/components/pgd/ShowPGD.vue";
export default {
    props: ["classes", "classesTree", "objeto", "titulo"],
    components: {
        ShowPGD
    },
    data: () => ({
        search: "",
        expanded: [],
        singleExpand: false,
        tree_ou_tabela: false,
        paginaTabela: 1,
        headers: [{
                text: "Código",
                sortable: false,
                value: "codigo"
            },
            {
                text: "Referência",
                sortable: false,
                value: "referencia"
            },
            {
                text: "Título",
                sortable: false,
                value: "titulo"
            },
            {
                text: "PCA",
                sortable: false,
                value: "pca"
            },
            {
                text: "Destino Final",
                sortable: false,
                value: "df"
            }
        ],
        headersLC: [{
                text: "Código",
                sortable: false,
                value: "codigo"
            },
            {
                text: "Título",
                sortable: false,
                value: "titulo"
            },
            {
                text: "PCA",
                sortable: false,
                value: "pca"
            },
            {
                text: "Destino Final",
                sortable: false,
                value: "df"
            }
        ],
        footer_props: {
            "items-per-page-options": [10, 25, -1],
            "items-per-page-text": "Mostrar",
            "items-per-page-all-text": "Todos"
        }
    }),
    methods: {
        csvExport() {
            //let csvContent = "data:text/csv;charset=utf-8,";
            let headers
            let csvContent
            let fileName = this.titulo.replace(/ /g, '_');
            if (this.objeto.fonte.text == "RADA") {
                headers = "Código,Nº de Referência,Título,Descrição,PCA,Nota PCA,Forma de contagem do PCA,DF,Nota ao DF"
                csvContent = [
                        headers,
                        ...this.classes.map(item => {
                            return '"' + (item.codigo || "") + '",' +
                                '"' + (item.referencia || "") + '",' +
                                '"' + (item.titulo || "") + '",' +
                                '"' + (item.descricao || "") + '",' +
                                '"' + (item.pca || "") + '",' +
                                '"' + (item.notaPCA || "") + '",' +
                                '"' + (item.formaContagem || "") + '",' +
                                '"' + (item.df || "") + '",' +
                                '"' + (item.notaDF || "") + '",'
                        })
                    ]
                    .join("\n")
                    .replace(/(^\[)|(\]$)/gm, "");

                fileName = "TS_RADA_" + this.objeto.entidade.text + "_" + this.objeto.data.text;
            } else if (this.objeto.fonte.text == "PGD/LC") {
                headers = "Código,N.º Referência,Título,Descrição,Dono PN,Participante PN,PCA,Nota PCA,Forma de Contagem PCA,DF,Nota DF"

                csvContent = [headers,
                        ...this.classes.map(item => {
                            var str =
                                '"' +
                                (item.codigo || "") +
                                '",' +
                                '"' +
                                (item.referencia || "") +
                                '",' +
                                '"' +
                                (item.titulo || "") +
                                '",' +
                                '"' +
                                (item.descricao || "") +
                                '",' +
                                '"' +
                                (item.designacaoDono ? "X" : "") +
                                '",' +
                                '"' +
                                (item.designacaoParticipante ? "X" : "") +
                                '",' +
                                '"' +
                                (item.pca || "") +
                                '",' +
                                '"' +
                                (item.notaPCA || "") +
                                '",' +
                                '"';
                            if (item.formaContagem == "Data de conclusão do procedimento")
                                str += "F04";
                            else if (item.formaContagem == "Data de cessação da vigência")
                                str += "F05";
                            else if (item.formaContagem == "Data de início do procedimento")
                                str += "F02";
                            else if (item.formaContagem == "Data de emissão do título")
                                str += "F03";
                            else if (
                                item.formaContagem ==
                                "Data de extinção da entidade sobre a qual recai o procedimento"
                            )
                                str += "F06";
                            else if (item.formaContagem == "Data de extinção do direito")
                                str += "F07";
                            else if (item.formaContagem == "Conforme disposição legal") {
                                str += "F01.";
                                if (item.subFormaContagem)
                                    str += item.subFormaContagem.split("F01.")[1];
                            }

                            str +=
                                '","' + (item.df || "") + '",' + '"' + (item.notaDF || "") + '"';
                            return str;
                        })
                    ]
                    .join("\n")
                    .replace(/(^\[)|(\]$)/gm, "");
            } else {
                headers =
                    "Código,N.º Referência,Título,Descrição,PCA,Nota PCA,DF,Nota DF";
                csvContent = [
                        headers,
                        ...this.classes.map(item => {
                            return (
                                '"' +
                                (item.codigo || "") +
                                '",' +
                                '"' +
                                (item.referencia || "") +
                                '",' +
                                '"' +
                                (item.titulo || "") +
                                '",' +
                                '"' +
                                (item.descricao || "") +
                                '",' +
                                '"' +
                                (item.pca || "") +
                                '",' +
                                '"' +
                                (item.notaPCA || "") +
                                '",' +
                                '"' +
                                (item.df || "") +
                                '",' +
                                '"' +
                                (item.notaDF || "") +
                                '"'
                            );
                        })
                    ]
                    .join("\n")
                    .replace(/(^\[)|(\]$)/gm, "");
            }
            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + data);
            link.setAttribute("download", fileName + ".csv");
            link.click();
        },
        clicked(value) {
            if (
                value.descricao ||
                value.notaDF ||
                value.notaPCA ||
                value.formaContagem ||
                value.subFormaContagem ||
                value.designacaoParticipante ||
                value.designacaoDono
            )
                if (this.expanded[0] == value) this.expanded.pop();
                else this.expanded = [value];
        }
    }
};
</script>

<style scoped>
.info-label {
    color: #283593;
    /* indigo darken-3 */
    padding: 5px;
    font-weight: 400;
    width: 100%;
    background-color: #e8eaf6;
    /* indigo lighten-5 */
    font-weight: bold;
    border-radius: 3px;
}

.info-content {
    padding: 8px;
    width: 100%;
    border: 1px solid #1a237e;
    border-radius: 3px;
}
</style>
