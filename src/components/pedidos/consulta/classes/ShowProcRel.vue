<template>
  <v-row>
    <v-col cols="2">
      <div class="info-label">Processos relacionados</div>
    </v-col>
    <v-col>
      <div class="info-content">
        <ul>
          <li v-for="(p, i) in lista" :key="i">
            [{{ p.relacao }}]: {{ p.codigo }} - {{ p.titulo }}
          </li>
        </ul>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["lista"]
};
</script>
