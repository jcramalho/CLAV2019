<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Documentação de apoio</p>
    <!-- CONTENT -->
    <DocumentacaoApoio :expand="expand" />
  </v-card>
</template>

<script>
import DocumentacaoApoio from "@/components/principal/DocumentacaoApoio.vue";
export default {
  name: "DocsMetodologicos",
  data: () => ({
    expand: false,
  }),
  components: {
    DocumentacaoApoio,
  },
};
</script>
