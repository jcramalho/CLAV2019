<template>
  <div>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Entidades</div>
      </v-col>
      <v-col>
        <div class="info-content">
          <ul>
            <li v-for="e in p.objeto.entidades" :key="e.sigla">
              {{ e.searchField }}
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
        <div class="info-content">
          {{ p.objeto.listaProcSel.procSelComuns.length }}
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Processos Específicos</div>
      </v-col>
      <v-col>
        <div class="info-content">
          {{ p.objeto.listaProcSel.procSelEspecificos.length }}
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-1">
      <v-col cols="2">
        <div class="info-label">Processos Restantes</div>
      </v-col>
      <v-col>
        <div class="info-content">
          {{ p.objeto.listaProcSel.procSelUltimos.length }}
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-1">
      <v-col>
        <div class="info-content">{{ JSON.stringify(p) }}</div>
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
