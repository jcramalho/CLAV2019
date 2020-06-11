<template>
  <div>
    <RADAEntry label="Título" :value="rada.tituloTS" />
    <v-row>
      <v-col cols="12" xs="12" sm="12">
        <div v-if="!!rada.tsRadaArv">
          <v-treeview hoverable :items="rada.tsRadaArv" item-key="codigo">
            <template v-slot:prepend="{ item }">
              <img v-if="item.tipo == 'serie'" style="width:23px; height:30px" :src="svg_sr" />
              <img
                v-else-if="item.tipo == 'subserie'"
                style="width:23px; height:30px"
                :src="svg_ssr"
              />
            </template>
            <template v-slot:label="{ item }">
              <b text @click="consultarClasse(item)">{{ item.codigo + " - " + item.titulo }}</b>
            </template>
          </v-treeview>
          <br />
        </div>
      </v-col>
    </v-row>
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

export default {
  props: ["rada"],
  data: () => ({
    svg_sr: require("@/assets/common_descriptionlevel_sr.svg"),
    svg_ssr: require("@/assets/common_descriptionlevel_ssr.svg"),
    consultar_serie_subserie: false,
    consultar_area_organico: false,
    show_item: null
  }),
  components: {
    RADAEntry,
    ConsultarSerieSubserie,
    ConsultarAreaOrganico
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
  }
};
</script>
