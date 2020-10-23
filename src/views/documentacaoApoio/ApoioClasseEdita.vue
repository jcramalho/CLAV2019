<template>
  <Loading v-if="!dadosReady" :message="'classe'" />
  <ApoEditaClasse v-else :t="this.doc" />
</template>

<script>
import ApoEditaClasse from "@/components/documentacaoApoio/ApoioEditaClasse.vue";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    ApoEditaClasse,
    Loading
  },
  data: nt => ({
    id: "",
    doc: {},
    dadosReady: false
  }),
  methods: {
    preparaDocumento: async function(doc) {
      try {
        let myDoc = {
          _id: doc._id,
          classe: doc.classe
        };
        return myDoc;
      } catch (e) {
        return {};
      }
    }
  },
  created: async function() {
    this.id = this.$route.path.split("/")[4];

    let response = await this.$request("get", "/documentacaoApoio/" + this.id);

    this.doc = await this.preparaDocumento(response.data);

    this.dadosReady = true;
  }
};
</script>
