<template>
  <Loading v-if="!dadosReady" :message="'entrada'" />
  <ApoEditaEntrada v-else :t="this.entry" />
</template>

<script>
import ApoEditaEntrada from "@/components/documentacaoApoio/ApoioEditaEntrada.vue";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    ApoEditaEntrada,
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
          descricao: doc.descricao
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
    let response = await this.$request(
      "get",
      "/documentacaoApoio/" + this.classe + "/entradas/" + this.entrada
    );
    this.entry = await this.preparaDocumento(response.data);
    this.dadosReady = true;
  }
};
</script>
