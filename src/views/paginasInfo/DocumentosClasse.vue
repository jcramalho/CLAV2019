<template>
  <v-main
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <v-btn
      @click="$router.go(-1)"
      rounded
      class="white--text mb-6"
      :class="{
        'px-8': $vuetify.breakpoint.lgAndUp,
        'px-2': $vuetify.breakpoint.mdAndDown,
      }"
      id="default-button"
    >
      <unicon
        name="arrow-back-icon"
        width="20"
        height="20"
        viewBox="0 0 20.71 37.261"
        fill="#ffffff"
      />
      <p class="ml-2">Voltar</p>
    </v-btn>
    <v-card flat style="border-radius: 10px !important" class="pa-3">
      <p class="content-title-1">Documentação de apoio</p>
      <!-- CONTENT -->
      <v-row justify="center" class="mt-3">
        <v-col cols="12" md="3" class="text-center">
          <v-btn
            @click="expand = true"
            rounded
            class="white--text"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            color="success darken-1"
            id="botao-shadow"
          >
            <unicon
              name="expand-all-icon"
              width="20"
              height="20"
              viewBox="0 0 20.714 20.71"
              fill="#ffffff"
            />
            <p class="ml-2">Expandir Tudo</p>
          </v-btn>
        </v-col>
        <v-col cols="12" md="3" class="text-center">
          <v-btn
            @click="expand = false"
            rounded
            class="white--text error"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
            id="botao-shadow"
          >
            <unicon
              name="close-all-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.818"
              fill="#ffffff"
            />
            <p class="ml-2">Fechar Tudo</p>
          </v-btn>
        </v-col>
      </v-row>
      <DocumentacaoApoio :expand="expand" />
    </v-card>
  </v-main>
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
