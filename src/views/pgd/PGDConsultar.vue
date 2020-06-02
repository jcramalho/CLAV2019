<template>
  <div>
    <ConsultarPGD 
      :classes="classes"
      :titulo="titulo"
      :objeto="legislacao"
    />
  </div>
</template>
<script>
import ConsultarPGD from "@/components/pgd/ConsultarPGD.vue"

export default {
  components: {
    ConsultarPGD
  },
  data: () => ({
    classes: [],
    legislacao: null,
    titulo: "",
    idLegislacao: "",
    idPGD: ""
  }),
  methods: {
    parseEntidades: async function(ent) {
      try {
        var entidades = "";
        for (var i = 0; i < ent.length; i++) {
          entidades = entidades + ent[i] + " ";
        }
        return entidades;
      } catch (e) {
        return {};
      }
    },
    preparaLegislacao: async function(leg) {
      try {
        var myLegislacao = {
          data: {
            campo: "Data do diploma",
            text: leg.data
          },
          sumario: {
            campo: "Sumário",
            text: leg.sumario
          },
          fonte: {
            campo: "Fonte de legitimação",
            text: leg.fonte
          },
          link: {
            campo: "Link",
            text: leg.link
          },
          entidades: {
            campo: "Entidades",
            text: await this.parseEntidades(leg.entidades)
          }
        };
        return myLegislacao;
      } catch (e) {
        return {};
      }
    },
    procuraClasse: function (classe, myClasses, classePai) {
      var index = myClasses.map(cl => cl.classe).indexOf(classePai)
      if(index>=0) myClasses[index].filhos.push(classe)
      else 
        for(var c of myClasses) {
          c.filhos = this.procuraClasse(classe,c.filhos,classePai)
        }
      return myClasses
    },
    prepararClasses: async function(classes) {
      var myClasses = [];
      for(var c of classes) {
        c.filhos = []
        
        if(c.nivel == 1) {
          myClasses.push(c)
        }
        else {
          myClasses = this.procuraClasse(c,myClasses,c.classePai)
        }
      }
      return myClasses;
    }
  },
  created: async function () {
    try {
      this.idPGD = window.location.pathname.split("/")[2];
      this.idLegislacao = this.idPGD.split("pgd_")[1];
      if(this.idLegislacao.includes("lc_")) this.idLegislacao = this.idLegislacao.split("lc_")[1]
      
      var response = await this.$request("get","/pgd/"+this.idPGD)
      this.classes = await this.prepararClasses(response.data)

      var response2 = await this.$request(
        "get",
        "/legislacao/" + this.idLegislacao
      );
      this.legislacao = await this.preparaLegislacao(response2.data);
      this.titulo = `Tabela de Seleção da ${response2.data.tipo} ${response2.data.numero}`;

    } 
    catch (e) {
      this.classes = []
      this.legislacao = null
    }
  }
}
</script>
