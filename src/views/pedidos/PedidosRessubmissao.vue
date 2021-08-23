<template>
  <div>
    <RessubmissaoEntidade v-if="objLoaded && tipoEntidade" :e="pedido" />
    <v-alert v-else type="warning">
      Por algum motivo não foi possível carregar o trabalho pretendido. Contacte o
      administrador.
    </v-alert>
  </div>
</template>

<script>
import RessubmissaoEntidade from "@/components/entidades/RessubmissaoEntidade";

export default {
  components: {
    RessubmissaoEntidade,
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
          this.tipoTSOrg = true;
          break;
        case "TS Pluriorganizacional":
          this.tipoTSPluri = true;
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
