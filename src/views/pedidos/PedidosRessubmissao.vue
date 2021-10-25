<template>
  <div>
    <RessubmissaoClasse v-if="objLoaded && tipoClasse" :c="pedido" />
    <RessubmissaoTS v-if="objLoaded && tipoTS" :ts="pedido" />
    <RessubmissaoEntidade v-if="objLoaded && tipoEntidade" :e="pedido" />
    <RessubmissaoTipologia v-if="objLoaded && tipoTipologia" :t="pedido" />
    <RessubmissaoLegislacao v-if="objLoaded && tipoLegislacao" :l="pedido" />
  </div>
</template>

<script>
import RessubmissaoClasse from "@/components/classes/ressubmissao/RessubmissaoClasse";
import RessubmissaoEntidade from "@/components/entidades/RessubmissaoEntidade";
import RessubmissaoTipologia from "@/components/tipologias/RessubmissaoTipologia";
import RessubmissaoLegislacao from "@/components/legislacao/RessubmissaoLegislacao";
import RessubmissaoTS from "@/components/tabSel/RessubmissaoTS";

export default {
  components: {
    RessubmissaoTS,
    RessubmissaoClasse,
    RessubmissaoEntidade,
    RessubmissaoTipologia,
    RessubmissaoLegislacao,
  },

  data: () => ({
    pedido: {},
    objLoaded: false,
    tipoClasse: false,
    tipoTSOrg: false,
    tipoTSPluri: false,
    tipoAE: false,
    tipoRADA: false,
    tipoPPD: false,
    tipoEntidade: false,
    tipoTipologia: false,
    tipoLegislacao: false,
  }),

  methods: {
    setTipo(tipo) {
      switch (tipo) {
        case "Classe":
        case "Classe_N3":
        case "Classe_N2":
        case "Classe_N1":
          this.tipoClasse = true;
          break;
        case "TS Organizacional":
        case "TS Pluriorganizacional":
          this.tipoTS = true;
          break;
        case "Auto de Eliminação":
          this.tipoAE = true;
          break;
        case "RADA":
          this.tipoRADA = true;
          break;
        case "PGD":
          this.tipoPGD = true;
          break;
        case "PPD":
          this.tipoPPD = true;
          break;
        case "Entidade":
          this.tipoEntidade = true;
          break;
        case "Tipologia":
          this.tipoTipologia = true;
          break;
        case "Legislação":
          this.tipoLegislacao = true;
          break;
        default:
          "";
      }
    },
  },
  created: function () {
    this.$request("get", `/pedidos/${this.$route.params.idPendente}`)
      .then((data) => {
        this.pedido = data.data;
        this.setTipo(this.pedido.objeto.tipo);

        this.objLoaded = true;
      })
      .catch((err) => console.log(err));
  },
};
</script>
