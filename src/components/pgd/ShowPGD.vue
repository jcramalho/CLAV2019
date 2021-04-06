<template>
  <v-card class="ma-1 elevation-0">
    <v-card-text class="verticalLine">
      <v-row v-if="classe.descricao">
        <v-col cols="2">
          <div class="info-label">Descrição</div>
        </v-col>
        <v-col>
          <div class="info-content">{{classe.descricao}}</div>
        </v-col>
      </v-row>
      
      <v-row v-if="classe.diplomas">
        <v-col cols="2">
          <div class="info-label">Diplomas Jurídico-Administrativo</div>
        </v-col>
        <v-col>
          <div class="info-content"><div v-for="(d,index) in classe.diplomas.split('#')" :key="index">{{d}}</div></div>
        </v-col>
      </v-row>

      <v-row v-if="classe.pca">
        <v-col cols="2">
          <div class="info-label">PCA</div>
        </v-col>
        <v-col>
          <div class="info-content">{{classe.pca}}</div>
        </v-col>
        <v-col cols="2" v-if="classe.notaPCA">
          <div class="info-label">Nota do PCA</div>
        </v-col>
        <v-col v-if="classe.notaPCA">
          <div class="info-content">{{classe.notaPCA}}</div>
        </v-col>
      </v-row>
      
      <v-row v-if="classe.formaContagem">
        <v-col cols="2">
          <div class="info-label">Forma de Contagem</div>
        </v-col>
        <v-col>
          <div class="info-content">{{classe.formaContagem}}</div>
        </v-col>
        <v-col cols="2" v-if="classe.subFormaContagem">
          <div class="info-label">Subforma de Contagem</div>
        </v-col>
        <v-col v-if="classe.subFormaContagem">
          <div class="info-content">{{classe.subFormaContagem}}</div>
        </v-col>
      </v-row>
      
      <v-row v-if="classe.justificacaoPCA">
        <v-col cols="2">
          <div class="info-label">Justificação do PCA</div>
        </v-col>
        <v-col>
          <div class="info-content">{{classe.justificacaoPCA}}</div>
        </v-col>
      </v-row>

      <v-row v-if="classe.df">
        <v-col cols="2">
          <div class="info-label">Destino final</div>
        </v-col>
        <v-col>
          <div class="info-content">
            <span v-if="classe.df=='E'">Eliminação</span>
            <span v-else-if="classe.df=='C'">Conservação</span>
            <span v-else-if="classe.df=='CPP'">Conservação Parcial</span>
            <span v-else>{{classe.df}}</span>
          </div>
        </v-col>
        <v-col cols="2" v-if="classe.notaDF">
          <div class="info-label">Nota do Destino final</div>
        </v-col>
        <v-col v-if="classe.notaDF">
          <div class="info-content">{{classe.notaDF}}</div>
        </v-col>
      </v-row>
      
      <v-row v-if="classe.justificacaoDF">
        <v-col cols="2">
          <div class="info-label">Justificação do DF</div>
        </v-col>
        <v-col>
          <div class="info-content">{{classe.justificacaoDF}}</div>
        </v-col>
      </v-row>
      
      <v-row v-if="classe.designacaoDono">
        <v-col cols="2">
          <div class="info-label">Dono</div>
        </v-col>
        <v-col>
          <div class="info-content">{{classe.designacaoDono}}</div>
        </v-col>
        <v-col cols="2">
          <div class="info-label">Participante</div>
        </v-col>
        <v-col>
          <div class="info-content">{{classe.designacaoParticipante}}</div>
        </v-col>
      </v-row>
        <v-list v-if="classe.filhos.length>0">
          <v-list-group
            v-for="(filho, i) in classe.filhos"
            :key="i"
            multiple
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="filho.codigo && filho.referencia">{{filho.codigo}} <span classe="ml-2">{{filho.referencia}}</span> <span class="ml-5">{{filho.titulo}}</span></span>
                  <span v-else-if="filho.codigo">{{filho.codigo}} <span class="ml-7">{{filho.titulo}}</span></span>
                  <span v-else-if="filho.referencia"><span class="ml-2">{{filho.referencia}} <span class="ml-5">{{filho.titulo}}</span></span></span>
                  <span v-else class="ml-9">{{filho.titulo}}</span>
                </v-list-item-title>
              </v-list-item-content>
            </template>
            
            <ShowPGD :classe="filho"/>
          </v-list-group>
        </v-list>

    </v-card-text>  
  </v-card> 
</template>
<script>
export default {
  props: ["classe"],

  components: {
    ShowPGD: () => import("./ShowPGD.vue")
  },
  created: function() {
    this.name = this.classe.classe
  }
}
</script>
<style>
.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.info-content {
  padding: 8px;
  width: 100%;
}

.verticalLine {
  border-left: 3px solid #e8eaf6;
  height: 95%;
  margin-left: 1%;
}
</style>