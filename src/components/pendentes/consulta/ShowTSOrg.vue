<template>
  <div>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Entidade</div>
      </v-col>
      <v-col>
        <div class="info-content">
          {{ p.objeto.idEntidade }} - {{ p.objeto.designacao }}
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Tipologias</div>
      </v-col>
      <v-col>
        <div class="info-content">
          <ul>
            <li v-for="(t, i) in p.objeto.tipologias" :key="i">
              {{ t.searchField }}
            </li>
          </ul>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Processos Comuns</div>
      </v-col>
      <v-col>
        <div class="info-content">{{ p.objeto.procComuns.length }}</div>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Processos Específicos</div>
      </v-col>
      <v-col>
        <div class="info-content">{{ p.objeto.procEspecificos.length }}</div>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Processos Específicos Restantes</div>
      </v-col>
      <v-col>
        <div class="info-content">{{ p.objeto.procEspRestantes.length }}</div>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Processos Restantes</div>
      </v-col>
      <v-col>
        <div class="info-content">{{ p.objeto.procUltimos.length }}</div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["p"]
};
</script>

<style scoped>
.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
}

.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
