<template>
  <div>
    <CientificaEdita :doc="this.doc" />
  </div>
</template>

<script>
import CientificaEdita from "@/components/documentacaoApoio/CientificaEdita.vue";

export default {
  components: {
    CientificaEdita
  },
  data: nt => ({
    doc: {}
  }),
  created: async function() {
    let id = this.$route.path.split("/")[4];
    let response = await this.$request("get", "/documentacaoCientifica/" + id);
    this.doc = response.data;
  }
};
</script>
