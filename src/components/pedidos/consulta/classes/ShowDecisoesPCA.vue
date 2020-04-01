<template>
  <div>
    <v-row>
        <v-col cols="2">
          <div class="info-label">Prazo</div>
        </v-col>
        <v-col>
          <div class="info-content">
              {{ pca.valor }}
          </div>
        </v-col>
      </v-row>

      <v-row v-if="pca.notas!=''">
        <v-col cols="2">
          <div class="info-label">Notas</div>
        </v-col>
        <v-col>
          <div class="info-content">
              {{ pca.notas }}
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <div class="info-label">Forma de contagem</div>
        </v-col>
        <v-col>
          <div class="info-content">
              {{ pca.formaContagem }}
          </div>
        </v-col>
      </v-row>

      <v-row v-if="pca.formaContagem == 'vc_pcaFormaContagem_disposicaoLegal'">
        <v-col cols="2">
          <div class="info-label">Subforma de contagem</div>
        </v-col>
        <v-col>
          <div class="info-content">
              {{ pca.subFormaContagem }}
          </div>
        </v-col>
      </v-row>

      <ShowDecisoesPCAJustificacao :j="pca.justificacao" />

  </div>
</template>

<script>
import ShowDecisoesPCAJustificacao from "@/components/pedidos/consulta/classes/ShowDecisoesPCAJustificacao"

export default {
  props: ["pca"],

  components: {
    ShowDecisoesPCAJustificacao
  }
}
</script>