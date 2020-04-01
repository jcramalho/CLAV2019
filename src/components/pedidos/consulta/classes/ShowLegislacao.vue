<template>
    <v-row>
        <v-col cols="2">
          <div class="info-label">Legislação</div>
        </v-col>
        <v-col>
          <div class="info-content">
              <ul>
                <li v-for="(leg,i) in lista" :key="i">
                    {{ leg.tipo }}
                    {{ leg.numero }}, {{ leg.data }}, {{ leg.sumario }}
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