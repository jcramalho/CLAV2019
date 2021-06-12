<template>
  <v-row>
    <div class="separador">Avaliação</div>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Descrição</div>
    </v-col>
    <v-col cols="12" xs="12" sm="10" >
      <v-textarea
        label="Não possui"
        :value="siSpec.avaliacao.descricao"
        readonly
        rows="3"
        max-rows="6"
        solo
        dense
      ></v-textarea>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Decomposição</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.decomposicao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Código de classificação da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.codClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">N.º de ref.ª da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.numeroClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Título da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.tituloClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">PCA da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.pcaClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Forma de contagem dos prazos</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.formaContagemPrazos"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Destino final da classe / série</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.destinoFinalClasse"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">PCA do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.pcaSI"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Destino final do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.destinoSI"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">SI relacionado: n.º de referência</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.siRelacionado"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">SI relacionado: tipo de relação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.siRelacionadoRelacao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Atividade do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.checkedAti"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Grau de utilização do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.checkedGrau"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">Criticidade do SI</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.checkedCriticidade"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="2" >
      <div class="info-label">SI é objeto de preservação</div>
    </v-col>
    <v-col cols="12" xs="12" sm="4" >
      <v-text-field
        label="Não possui"
        :value="siSpec.avaliacao.objetoPreservacao"
        readonly
        solo
        dense
      ></v-text-field>
    </v-col>
    <v-col cols="12" xs="12" sm="12" >
      <v-data-table
        :headers="headers"
        :items="siSpec.avaliacao.selecionadosTabelaFL"
        :items-per-page="5"
        item-key="codigo"
        :search="searchSI"
        :sort-by="['codigo']"
        class="elevation-1"
        :footer-props="footer_props"
      >
        <template v-slot:header="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: green;"
            >{{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.codigo }}</td>
            <td>{{ props.item.referencia }}</td>
            <td>{{ props.item.titulo }}</td>
            <td>{{ props.item.pca }}</td>
            <td>{{ props.item.df }}</td>
            <td>
              <v-btn small color="blue darken-2" dark rounded @click="class2Show(props.item)">
                <v-icon dark>visibility</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template v-slot:footer.page-text="props">
            Classes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-col>
    <template>
      <div>
        <v-dialog
          :retain-focus="false"
          v-model="verClasse"
        >
          <v-card>
            <v-card-title class="expansion-panel-heading">Classe</v-card-title>
            <div class="v-card__text mt-4">
              <v-row>
                <v-col cols="12" xs="12" sm="2" >
                  <div class="info-label">Código</div>
                </v-col>
                <v-col cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.codigo"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="2" >
                  <div class="info-label">Referência</div>
                </v-col>
                <v-col cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.referencia"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="2" >
                  <div class="info-label">Título</div>
                </v-col>
                <v-col cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.titulo"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="2" >
                  <div class="info-label">PCA</div>
                </v-col>
                <v-col cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.pca"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
                <v-col v-if="classeSpec.notaPCA != null" cols="12" xs="12" sm="2" >
                  <div class="info-label">Nota PCA</div>
                </v-col>
                <v-col v-if="classeSpec.notaPCA != null" cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.notaPCA"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="2" >
                  <div class="info-label">Destino final</div>
                </v-col>
                <v-col cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.df"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
                <v-col v-if="classeSpec.notaDF != null" cols="12" xs="12" sm="2" >
                  <div class="info-label">Nota destino final</div>
                </v-col>
                <v-col v-if="classeSpec.notaDF != null" cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.notaDF"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xs="12" sm="2" >
                  <div class="info-label">Nível</div>
                </v-col>
                <v-col cols="12" xs="12" sm="10" >
                  <v-text-field
                    label="Não possui"
                    :value="classeSpec.nivel"
                    readonly
                    rows="3"
                    solo
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-row align="center" justify="space-around">
                <v-btn
                color="indigo darken-2"
                dark
                class="ma-2"
                rounded
                @click="verClasse = false"
                >
                  Fechar
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-row>
</template>

<script>

export default {
  props: ["siSpec"],

  data: () => ({
    searchSI: "",
    verClasse: false,
    classeSpec: {},

    headers: [
      { text: "Código", value: "codigo" },
      { text: "Referência", value: "referencia" },
      { text: "Título", value: "titulo" },
      { text: "PCA", value: "pca" },
      { text: "Destino Final", value: "df" },
      { text: "Ver", value: ""},
    ],

    footer_props: {
      "items-per-page-text": "Classes por página",
      "items-per-page-options": [5, 10, 20, -1],
      "items-per-page-all-text": "Todos"
    },

  }),
  methods: {
    class2Show: function(item){
      this.classeSpec = item;
      this.verClasse = true;
    },
  }
}

</script>


<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}


.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
