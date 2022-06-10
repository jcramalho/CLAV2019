<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">BPMN</p>
    <p class="clav-content-text px-8 py-2">
      Esta página é relacionada com a utilização de linguagem BPMN para a definição dos workflows da aplicação. 
    </p>
    <p class="clav-content-text px-8 py-2">
      Para implementar um novo workflow, selecione a opção <b>IMPLEMENTAR</b>.
    </p>
    <p class="clav-content-text px-8 py-2">
      Para começar um novo processo, selecione a opção
      <b>COMEÇAR</b>.
    </p>
    <p class="clav-content-text px-8 py-2">
      Para aceder às tarefas pendentes, selecione a opção
      <b>TAREFAS</b>.
    </p>

    <v-container fluid style="text-align: center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-btn
            @click="$router.push('/bpmn/deploy')"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="consultar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.697"
              fill="#ffffff"
            />
            <p class="ml-2">IMPLEMENTAR</p>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="3"
          v-if="
            [1, 3, 3.5, 4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
        >
          <v-btn
            @click="$router.push('/bpmn/startprocess')"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="criar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.721"
              fill="#ffffff"
            />
            <p class="ml-2">Começar</p>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="3"
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
        >
          <v-btn
            @click="$router.push('/bpmn/tasklist')"
            rounded
            class="white--text clav-linear-background"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown,
            }"
          >
            <unicon
              name="alterar-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 20.727"
              fill="#ffffff"
            />
            <p class="ml-2">Tarefas</p>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="3"
          v-if="
            [4, 5, 6, 7].includes(this.$userLevel()) &&
            this.$store.state.token != '' &&
            this.$store.state.name != ''
          "
        >
        </v-col>
      </v-row>
    </v-container>

  </v-card>
</template>

<script>

export default {
  name: "BPMN",
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
    };
  },
  methods: {

    go: function (url) {
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        this.$router.push(url);
      }
    },
  },

};
</script>

<style scoped>

.info-card {
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%);
  text-shadow: 0px 1px 2px rgba(255, 255, 255, 0.22) !important;
}

.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  color: #606060;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
