<template>
  <!-- HÁ SUBDIVISÃO? -->
  <div>
    <p class="font-weight-bold">
      Esta classe de 3º nível irá ter subclasses de 4º nível?
    </p>

    <v-alert border="top" colored-border type="info" elevation="2">
      <p>
        Os critérios justificativos das decisões de avaliação têm por base o contexto de
        avaliação.
      </p>
      <p>
        Quando existe necessidade de diferenciar prazos de conservação e/ou destinos
        finais da informação produzida no âmbito de um mesmo processo de negócio (classe
        de 3º nível) devem ser criadas classes de 4.º nível.
      </p>
    </v-alert>
    <v-radio-group v-model="c.temSubclasses4Nivel" row>
      <v-radio label="Não" :value="false" color="primary"></v-radio>
      <v-radio label="Sim" :value="true" color="primary"></v-radio>
    </v-radio-group>

    <div v-if="c.temSubclasses4Nivel" width="100%" class="mb-2">
      <p class="font-weight-bold">Selecão do(s) motivo(s) da subdivisão em 4ºs níveis:</p>
      <v-checkbox
        v-model="c.temSubclasses4NivelPCA"
        hide-details
        class="shrink mr-2"
        color="primary"
        label="Prazo de conservação administrativa distinto"
        value="true"
      ></v-checkbox>
      <v-checkbox
        v-model="c.temSubclasses4NivelDF"
        hide-details
        class="shrink mr-2"
        color="primary"
        label="Destino final distinto"
        value="true"
      ></v-checkbox>
    </div>

    <div v-if="c.temSubclasses4Nivel && c.temSubclasses4NivelDF">
      <p class="font-weight-bold">Seleccione o sentido dessa relação de síntese:</p>
      <v-alert border="top" colored-border type="info" elevation="2">
        <p>
          Quando a subdivisão resulta da necessidade de criar destinos finais diferentes é
          gerada uma relação de síntese entre as classes de 4.º nível.
        </p>
      </v-alert>

      <v-radio-group v-model="c.subdivisao4Nivel01Sintetiza02" col>
        <v-radio v-bind:value="true" color="primary">
          <template v-slot:label>
            <div>{{ c.codigo }}.01 sintetiza {{ c.codigo }}.02</div>
          </template>
        </v-radio>
        <v-radio v-bind:value="false" color="primary">
          <template v-slot:label>
            <div>{{ c.codigo }}.01 é sintetizada por {{ c.codigo }}.02</div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>

    <div v-if="c.temSubclasses4Nivel && c.termosInd.length > 0">
      <p class="font-weight-bold">
        Distribuição dos Termos de Índice pelas subclasses criadas:
      </p>
      <v-alert border="top" colored-border type="info" elevation="2">
        <p>
          No ato da subdivisão os termos de índice ficam associados à primeira subclasse.
          Sempre que pretender alterar a distribuição dos termos de índice selecione a
          operação abaixo.
        </p>
      </v-alert>
      <v-btn color="primary" class="white--text" rounded @click="distribuiTIs = true">
        Distribuir Termos de Índice
      </v-btn>
    </div>

    <DistribuiTI
      v-if="distribuiTIs"
      :c="c"
      @distribuir="distribui($event)"
      @cancelar="distribuiTIs = false"
    />
  </div>
</template>

<script>
import DistribuiTI from "@/components/classes/criacao/DistribuiTI.vue";

export default {
  props: ["c"],

  components: {
    DistribuiTI,
  },

  data: function () {
    return {
      distribuiTIs: false,
    };
  },

  methods: {
    distribui: function (tis) {
      this.distribuiTIs = false;
      this.c.termosInd = JSON.parse(JSON.stringify(tis));
      for (var i = 0; i < this.c.subclasses.length; i++) {
        this.c.subclasses[i].termosInd = tis.filter(
          (t) => t.subclasse == this.c.subclasses[i].codigo
        );
      }
      return true;
    },
  },
};
</script>
