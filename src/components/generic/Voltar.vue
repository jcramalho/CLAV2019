<template>
  <v-btn @click="voltar()" rounded class="white--text px-2 clav-linear-background">
    <unicon
      name="arrow-back-icon"
      width="20"
      height="20"
      viewBox="0 0 20.71 37.261"
      fill="#ffffff"
    />
    <p class="ml-2">Voltar</p>
  </v-btn>
</template>

<script>
import CamundaRest from './../../services/camunda-rest.js';

export default {
  props: ["taskId"],
  methods: {
    voltar() {
      if (this.$route.path.split("/")[1]=='bpmn') {
        CamundaRest.postCompleteTask(this.taskId, {}).then((result) => {
          if (result.status === 200 || result.status === 204) {
            this.$router.push({ path: '/bpmn/tasklist/' });
          }
        });
      }
      else {
        this.$router.go(-1)
      }
    },
  }

};
</script>

<style scoped></style>
