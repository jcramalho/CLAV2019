<template>
  <div>
    <RessubmissaoEntidade v-if="objLoaded && tipoEntidade" :e="objeto" />
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
    objeto: {},
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
    buildObject(obj, newPendente) {
      switch (obj.tipo) {
        case "TS Organizacional":
          newPendente.objeto = obj.dados.ts;
          break;
        case "RADA":
          newPendente.objeto = { rada: obj.dados };
          break;
        default:
          newPendente.objeto = obj.dados;
      }
      return newPendente;
    },
    buildPendente(data) {
      var newPendente = {
        numInterv: 1,
        acao: data.objeto.acao,
        tipo: data.objeto.tipo,
        criadoPor: data.criadoPor,
        entidade: data.entidade,
        dataCriacao: data.data,
        dataAtualizacao: new Date(),
      };
      return this.buildObject(data.objeto, newPendente);
    },
  },
  created: function () {
    if (this.$route.params.idPendente.includes("-")) {
      this.$request("get", `/pedidos/${this.$route.params.idPendente}`)
        .then((data) => {
          console.log(data.data);
          this.objeto = data.data;
          this.setTipo(this.objeto.objeto.tipo);

          this.objLoaded = true;
        })
        .catch((err) => console.log(err));
    } else {
      this.$request("get", "/pendentes/" + this.$route.params.idPendente)
        .then((response) => {
          this.objeto = response.data;
          this.setTipo(this.objeto.tipo);

          this.objLoaded = true;
        })
        .catch((error) => {
          return error;
        });
    }
  },
};
</script>
