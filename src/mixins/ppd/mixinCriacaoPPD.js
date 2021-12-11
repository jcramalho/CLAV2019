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
      this.item2Show(item);
    },

    item2Show: function(item){
      //alert(JSON.stringify(item.avaliacao))
      this.siSpec = item;
      if(item.visto && typeof(item.identificacao.adminSistema) != 'string'){
        item.visto=false;
        this.siSpec.identificacao.adminSistema= item.identificacao.adminSistema.map(e => e.sigla).toString()
        this.siSpec.identificacao.adminDados= item.identificacao.adminDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propSistemaPublico= item.identificacao.propSistemaPublico.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propDados= item.identificacao.propDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.localDadosPublico= item.identificacao.localDadosPublico.map(e => e.sigla).toString(),
        this.siSpec.avaliacao.decomposicao= item.avaliacao.decomposicao.map(e=> e.numeroSI+"."+e.numeroSub + " " + e.nomeSub).toString().replaceAll(",","#")
        this.siSpec.avaliacao.codClasse= item.avaliacao.selecionadosTabelaFL.map(e=> e.codigo).toString().replaceAll(",","#")
        this.siSpec.avaliacao.numeroClasse= item.avaliacao.selecionadosTabelaFL.map(e=> e.referencia).toString().replaceAll(",","#")
        this.siSpec.avaliacao.tituloClasse= item.avaliacao.selecionadosTabelaFL.map(e=> e.titulo).toString().replaceAll(",","#")
        this.siSpec.avaliacao.pcaClasse= item.avaliacao.selecionadosTabelaFL.map(e=> e.pca).toString().replaceAll(",","#")
        this.siSpec.avaliacao.destinoFinalClasse= item.avaliacao.selecionadosTabelaFL.map(e=> e.df).toString().replaceAll(",","#")
        this.siSpec.avaliacao.formaContagemPrazos= item.avaliacao.selecionadosTabelaFL.map(e=> e.formaContagem).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionado= item.avaliacao.sistemasRelacionados.map(e=> e.numeroSI).toString().replaceAll(",","#")
        this.siSpec.avaliacao.siRelacionadoRelacao= item.avaliacao.sistemasRelacionados.map(e=> e.relacao).toString().replaceAll(",","#")
      }
    }
  },
};