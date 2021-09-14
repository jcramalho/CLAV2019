<template>
  <div>
    <Campo nome="Destino" infoHeader="Destino" color="neutralpurple">
      <template v-slot:conteudo>
        {{ df.valor }}
      </template>
    </Campo>

    <Campo v-if="df.notas != ''" nome="Notas" infoHeader="Notas" color="neutralpurple">
      <template v-slot:conteudo>
        {{ df.notas }}
      </template>
    </Campo>

    <ShowDecisoesDFJustificacao :j="df.justificacao" />
  </div>
</template>

<script>
import ShowDecisoesDFJustificacao from "@/components/pedidos/consulta/classes/ShowDecisoesDFJustificacao";

import Campo from "@/components/generic/Campo";

export default {
  props: ["df"],

  components: {
    ShowDecisoesDFJustificacao,
    Campo,
  },
};
</script>
