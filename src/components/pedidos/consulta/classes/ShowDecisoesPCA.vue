<template>
  <div>
    <Campo nome="Prazo" infoHeader="Prazo" color="neutralpurple">
      <template v-slot:conteudo>
        {{ pca.valor }}
      </template>
    </Campo>

    <Campo v-if="pca.notas != ''" nome="Notas" infoHeader="Notas" color="neutralpurple">
      <template v-slot:conteudo>
        {{ pca.notas }}
      </template>
    </Campo>

    <Campo nome="Forma de contagem" infoHeader="Forma de contagem" color="neutralpurple">
      <template v-slot:conteudo>
        {{ pca.formaContagem }}
      </template>
    </Campo>

    <Campo
      v-if="pca.formaContagem == 'vc_pcaFormaContagem_disposicaoLegal'"
      nome="Subforma de contagem"
      infoHeader="Subforma de contagem"
      color="neutralpurple"
    >
      <template v-slot:conteudo>
        {{ pca.subFormaContagem }}
      </template>
    </Campo>

    <ShowDecisoesPCAJustificacao :j="pca.justificacao" />
  </div>
</template>

<script>
import ShowDecisoesPCAJustificacao from "@/components/pedidos/consulta/classes/ShowDecisoesPCAJustificacao";

import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["pca"],

  components: {
    ShowDecisoesPCAJustificacao,
    Campo,
  },
};
</script>
