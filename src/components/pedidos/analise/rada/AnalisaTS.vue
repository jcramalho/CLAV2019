<template>
  <div>
    <!-- validar titulo TS -->
    <!-- {{ novoHistorico.tsRada.classes.dados }} -->
    <ValidaCampo
      :dadosOriginais="RADA.tsRada"
      :novoHistorico="novoHistorico.tsRada"
      campoValue="titulo"
      campoText="Título Tabela Seleção"
      tipo="string"
    >
      <template v-slot:input="props">
        <v-text-field
          :rules="[v => !!v || 'Campo obrigatório']"
          solo
          v-model="props.items.campoEditado"
          @input="props.items.updateValue"
        ></v-text-field>
      </template>
    </ValidaCampo>

    <!-- LISTAR CLASSES -->
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          clearable
          prepend-inner-icon="search"
          label="Pesquise a classe..."
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          flat
          :headers="headers"
          :items="novoHistorico.tsRada.classes.dados"
          :footer-props="footer_props"
          :items-per-page="5"
          @click:row="validarClasse"
          item-key="codigo"
          :custom-filter="(value, search, item) => {
            return !!JSON.stringify(item.dados).includes(search) ? true : false;
          }"
          :search="search"
        >
          <template v-slot:item.tipo="{ item }">
            <img
              v-if="item.dados.tipo.dados == 'Série'"
              style="width:23px; height:30px"
              :src="svg_sr"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'Subsérie'"
              style="width:23px; height:30px"
              :src="svg_ssr"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'N1'"
              style="width:23px; height:30px"
              :src="svg_N1"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'N2'"
              style="width:23px; height:30px"
              :src="svg_N2"
            />
            <img
              v-else-if="item.dados.tipo.dados == 'N3'"
              style="width:23px; height:30px"
              :src="svg_N3"
            />
            <i v-else>{{ item.tipo }}</i>
          </template>

          <template v-slot:item.codigo="{ item }">{{ item.dados.codigo.dados }}</template>

          <template v-slot:item.titulo="{ item }">{{ item.dados.titulo.dados }}</template>

          <template v-slot:item.df="{ item }">{{ !!item.dados.df ? item.dados.df.dados : '' }}</template>
          <template
            v-slot:item.eFilhoDe="{ item }"
          >{{ !!item.dados.eFilhoDe.dados ? item.dados.eFilhoDe.dados : '' }}</template>

          <template v-slot:item.pca="{ item }">{{ !!item.dados.pca ? item.dados.pca.dados : '' }}</template>

          <template v-slot:item.validade="{ item }">
            <v-avatar size="25" color="green" v-if="item.cor == 'verde'"></v-avatar>
            <v-avatar size="25" color="red" v-else-if="item.cor == 'vermelho'"></v-avatar>
            <v-avatar size="25" color="amber" v-else-if="item.cor == 'amarelo'"></v-avatar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <AnalisaArea
      v-if="tipoClasse == 'N1' || tipoClasse == 'N2' || tipoClasse == 'N3'"
      :elemento="classeOriginal"
      :novoHistorico="classeHistorico"
      @fechar="fechar"
    />
    <AnalisaSerie
      v-if="tipoClasse == 'Série' || tipoClasse == 'Subsérie'"
      :elemento="classeOriginal"
      :novoHistorico="classeHistorico"
      @fechar="fechar"
      :formaContagem="formaContagem"
    />
    <div v-if="novoHistorico.tsRada.UIs.dados[0]">
      <h5>Unidades de Instalação</h5>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="searchUI"
            clearable
            prepend-inner-icon="search"
            label="Pesquise a unidade de instalação..."
          />
          <v-data-table
            :headers="headersUI"
            :items="novoHistorico.tsRada.UIs.dados"
            :footer-props="footer_props"
            :items-per-page="5"
            @click:row="validarUI"
            :custom-filter="(value, search, item) => {
            return !!JSON.stringify(item.dados).includes(search) ? true : false;
          }"
            :search="searchUI"
          >
            <template v-slot:item.validade="{ item }">
              <v-avatar size="25" color="green" v-if="item.cor == 'verde'"></v-avatar>
              <v-avatar size="25" color="red" v-else-if="item.cor == 'vermelho'"></v-avatar>
              <v-avatar size="25" color="amber" v-else-if="item.cor == 'amarelo'"></v-avatar>
            </template>
            <template v-slot:item.codigo="{ item }">{{ item.dados.codigo.dados }}</template>

            <template v-slot:item.titulo="{ item }">{{ item.dados.titulo.dados }}</template>

            <template v-slot:item.classesAssociadas="{ item }">
              <ul style="list-style-type:none;" v-if="!!item.dados.classesAssociadas.dados[0]">
                <li v-for="(classe, i) in item.dados.classesAssociadas.dados" :key="i">
                  <span style="padding-right: 10px;">
                    <img
                      v-if="classe.tipo == 'Série'"
                      style="width:23px; height:23px"
                      :src="svg_sr"
                    />
                    <img v-else style="width:23px; height:23px" :src="svg_ssr" />
                  </span>
                  <span>{{ classe.codigo }}</span>
                </li>
              </ul>
              <p v-else>
                <br />Não tem séries/subséries associadas!
              </p>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <AnalisaUI
      v-if="tipoClasse == 'UI'"
      :elemento="classeOriginal"
      :novoHistorico="classeHistorico"
      @fechar="fechar"
    />
  </div>
