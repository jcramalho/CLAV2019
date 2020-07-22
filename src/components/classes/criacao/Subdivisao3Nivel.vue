<template>
  <!-- HÁ SUBDIVISÃO? -->
  <div>
    <v-row class="mx-1 mt-8">
      <v-col class="info-content pa-4">
        <div class="ma-3">
          <p>
            Os critérios justificativos das decisões de avaliação têm por base o
            contexto de avaliação.
          </p>
          <p>
            Quando existe necessidade de diferenciar prazos de conservação e/ou
            destinos finais da informação produzida no âmbito de um mesmo
            processo de negócio (classe de 3º nível) devem ser criadas classes
            de 4.º nível.
          </p>
          <p
            class="body-1 font-weight-bold px-0 pt-4"
            style="color: #1a237e !important;"
          >
            Esta classe de 3º nível irá ter subclasses de 4º nível?
          </p>
          <v-radio-group
            v-model="c.temSubclasses4Nivel"
            hide-details
            row
            class="mt-3"
          >
            <v-radio label="Sim" v-bind:value="true" color="blue"></v-radio>
            <v-radio label="Não" v-bind:value="false" color="red"></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>
    <v-row class="mx-1 mt-3" v-if="c.temSubclasses4Nivel">
      <v-col class="info-content pa-4">
        <div class="ma-3">
          <p
            class="body-1 font-weight-bold px-0"
            style="color: #1a237e !important;"
          >
            Selecão do(s) motivo(s) da subdivisão em 4ºs níveis
          </p>
          <v-checkbox
            v-model="c.temSubclasses4NivelPCA"
            hide-details
            class="mt-3"
            color="#1A237E"
            label="Prazo de conservação administrativa distinto"
            value="true"
          ></v-checkbox>
          <v-checkbox
            v-model="c.temSubclasses4NivelDF"
            hide-details
            color="#1A237E"
            label="Destino final distinto"
            value="true"
          ></v-checkbox>
        </div>
      </v-col>
    </v-row>
    <v-row
      class="mx-1 mt-3"
      v-if="c.temSubclasses4Nivel && c.temSubclasses4NivelDF"
    >
      <v-col class="info-content pa-4">
        <div class="ma-3">
          <p
            class="body-1 font-weight-bold px-0"
            style="color: #1a237e !important;"
          >
            Seleção do sentido da relação de síntese
          </p>

          <p class="mt-3">
            Quando a subdivisão resulta da necessidade de criar destinos finais
            diferentes é gerada uma relação de síntese entre as classes de 4.º
            nível.
          </p>
          <p>Seleccione o sentido dessa relação de síntese:</p>
          <v-radio-group
            v-model="c.subdivisao4Nivel01Sintetiza02"
            col
            class="mt-3"
          >
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
        </div>
      </v-col>
    </v-row>
    <v-row
      class="mx-1 mt-3"
      v-if="c.temSubclasses4Nivel && c.termosInd.length > 0"
    >
      <v-col class="info-content pa-4">
        <div class="ma-3">
          <p
            class="body-1 font-weight-bold px-0"
            style="color: #1a237e !important;"
          >
            Distribuição dos Termos de Índice pelas subclasses criadas
          </p>
          <p class="mt-3">
            No ato da subdivisão os termos de índice ficam associados à primeira
            subclasse. Sempre que pretender alterar a distribuição dos termos de
            índice selecione a operação abaixo.
          </p>
          <v-btn
            @click="distribuiTIs = true"
            rounded
            class="white--text mt-3"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <p>Distribuir Termos de Índice</p>
          </v-btn>
        </div>
      </v-col>

      <DistribuiTI
        v-if="distribuiTIs"
        :c="c"
        @distribuir="distribui($event)"
        @cancelar="distribuiTIs = false"
      />
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
    };
  },

  methods: {
    distribui: function(tis) {
      this.distribuiTIs = false;
      this.c.termosInd = JSON.parse(JSON.stringify(tis));
      for (var i = 0; i < this.c.subclasses.length; i++) {
        this.c.subclasses[i].termosInd = tis.filter(
          t => t.subclasse == this.c.subclasses[i].codigo
        );
      }
      return true;
    }
  }
};
</script>
<style scoped>
.info-content {
  margin-top: 4px;
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
</style>
