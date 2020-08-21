<template>
  <div>
    <RADAEntry label="Título" :value="rada.tituloTS" />
    <v-row>
      <v-col xs="11" sm="11">
        <v-text-field
          v-model="search"
          label="Pesquise a classe"
          clearable
          append-icon="search"
        ></v-text-field>
      </v-col>
      <v-col xs="1" sm="1">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-switch
              prepend-icon="table_view"
              inset
              hide-details
              v-model="tree_ou_tabela"
              v-on="on"
            ></v-switch>
          </template>
          <span>Alterar modo de visualização das classes</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row v-if="!tree_ou_tabela">
      <v-col cols="12" xs="12" sm="12">
        <div v-if="!!rada.tsRadaArv">
          <v-treeview
            hoverable
            :items="rada.tsRadaArv"
            item-key="codigo"
            :search="search"
            :filter="filter"
          >
            <template v-slot:prepend="{ item }">
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
            </template>
            <template v-slot:label="{ item }">
              <b text @click="consultarClasse(item)">{{
                item.codigo + " - " + item.titulo
              }}</b>
            </template>
          </v-treeview>
          <br />
        </div>
      </v-col>
    </v-row>
    <TabelaClassesRADAConsulta
      v-else
      :search="search"
      :classes="rada.tsRada"
      :formaContagem="formaContagem"
      @consultarClasse="consultarClasse"
    />
    <ConsultarSerieSubserie
      v-if="consultar_serie_subserie"
      @fecharDialog="consultar_serie_subserie = false"
      :dialog="consultar_serie_subserie"
      :classe="show_item"
    />
    <ConsultarAreaOrganico
      v-if="consultar_area_organico"
      @fecharDialog="consultar_area_organico = false"
      :dialog="consultar_area_organico"
      :classe="show_item"
    />
    <!-- <p>{{rada.tsRada}}</p> -->
  </div>
</template>

<script>
import RADAEntry from "@/components/rada/consulta/elementos/campos/RadaEntry.vue";
import ConsultarSerieSubserie from "@/components/rada/consulta/elementos/ConsultarSerieSubserie.vue";
import ConsultarAreaOrganico from "@/components/rada/consulta/elementos/ConsultarAreaOrganico.vue";
import TabelaClassesRADAConsulta from "@/components/rada/consulta/TabelaClassesRADAConsulta.vue";

export default {
  props: ["rada"],
  data: () => ({
    search: null,
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    consultar_serie_subserie: false,
    consultar_area_organico: false,
    show_item: null,
    tree_ou_tabela: false,
    formaContagem: {
      subFormasContagem: [],
      formasContagem: []
    }
  }),
  components: {
    RADAEntry,
    ConsultarSerieSubserie,
    ConsultarAreaOrganico,
    TabelaClassesRADAConsulta
  },
  computed: {
    filter() {
      return (item, search) => {
        return (
          item.codigo.indexOf(search) > -1 || item.titulo.indexOf(search) > -1
        );
      };
    }
  },
  methods: {
    consultarClasse(item) {
      if (item.tipo == "serie" || item.tipo == "subserie") {
        this.consultar_serie_subserie = true;
      } else {
        this.consultar_area_organico = true;
      }

      this.show_item = this.rada.tsRada.find(e => e.codigo == item.codigo);
      this.show_item.pai = item.eFilhoDe;
    }
  },
  async created() {
    // FAZER PEDIDOS PARA A FORMA/SUBFORMA DE CONTAGEM
    let responseFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaFormaContagem"
    );

    this.formaContagem.formasContagem = responseFC.data.map(item => {
      return {
        label: item.termo,
        value: item.idtermo.split("#")[1]
      };
    });

    let responseSFC = await this.$request(
      "get",
      "/vocabularios/vc_pcaSubformaContagem"
    );

    this.formaContagem.subFormasContagem = responseSFC.data.map(item => {
      return {
        label: item.termo.split(": ")[1] + ": " + item.desc,
        value: item.idtermo.split("#")[1]
      };
    });
  }
};
</script>