</template>

<script>
import ValidaCampo from "@/components/pedidos/analise/rada/generic/ValidaCampo";
import AnalisaArea from "@/components/pedidos/analise/rada/classes/AnalisaArea";
import AnalisaSerie from "@/components/pedidos/analise/rada/classes/AnalisaSerie";
import AnalisaUI from "@/components/pedidos/analise/rada/classes/AnalisaUI";

export default {
  props: ["RADA", "novoHistorico", "formaContagem"],
  components: {
    ValidaCampo,
    AnalisaArea,
    AnalisaSerie,
    AnalisaUI,
  },
  methods: {
    fechar() {
      this.tipoClasse = null;
      this.classeOriginal = null;
      this.classeHistorico = null;
    },
    validarClasse(item) {
      this.tipoClasse = item.dados.tipo.dados;
      this.classeOriginal = this.RADA.tsRada.classes.find(
        (e) => e.codigo == item.dados.codigo.dados
      );
      this.classeHistorico = this.novoHistorico.tsRada.classes.dados.find(
        (e) => e.dados.codigo.dados == item.dados.codigo.dados
      );
    },
    validarUI(item) {
      this.tipoClasse = "UI";
      this.classeOriginal = this.RADA.tsRada.UIs.find(
        (e) => e.codigo == item.dados.codigo.dados
      );
      this.classeHistorico = this.novoHistorico.tsRada.UIs.dados.find(
        (e) => e.dados.codigo.dados == item.dados.codigo.dados
      );
    },
  },
  data() {
    return {
      validar: false,
      searchUI: "",
      tipoClasse: null,
      classeOriginal: null,
      classeHistorico: null,
      svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
      svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
      svg_N1: require("@/assets/n1.svg"),
      svg_N2: require("@/assets/n2.svg"),
      svg_N3: require("@/assets/n3.svg"),
      search: "",
      footer_props: {
        "items-per-page-options": [1, 5, 10, -1],
        "items-per-page-text": "Mostrar",
      },
      headers: [
        {
          sortable: false,
          value: "validade",
          align: "right",
          width: "5%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Tipo",
          sortable: true,
          value: "tipo",
          width: "10%",
          align: "center",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Código",
          sortable: true,
          align: "center",
          width: "15%",
          value: "codigo",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Título",
          sortable: true,
          align: "center",
          value: "titulo",
          width: "35%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "PCA",
          sortable: true,
          align: "center",
          value: "pca",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "DF",
          sortable: true,
          align: "center",
          value: "df",
          width: "10%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Classe Pai",
          value: "eFilhoDe",
          sortable: true,
          align: "center",
          width: "15%",
          class: ["table-header", "body-2", "font-weight-bold"],
        },
      ],
      headersUI: [
        {
          value: "validade",
          align: "center",
          width: "5%",
          sortable: false,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Código",
          align: "center",
          value: "codigo",
          width: "10%",
          sortable: true,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Título",
          value: "titulo",
          align: "center",
          width: "45%",
          sortable: true,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
        {
          text: "Séries/Subséries Associadas",
          value: "classesAssociadas",
          align: "center",
          width: "40%",
          sortable: false,
          class: ["table-header", "body-2", "font-weight-bold"],
        },
      ],
    };
  },
};
</script>
<style>
.table-header {
  color: #1a237e;
  font-weight: 400;
  background-color: #dee2f8;
  font-weight: bold;
}
</style>