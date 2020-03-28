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
          destinos finais da informação produzida no âmbito de um mesmo processo
          de negócio (classe de 3º nível) devem ser criadas classes de 4.º
          nível.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-card width="100%" class="mb-2">
        <v-card-title class="body-1 font-weight-bold">
          Esta classe de 3º nível irá ter subclasses de 4º nível?
        </v-card-title>
        <v-card-text>
          <v-radio-group v-model="c.temSubclasses4Nivel" row>
              <v-radio label="Sim" v-bind:value="true" color="#1A237E"></v-radio>
              <v-radio label="Não" v-bind:value="false" color="red"></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>
    </v-row>

    <v-row v-if="c.temSubclasses4Nivel">
      <v-card width="100%" class="mb-2">
        <v-card-title class="body-1 font-weight-bold">
          Selecão do(s) motivo(s) da subdivisão em 4ºs níveis
        </v-card-title>
        <v-card-text>
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
        </v-card-text>
      </v-card>
    </v-row>

    <v-row v-if="c.temSubclasses4Nivel && c.temSubclasses4NivelDF">
      <v-card width="100%" class="mb-2">
        <v-card-title class="body-1 font-weight-bold">
          Seleção do sentido da relação de síntese
        </v-card-title>
        <v-card-text>
          <p>Quando a subdivisão resulta da necessidade de criar destinos finais
          diferentes é gerada uma relação de síntese entre as classes de 4.º
          nível.</p>
          <p>Seleccione o sentido dessa relação de síntese:</p>
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
        </v-card-text>
      </v-card>
    </v-row>

    <v-row v-if="c.temSubclasses4Nivel && (c.termosInd.length > 0)">
      <v-card width="100%" class="mb-2">
        <v-card-title class="body-1 font-weight-bold">
          Distribuição dos Termos de Índice pelas subclasses criadas
        </v-card-title>
        <v-card-text>
          <p>No ato da subdivisão os termos de índice ficam associados à primeira subclasse. 
          Sempre que pretender alterar a distribuição dos termos de índice selecione a operação 
          abaixo.</p>
        </v-card-text>
        <v-card-actions>
            <v-btn color="indigo darken-4" 
              dark rounded
              @click="distribuiTIs=true"
              >Distribuir Termos de Índice</v-btn>
        </v-card-actions>
      </v-card>

      <DistribuiTI v-if="distribuiTIs" :c="c" 
          @distribuir="distribui($event)" @cancelar="distribuiTIs = false"/>
    </v-row>
  </div>
</template>

<script>
import DistribuiTI from "@/components/classes/criacao/DistribuiTI.vue";

export default {
  props: ["c"],

  components: {
    DistribuiTI
  },

  data: function() {
    return {
      distribuiTIs: false
    }
  },

  methods: {
    distribui: function(tis){
      this.distribuiTIs = false
      this.c.termosInd = JSON.parse(JSON.stringify(tis))
      for(var i=0; i < this.c.subclasses.length; i++){
        this.c.subclasses[i].termosInd = tis.filter(t => t.subclasse == this.c.subclasses[i].codigo)
      }
      return true
    }
  }
};
</script>
