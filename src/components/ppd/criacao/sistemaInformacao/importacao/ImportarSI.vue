<template>
  <v-dialog v-model="dialogState" max-width="80%">
    <v-card>
      <v-form ref="form">
        <v-card-title class="indigo darken-4 white--text">Importar Sistema de Informação</v-card-title>
        <v-card-text>
          <ImportarFicheiro label="Ficheiro Sistema de Informação" @ficheiro="novoFicheiroSI" />
        </v-card-text>
        <v-card-actions>
          <v-alert
            width="100%"
            :value="erros_ficheiro"
            outlined
            type="error"
            prominent
            border="left"
          >{{ erros }}</v-alert>
          <v-spacer></v-spacer>

          <v-btn
            v-if="!importarCircle"
            color="indigo darken-4"
            dark
            @click="dialogState = false"
          >Voltar</v-btn>
          <v-btn v-if="!importarCircle" color="indigo darken-4" dark @click="importar">Importar</v-btn>

          <v-progress-circular
            v-if="importarCircle"
            :size="40"
            :width="3"
            color="amber accent-3"
            indeterminate
          ></v-progress-circular>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import ImportarFicheiro from "@/components/ppd/criacao/sistemaInformacao/importacao/ImportarFicheiro.vue";
const conversor = require("@/plugins/ppd/ConversorSI.js").importarSI;
export default {
  props: ["ppd", "dialog", "classesDaFonteL"],
  components: {
    ImportarFicheiro,
  },
  data: () => ({
    ficheiroSI: null,
    erros_ficheiro: false,
    erros: {},
    importarCircle: false,
  }),
  methods: {
    novoFicheiroSI(novoFicheiro) {
      this.ficheiroSI = novoFicheiro;
    },
    importar() {
      conversor(
        this.ficheiroSI,
        JSON.parse(JSON.stringify(this.ppd))
      )
        .then((res) => {
          this.inserirSI(res.allSI);
          this.dialogState = false;
          this.importarCircle = false;
        })
        .catch((err) => {
          this.erros = err.erros;
          this.erros_ficheiro = true;
          this.importarCircle = false;
          setTimeout(() => {
            this.erros_ficheiro = false;
            this.erros = {};
          }, 5000);
        });
    },
    inserirSI(allSI) {
      var auxSistemasInfo = []
      for(let i = 0; i< allSI.length; i++){
        var index = this.ppd.sistemasInfo.findIndex(l => l.numeroSI == allSI[i].numeroSI);
        this.ppd.listaSistemasInfoAuxiliar.push(allSI[i])
        if(index != -1 ){
          //this.ppd.sistemasInfo[index] = Object.assign(this.ppd.sistemasInfo[index], allSI[i])
          if(allSI[i].identificacao.adminSistema){
            this.ppd.sistemasInfo[index].identificacao = allSI[i].identificacao;
          }
          else if(allSI[i].avaliacao.descricao){
            var ids = allSI[i].avaliacao.codClasse.split("#")
            var selecionadosTabelaFL = []
            for(var id in ids){
              selecionadosTabelaFL.push(JSON.parse(JSON.stringify(this.classesDaFonteL[id])))
            }
            allSI[i].avaliacao.selecionadosTabelaFL = selecionadosTabelaFL
            this.ppd.sistemasInfo[index].avaliacao = allSI[i].avaliacao;
          }
          else if(allSI[i].caracterizacao.dependenciaSoft){
            this.ppd.sistemasInfo[index].caracterizacao = allSI[i].caracterizacao;
          }
          else if(allSI[i].estrategia.uOperacionalIdentificacao){
            this.ppd.sistemasInfo[index].estrategia = allSI[i].estrategia;
          }
        }
        else{
          var ids = allSI[i].avaliacao.codClasse.split("#")
            var selecionadosTabelaFL = []
            for(var id in ids){
              selecionadosTabelaFL.push(JSON.parse(JSON.stringify(this.classesDaFonteL[id])))
            }
          allSI[i].avaliacao.selecionadosTabelaFL = selecionadosTabelaFL
          auxSistemasInfo.push(allSI[i]);
        }
      }
      auxSistemasInfo.forEach(element => {
        this.ppd.sistemasInfo.push(element)
        //var regex = /\d/g;
        var child = [];
        if(element.avaliacao.decomposicao.length > 0){
          var childAux =  element.avaliacao.decomposicao.split(new RegExp('[#]'))
          if(childAux.length > 0){
            childAux.forEach(dec => {
              let aux = dec.split(" ")
              let id = aux[0]
              let name = String(aux.slice(1))
              //Else se quiser meter o titulo
              child.push({"id": id, "name": name.replaceAll(","," ")})
            })
          }
        }
        child.sort((a,b) => (parseFloat(a.id) > parseFloat(b.id)) ? 1 : ((parseFloat(b.id) > parseFloat(a.id)) ? -1 : 0));
        this.ppd.arvore.push({"id": element.numeroSI, "name": element.nomeSI, children: child })
        this.ppd.arvore.sort((a,b) => (parseInt(a.id) >parseInt(b.id)) ? 1 : ((parseInt(b.id) > parseInt(a.id)) ? -1 : 0));

      });
    },
  },

  computed: {
    dialogState: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("fecharDialog", false);
      },
    },
  },
};
</script>

<style>
</style>