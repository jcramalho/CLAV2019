<template>
  <div>
    <v-data-table
      flat
      style="background-color:#ffffff;"
      :headers="headers"
      :items="classes"
      class="elevation-1 mytable"
      :items-per-page="5"
      :footer-props="footer_props"
      dense
      @click:row="consultaClasse"
      :search="search"
    >
      <template v-slot:item.tipo="{ item }">
        <img
          v-if="item.tipo == 'serie'"
          style="width:23px; height:30px"
          :src="svg_sr"
        />
        <img
          v-else-if="item.tipo == 'subserie'"
          style="width:23px; height:30px"
          :src="svg_ssr"
        />
        <i v-else>{{ item.nivel }}</i>
      </template>
      <template v-slot:item.produtoras="{ item }">
        <ul>
          <li v-for="(entidade, i) in item.produtoras" :key="i">
            <a
              v-if="entidade.ent_or_tip.split('#')[1].split('_')[0] == 'tip'"
              :href="
                `${
                  entidade.ent_or_tip.split('#')[1].split('_')[0] == 'tip'
                    ? '/tipologias/'
                    : '/entidades/'
                }` + entidade.ent_or_tip.split('#')[1]
              "
              >{{ entidade.sigla + " - " + entidade.designacao }}</a
            >
          </li>
        </ul>
      </template>
      <template v-slot:item.legislacao="{ item }">
        <ul>
          <li v-for="(leg, i) in item.legislacao" :key="i">
            <a :href="'/legislacao/' + leg.leg.split('#')[1]">{{
              leg.tipo + " " + leg.numero + " - " + leg.sumario
            }}</a>
          </li>
        </ul>
      </template>
      <template v-slot:item.suporte_e_medicao="{ item }">
        <ul>
          <li v-for="(valores, i) in item.suporte_e_medicao" :key="i">
            {{ valores.suporte + ": " + valores.medicao }}
          </li>
        </ul>
      </template>
      <template v-slot:item.UIs="{ item }">
        <ul>
          <li v-for="(ui, i) in item.UIs" :key="i">{{ ui.codigo }}</li>
        </ul>
      </template>

      <template v-slot:item.relacoes="{ item }">
        <ul>
          <li v-for="(rel, i) in filtraRelacoes(item)" :key="i">
            {{ relacaoCorreta(rel.rel) + ": " + rel.codigo }}
          </li>
        </ul>
      </template>
      <template v-slot:item.justificacaoPCA="{ item }">
        <ul v-if="!!item.pca">
          <li v-for="(criterio, i) in item.pca.justificacaoPCA" :key="i">
            <b>{{
              criterio.tipo == "CriterioJustificacaoGestionario"
                ? "Critério Gestionário"
                : (criterio.tipo == "CriterioJustificacaoLegal"
                    ? "Critério Legal"
                    : "Critério de Utilidade Administrativa") + ": "
            }}</b>
            {{ criterio.conteudo }}
            <ul v-if="criterio.relacoes">
              <li v-for="(rel, j) in criterio.relacoes" :key="j">
                {{ !!rel.codigo ? rel.codigo : rel.tipo + " " + rel.numero }}
              </li>
            </ul>
          </li>
        </ul>
      </template>

      <template v-slot:item.justificacaoDF="{ item }">
        <ul v-if="!!item.df">
          <li v-for="(criterio, i) in item.df.justificacaoDF" :key="i">
            <b>{{
              criterio.tipo == "CriterioJustificacaoComplementaridadeInfo"
                ? "Critério de Complementaridade Informacional"
                : (criterio.tipo == "CriterioJustificacaoLegal"
                    ? "Critério Legal"
                    : "Critério de Densidade Informacional") + ": "
            }}</b>
            {{ criterio.conteudo }}
            <ul v-if="criterio.relacoes">
              <li v-for="(rel, j) in criterio.relacoes" :key="j">
                {{ !!rel.codigo ? rel.codigo : rel.tipo + " " + rel.numero }}
              </li>
            </ul>
          </li>
        </ul>
      </template>

      <template v-slot:item.formaContagem="{ item }">
        <div v-if="!!item.pca">
          {{ !!item.pca.formaLabel ? "Forma: " + item.pca.formaLabel : "" }}
          <br />
          {{
            !!item.pca.subformaLabel
              ? "Subforma: " + item.pca.subformaLabel
              : ""
          }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ["classes", "formaContagem", "search"],
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    footer_props: {
      "items-per-page-options": [1, 5, 10, -1],
      "items-per-page-text": "Mostrar"
    },
    headers: [
      {
        text: "Tipo",
        sortable: false,
        value: "tipo",
        align: "center",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Código",
        sortable: true,
        align: "center",
        value: "codigo",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Título",
        sortable: true,
        align: "center",
        value: "titulo",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Descrição",
        align: "left",
        sortable: true,
        align: "center",
        value: "descricao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Data Inicial",
        align: "left",
        sortable: true,
        align: "center",
        value: "dataInicial",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Data Final",
        align: "left",
        sortable: true,
        align: "center",
        value: "dataFinal",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Tipo de Unidade Arquivistica",
        align: "left",
        sortable: true,
        align: "center",
        value: "tipoUA",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Tipo Serie",
        align: "left",
        sortable: true,
        align: "center",
        value: "tipoSerie",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Suporte e Medição",
        align: "left",
        sortable: true,
        align: "center",
        value: "suporte_e_medicao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Unidades de Instalação",
        align: "left",
        sortable: false,
        align: "center",
        value: "UIs",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Localização",
        align: "left",
        sortable: true,
        align: "center",
        value: "localizacao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Produtoras",
        align: "left",
        sortable: false,
        align: "center",
        value: "produtoras",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Legislação",
        align: "left",
        sortable: false,
        align: "center",
        value: "legislacao",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Relações",
        align: "left",
        sortable: false,
        align: "center",
        value: "relacoes",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "PCA",
        align: "left",
        sortable: true,
        align: "center",
        value: "pca.pca",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Nota PCA",
        align: "left",
        sortable: true,
        align: "center",
        value: "pca.notaPCA",
        class: ["table-header", "body-2", "font-weight-bold"]
      },

      {
        text: "Forma Contagem PCA",
        align: "left",
        sortable: false,
        align: "center",
        value: "formaContagem",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Justificação PCA",
        align: "left",
        sortable: false,
        align: "center",
        value: "justificacaoPCA",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "DF",
        align: "left",
        sortable: true,
        align: "center",
        value: "df.df",
        class: ["table-header", "body-2", "font-weight-bold"]
      },

      {
        text: "Nota DF",
        align: "left",
        sortable: true,
        align: "center",
        value: "df.notadf",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Justificação DF",
        align: "left",
        sortable: false,
        align: "center",
        value: "justificacaoDF",
        class: ["table-header", "body-2", "font-weight-bold"]
      },
      {
        text: "Pai",
        sortable: true,
        align: "center",
        value: "pai",
        class: ["table-header", "body-2", "font-weight-bold"]
      }
    ]
  }),
  methods: {
    consultaClasse(item) {
      this.$emit("consultarClasse", item);
    },
    filtraRelacoes(item) {
      if (item.relacoes) {
        return item.relacoes.filter(
          e => e.rel != "temPai" && e.rel != "temFilho"
        );
      } else {
        return [];
      }
    },
    relacaoCorreta(relacao) {
      let traducao = "";
      switch (relacao) {
        case "eAntecessorDe":
          traducao = "Antecessor de";
          break;
        case "eSucessorDe":
          traducao = "Sucessora de";
          break;
        case "eCruzadoCom":
          traducao = "Cruzado com";
          break;
        case "eComplementarDe":
          traducao = "Complementar de";
          break;
        case "eSintetizadoPor":
          traducao = "Sintetizado por";
          break;
        case "eSinteseDe":
          traducao = "Síntese de";
          break;
        case "eSuplementoDe":
          traducao = "Suplemento de";
          break;
        case "eSuplementoPara":
          traducao = "Suplemento para";
          break;
      }
      return traducao;
    }
  }
};
</script>
