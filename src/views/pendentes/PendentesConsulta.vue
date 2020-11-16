<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <ConsultaPendente :idp="$route.params.idPendente" />
  </v-content>
</template>

<script>
import ConsultaPendente from '@/components/pendentes/ConsultaPendente.vue'; // @ is an alias to /src

export default {
  components: {
    ConsultaPendente,
  },
};
</script>
