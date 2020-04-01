<template>
    <v-row>
        <v-col cols="2">
          <div class="info-label">Participantes no processo</div>
        </v-col>
        <v-col>
          <div class="info-content">
              <ul>
                <li v-for="(p,i) in lista" :key="i">
                   [{{ p.intervencao }}]
                    {{ p.sigla }}:
                    {{ p.designacao }}
                    ({{ p.tipo }})
                </li>
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