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
          <div class="info-label">Fonte de legitimação
            <InfoBox header="Fonte de legitimação" :text="myhelp.Ppd.fonteLegitimacao"/>
          </div>
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
              :items="this.tabelasSelecao"
              item-text="titulo"
              return-object
              v-model="fonteLegitimacaoSelected"
              solo
              dense
            />
          </div>
          <div v-else-if="loadCheck === 'PGD/LC'">
            <v-autocomplete
              label="Selecione a fonte de legitimação"
              :items="this.portariaLC"
              item-text="titulo"
              return-object
              v-model="fonteLegitimacaoSelected"
              solo
              dense
            />
          </div>
          <div v-else-if="loadCheck === 'PGD'">
            <v-autocomplete
              label="Selecione a fonte de legitimação"
              :items="this.portaria"
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
              :items="this.portariaRada"
              item-text="titulo"
              return-object
              v-model="fonteLegitimacaoSelected"
              solo
              dense
            />
          </div>
          <div v-else>
                <v-autocomplete
                  label="Selecione a fonte de legitimação"
                  :items="this.tsRada"
                  item-text="titulo"
                  return-object
                  v-model="fonteLegitimacaoSelected"
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
  props: ["ppd", "entidades", "semaforos", "myhelp"],
  components: {
    InfoBox
  },

  data: () => ({
    fonteLegitimacao: ["TS/LC", "PGD/LC", "PGD", "RADA", "RADA/CLAV"],
    fonteLegitimacaoSelected: "",

    //usado para receber a info selecionada da fonteL.. para trocar!! para ja so tem o PGD a funcionar!!!!
    a: "",
    loadCheck: "",
    //---Fonte de legitimacao---

    portaria: [],
    portariaLC: [],
    portariaRada: [],
    tabelasSelecao: [],
    tsRada: [],

  }),
  computed: {

  },
  watch:{
    "loadCheck": async function(){
      try{
        if(this.loadCheck == "TS/LC"){
          var response = await this.$request("get","/tabelasSelecao")
          this.tabelasSelecao = response.data.map(ts=>{return {
              titulo: ts.designacao,
              codigo: ts.id.split("clav#")[1]
            }
          });
        }
        if(this.loadCheck == "PGD/LC"){
          var response = await this.$request("get", "/pgd/lc");
          this.portariaLC = await this.prepararLeg(response.data);
        }
        if(this.loadCheck == "PGD"){
          var response = await this.$request("get", "/pgd");
          this.portaria = await this.prepararLeg(response.data);
        }
        if(this.loadCheck == "RADA"){
          var response = await this.$request("get", "/legislacao?fonte=RADA");
          this.portariaRada = await this.prepararLeg(response.data);
        }
        else{
          var response = await this.$request("get","/rada");
          this.tsRada = response.data
        }
      }
       catch(e){
        this.portariaLC = [];
        this.portaria = [];
        this.portariaRada = [];
        this.tabelasSelecao = [];
        this.tsRada = [];
        console.log('Erro ao carregar a informação inicial: ' + e);
      }
    },

    "fonteLegitimacaoSelected": function() {
      alert("CARREGUEI FONTE")
      if (this.fonteLegitimacaoSelected) {
        this.ppd.fonteID = this.fonteLegitimacaoSelected.id
        this.$emit("consultaFT");
      }
    }
  },

  methods: {
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push({id: l.idPGD , titulo: l.tipo + " " + l.numero + " - " + l.sumario});
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },
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