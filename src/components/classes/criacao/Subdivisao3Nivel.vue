<template>
  <!-- HÁ SUBDIVISÃO? -->
  <div>
    <v-row>
      <v-col>
        <p>
          Os critérios justificativos das decisões de avaliação têm por base o
          contexto de avaliação.
        </p>
        <p>
          Quando existe necessidade de diferenciar prazos de conservação e/ou
          destinos finais da informação produzida no âmbito de um mesmo processo de
          negócio (classe de 3º nível) devem ser criadas classes de 4.º nível.
        </p>

        <h4>Esta classe de 3º nível irá ter subclasses de 4º nível?</h4>
        <v-radio-group v-model="c.temSubclasses4Nivel">
          <v-radio label="Sim" v-bind:value="true" color="#1A237E"></v-radio>
          <v-radio label="Não" v-bind:value="false" color="red"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row v-if="c.temSubclasses4Nivel">
      <v-col>
        <h4>Selecione o(s) motivo(s) da subdivisão em 4ºs níveis:</h4>
        <v-checkbox
          v-model="c.temSubclasses4NivelPCA"
          hide-details
          class="shrink mr-2"
          color="#1A237E"
          label="Prazo de conservação administrativa distinto"
          value="true"
        ></v-checkbox>
        <v-checkbox
          v-model="c.temSubclasses4NivelDF"
          hide-details
          class="shrink mr-2"
          color="#1A237E"
          label="Destino final distinto"
          value="true"
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-row v-if="c.temSubclasses4Nivel && c.temSubclasses4NivelDF">
      <v-col>
        <p>
          Quando a subdivisão resulta da necessidade de criar destinos finais
          diferentes é gerada uma relação de síntese entre as classes de 4.º
          nível.
        </p>
        <h4>Seleccione o sentido dessa relação de síntese:</h4>
        <v-radio-group v-model="c.subdivisao4Nivel01Sintetiza02" col>
          <v-radio v-bind:value="true" color="#1A237E">
            <template v-slot:label>
              <div>{{ c.codigo }}.01 sintetiza {{ c.codigo }}.02</div>
            </template>
          </v-radio>
          <v-radio v-bind:value="false" color="#1A237E">
            <template v-slot:label>
              <div>{{ c.codigo }}.01 é sintetizada por {{ c.codigo }}.02</div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["c"]
};
</script>
