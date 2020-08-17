<template>
  <Loading v-if="!dadosReady" :message="'elemento'" />
  <ApoEditaElemento v-else :t="this.entry" />
</template>

<script>
import ApoEditaElemento from "@/components/documentacaoApoio/ApoioEditaElemento.vue";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    ApoEditaElemento,
    Loading
  },
  data: nt => ({
    classe: "",
    entrada: "",
    entry: "",
    dadosReady: false
  }),
  methods: {
    preparaDocumento: async function(doc) {
      try {
        let myDoc = {
          idDoc: this.classe,
          idEntrada: this.entrada,
          idElemento: this.elemento,
          texto: doc.texto,
          ficheiro: doc.ficheiro,
          visivel: doc.visivel,
          eraseFile: false,
          initFile: doc.ficheiro != null ? true : false
        };
        return myDoc;
      } catch (e) {
        return {};
      }
    }
  },
  created: async function() {
    this.classe = this.$route.path.split("/")[4];
    this.entrada = this.$route.path.split("/")[5];
    this.elemento = this.$route.path.split("/")[6];
    let response = await this.$request(
      "get",
      "/documentacaoApoio/" +
        this.classe +
        "/entradas/" +
        this.entrada +
        "/elementos/" +
        this.elemento
    );
    this.entry = await this.preparaDocumento(response.data);
    this.dadosReady = true;
  }
};
</script>
