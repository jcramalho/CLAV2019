<template>
  <v-card flat class="mb-12" style="background-color:#fafafa">
    <v-form ref="form" :lazy-validation="false">
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Título
            <InfoBox header="Título do PPD" :text="myhelp.Ppd.titulo"/>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="ppd.geral.nomePPD"
            label="Título"
            solo
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Entidades
            <InfoBox header="Entidades do PPD" :text="myhelp.Ppd.entidade"/>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="9" v-if="semaforos.entidadesReady">
          <v-autocomplete
            v-model="ppd.geral.entSel"
            :items="entidades"
            item-text="label"
            placeholder="Selecione as entidades abrangidas pelo PPD"
            multiple
            chips
            deletable-chips
            return-object
          >
          </v-autocomplete>
        </v-col>
        <v-col v-else>
          <v-alert dense type="info">
            Ainda não foi possível carregar as entidades...
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Menção de responsabilidade
            <InfoBox header="Identificação de responsabilidades pela elaboração do PPD " :text="myhelp.Ppd.responsabilidade"/>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-textarea
              v-model="ppd.geral.mencaoResp"
              label=""
              solo
              clearable
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Fonte de legitimação </div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="loadCheck" row>
            <v-radio
              v-for="(p, i) in fonteLegitimacao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
          <div v-if="loadCheck === 'TS/LC'">
            <v-autocomplete
              label="Selecione a fonte de legitimação"
              :items="tabelasSelecao"
              item-text="titulo"
              return-object
              v-model="a"
              solo
              dense
            />
          </div>
          <div v-else-if="loadCheck === 'PGD/LC'">
            <v-autocomplete
              label="Selecione a fonte de legitimação"
              :items="portariaLC"
              item-text="titulo"
              return-object
              v-model="a"
              solo
              dense
            />
          </div>
          <div v-else-if="loadCheck === 'PGD'">
            <v-autocomplete
              label="Selecione a fonte de legitimação"
              :items="portaria"
              item-text="titulo"
              return-object
              v-model="fonteLegitimacaoSelected"
              solo
              dense
            />
          </div>
          <div v-else-if="loadCheck === 'RADA'">
            <v-autocomplete
              label="Selecione a fonte de legitimação"
              :items="portariaRada"
              item-text="titulo"
              return-object
              v-model="a"
              solo
              dense
            />
          </div>
          <div v-else>
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="tsRada"
                  item-text="titulo"
                  return-object
                  v-model="a"
                  solo
                  dense
                ></v-autocomplete>
              </div>
        </v-col>
      </v-row>
    </v-form>
    <v-btn color="indigo darken-4" dark @click="next">Continuar</v-btn>
    <v-btn color="red darken-4" style="margin-left: 10px" dark @click="apagar">
      Limpar
    </v-btn>
  </v-card>
</template>




<script>
import InfoBox from "@/components/generic/infoBox.vue";


export default {
  props: ["ppd", "entidades", "semaforos", "portariaLC", "portaria", "portariaRada", "tsRada", "myhelp"],
  components: {
    InfoBox
  },

  data: () => ({
    fonteLegitimacao: ["TS/LC", "PGD/LC", "PGD", "RADA", "RADA/CLAV"],
    fonteLegitimacaoSelected: "",

    //usado para receber a info selecionada da fonteL.. para trocar!! para ja so tem o PGD a funcionar!!!!
    a: "",
    loadCheck: "",
  }),
  computed: {

  },
  watch:{
    "fonteLegitimacaoSelected": function() {

      if (this.fonteLegitimacaoSelected) {
        this.ppd.fonteID = this.fonteLegitimacaoSelected.id
        this.$emit("loadConsultaPGD");
      }
    }
  },

  methods: {
    apagar: function() {
      this.$refs.form.reset();
    },
    next: function() {
      if (this.$refs.form.validate()) {
        this.$emit("seguinte", 2);
      }
    }
  }
};
</script>