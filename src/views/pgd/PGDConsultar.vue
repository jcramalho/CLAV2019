<template>
  <div>
    <Loading
      v-if="classes.length == 0 && classesTree.length == 0"
      :message="message"
    />
    <ConsultarPGD
      v-else
      :classes="classes"
      :classesTree="classesTree"
      :titulo="titulo"
      :objeto="legislacao"
    />
  </div>
</template>
<script>
import ConsultarPGD from "@/components/pgd/ConsultarPGD.vue";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    ConsultarPGD,
    Loading
  },
  data: () => ({
    classes: [],
    classesTree: [],
    legislacao: null,
    message: "Portaria de Gestão Documental",
    titulo: "",
    idLegislacao: "",
    id: ""
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
    procuraClasse: function(classe, myClasses, classePai) {
      var index = myClasses.map(cl => cl.classe).indexOf(classePai);
      if (index >= 0) myClasses[index].filhos.push(classe);
      else
        for (var c of myClasses) {
          c.filhos = this.procuraClasse(classe, c.filhos, classePai);
        }
      return myClasses;
    },
    prepararClasses: async function(classes) {
      var myClasses = [];
      for (var c of classes) {
        c.filhos = [];

        if (c.nivel == 1) {
          myClasses.push(c);
        } else {
          myClasses = this.procuraClasse(c, myClasses, c.classePai);
        }
      }
      return myClasses;
    }
  },
  created: async function() {
    try {
      this.id = window.location.pathname.split("/")[2];
      if (this.id.split("_")[0] == "tsRada") {
        this.idLegislacao = this.id.split("tsRada_")[1];
        this.idLegislacao = this.idLegislacao.split("_tip")[0];
        this.idLegislacao = this.idLegislacao.split("_ent")[0];
        this.message = "Relatório de Avaliação de Documentação Acumulada";
        var response = await this.$request("get", "/pgd/rada/" + this.id);
        this.classesTree = await this.prepararClasses(response.data);
        this.classes = response.data.map(c => {
          return {
            idClasse: c.classe,
            codigo: c.codigo,
            referencia: c.referencia,
            titulo: c.titulo,
            descricao: c.descricao,
            diplomas: c.diplomas,
            df:
              c.df == "E"
                ? "Eliminação"
                : c.df == "C"
                ? "Conservação"
                : c.df == "C"
                ? "Conservação Parcial"
                : c.df,
            notaDF: c.notaDF,
            justificacaoDF: c.justificacaoDF,
            pca: c.pca,
            notaPCA: c.notaPCA,
            formaContagem: c.formaContagem,
            justificacaoPCA: c.justificacaoPCA
          };
        });

        var response2 = await this.$request(
          "get",
          "/legislacao/" + this.idLegislacao
        );
        this.legislacao = await this.preparaLegislacao(response2.data);
        this.titulo = `Tabela de Seleção de ${response2.data.tipo} ${response2.data.numero}`;
      } else {
        this.idLegislacao = this.id.split("pgd_")[1];
        if (this.idLegislacao.includes("lc_"))
          this.idLegislacao = this.idLegislacao.split("lc_")[1];

        var response = await this.$request("get", "/pgd/" + this.id);
        this.classesTree = await this.prepararClasses(response.data);
        this.classes = response.data.map(c => {
          return {
            idClasse: c.classe,
            codigo: c.codigo,
            referencia: c.referencia,
            titulo: c.titulo,
            descricao: c.descricao,
            df:
              c.df == "E"
                ? "Eliminação"
                : c.df == "C"
                ? "Conservação"
                : c.df == "C"
                ? "Conservação Parcial"
                : c.df,
            notaDF: c.notaDF,
            pca: c.pca,
            notaPCA: c.notaPCA,
            formaContagem: c.formaContagem,
            subFormaContagem: c.subFormaContagem,
            designacaoParticipante: c.designacaoParticipante,
            designacaoDono: c.designacaoDono
          };
        });

        var response2 = await this.$request(
          "get",
          "/legislacao/" + this.idLegislacao
        );
        this.legislacao = await this.preparaLegislacao(response2.data);
        this.titulo = `Tabela de Seleção da ${response2.data.tipo} ${response2.data.numero}`;
      }
    } catch (e) {
      this.classes = [];
      this.legislacao = null;
    }
  }
};
</script>
