export default {
  data: () => ({
    e1: 1,
  }),
  methods: {
    changeE1(e) {
      this.e1 = e;
    },
    showSI: function(item){
      this.verSI = true;
      //this.siSpec = item;
      this.item2Show(item);
    },

    item2Show: function(item){
      this.siSpec = item;
      if(item.visto){
        this.siSpec.identificacao.adminSistema= item.identificacao.adminSistema.map(e => e.sigla).toString()
        this.siSpec.identificacao.adminDados= item.identificacao.adminDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propSistemaPublico= item.identificacao.propSistemaPublico.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propDados= item.identificacao.propDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.localDadosPublico= item.identificacao.localDadosPublico.map(e => e.sigla).toString(),
        this.siSpec.avaliacao.decomposicao= item.avaliacao.tabelaDecomposicao.map(e=> e.numeroSI+"."+e.numeroSub + " " + e.nomeSub).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionado= item.avaliacao.sistemasRelacionados.map(e=> e.numeroSI).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionadoRelacao= item.avaliacao.sistemasRelacionados.map(e=> e.relacao).toString().replaceAll(",","#")
        item.visto=false;
      }
    }
  },
};