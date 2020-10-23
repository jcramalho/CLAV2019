<template>
  <div>
    <v-row>
        <v-col cols="2">
          <div class="info-label">Destino</div>
        </v-col>
        <v-col>
          <div class="info-content">
              {{ df.valor }}
          </div>
        </v-col>
    </v-row>

    <v-row v-if="df.notas!=''">
        <v-col cols="2">
          <div class="info-label">Notas</div>
        </v-col>
        <v-col>
          <div class="info-content">
              {{ df.notas }}
          </div>
        </v-col>
      </v-row>

      <ShowDecisoesDFJustificacao :j="df.justificacao" />

  </div>
</template>

<script>
import ShowDecisoesDFJustificacao from "@/components/pedidos/consulta/classes/ShowDecisoesDFJustificacao"

export default {
  props: ["df"],

  components: {
    ShowDecisoesDFJustificacao
  }
}
</script>