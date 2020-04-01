<template>
    <v-row>
        <v-col cols="2">
          <div class="info-label">Notas de exclusão</div>
        </v-col>
        <v-col>
          <div class="info-content">
              <ul>
                  <li v-for="(n,i) in lista" :key="i">{{ n.nota }}</li>
              </ul>
          </div>
        </v-col>
      </v-row>
</template>

<script>
export default {
  props: ["lista"]
}
</script>