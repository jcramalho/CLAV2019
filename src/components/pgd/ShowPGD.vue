<template>
  <v-card class="ma-1 elevation-0">
    <v-card-text class="verticalLine">
      <!-- DESCRIÇÂO -->
      <Campo
        v-if="classe.descricao"
        color="neutralpurple"
        nome="Descrição"
        infoHeader="Descrição"
        :infoBody="myhelp.Classe.Campos.Descricao"
      >
        <template v-slot:conteudo>
          {{ classe.descricao }}
        </template>
      </Campo>

      <!-- DIPLOMAS -->
      <Campo
        v-if="classe.diplomas"
        color="neutralpurple"
        nome="Diplomas Jurídico-Administrativo"
        infoHeader="Diplomas Jurídico-Administrativo"
        :infoBody="myhelp.Classe.Campos.Descricao"
      >
        <template v-slot:conteudo>
          <div v-for="(d, index) in classe.diplomas.split('#')" :key="index">
            {{ d }}
          </div>
        </template>
      </Campo>

      <!-- DONOS -->
      <Campo
        v-if="classe.donos && classe.donos.length > 0"
        color="neutralpurple"
        nome="Donos"
        infoHeader="Donos"
        :infoBody="myhelp.Classe.Campos.Donos"
      >
        <template v-slot:conteudo>
          <ol>
            <li v-for="(ent, i) in classe.donos" :key="i">
              <a
                :href="
                  ent.entDono.includes('ent_')
                    ? '/entidades/' + ent.entDono
                    : '/tipologias/' + ent.entDono
                "
                >{{
                  ent.entDono.includes("ent_")
                    ? ent.entDono.split("ent_")[1]
                    : ent.entDono.split("tip_")[1]
                }}</a
              >
            </li>
          </ol>
        </template>
      </Campo>

      <!-- PARTICIPANTES -->
      <Campo
        v-if="classe.participantes && classe.participantes.length > 0"
        color="neutralpurple"
        nome="Participantes"
        infoHeader="Participantes"
        :infoBody="myhelp.Classe.Campos.Participantes"
      >
        <template v-slot:conteudo>
          <ol>
            <li v-for="(ent, i) in classe.participantes" :key="i">
              <a
                :href="
                  ent.entParticipante.includes('ent_')
                    ? '/entidades/' + ent.entParticipante
                    : '/tipologias/' + ent.entParticipante
                "
                >{{
                  ent.entParticipante.includes("ent_")
                    ? ent.entParticipante.split("ent_")[1]
                    : ent.entParticipante.split("tip_")[1]
                }}</a
              >
            </li>
          </ol>
        </template>
      </Campo>

      <v-toolbar
        v-if="classe.pca"
        class="clav-linear-background white--text my-4"
        rounded
        width="100%"
        height="30%"
      >
        <v-toolbar-title>Prazo de Conservação Administrativa</v-toolbar-title>
      </v-toolbar>

      <!-- PRAZO -->
      <Campo
        v-if="classe.pca"
        color="neutralpurple"
        nome="Prazo"
        infoHeader="Prazo de Conservação Administrativa"
        :infoBody="myhelp.Classe.Campos.Prazo"
      >
        <template v-slot:conteudo>
          {{
            classe.pca > 1
              ? classe.pca + " Anos"
              : classe.pca === ""
              ? "Não Específicado"
              : classe.pca + " Ano"
          }}
        </template>
      </Campo>

      <!-- NOTAS -->
      <Campo
        v-if="classe.notaPCA && classe.notaPCA != ''"
        color="neutralpurple"
        nome="Nota"
        infoHeader="Nota"
        :infoBody="myhelp.Classe.Campos.Notas"
      >
        <template v-slot:conteudo>
          {{ classe.notaPCA }}
        </template>
      </Campo>

      <!-- FORMA DE CONTAGEM -->
      <Campo
        v-if="classe.formaContagem && classe.formaContagem != ''"
        color="neutralpurple"
        nome="Forma de Contagem"
        infoHeader="Forma de Contagem"
        :infoBody="myhelp.Classe.Campos.FormaContagem"
      >
        <template v-slot:conteudo>
          {{ classe.formaContagem }}
        </template>
      </Campo>

      <!-- SUBFORMA DE CONTAGEM -->
      <Campo
        v-if="classe.subFormaContagem && classe.subFormaContagem != ''"
        color="neutralpurple"
        nome="Subforma de Contagem"
        infoHeader="Subforma de Contagem"
        :infoBody="myhelp.Classe.Campos.SubformaContagem"
      >
        <template v-slot:conteudo>
          {{ classe.subFormaContagem }}
        </template>
      </Campo>

      <!-- JUSTIFICAÇÂO -->
      <Campo
        v-if="classe.justificacaoPCA && classe.justificacaoPCA != ''"
        color="neutralpurple"
        nome="Justificação"
        infoHeader="Justificação"
        :infoBody="myhelp.Classe.Campos.JustificacaoPCA"
      >
        <template v-slot:conteudo>
          {{ classe.justificacaoPCA }}
        </template>
      </Campo>

      <v-toolbar
        v-if="classe.df"
        class="clav-linear-background white--text my-4"
        rounded
        width="100%"
        height="30%"
      >
        <v-toolbar-title>Destino Final</v-toolbar-title>
      </v-toolbar>

      <!-- VALOR -->
      <Campo
        v-if="classe.df"
        color="neutralpurple"
        nome="Destino Final"
        infoHeader="Destino Final"
        :infoBody="myhelp.Classe.Campos.DF"
      >
        <template v-slot:conteudo>
          {{
            classe.df === "E"
              ? "Eliminação"
              : classe.df === "C"
              ? "Conservação"
              : classe.df === "CP"
              ? "Conservação Parcial"
              : classe.df
          }}
        </template>
      </Campo>

      <!-- NOTA ao DF -->
      <Campo
        v-if="classe.notaDF && classe.notaDF != ''"
        color="neutralpurple"
        nome="Nota"
        infoHeader="Nota"
        :infoBody="myhelp.Classe.Campos.NotasDF"
      >
        <template v-slot:conteudo>
          {{ classe.notaDF }}
        </template>
      </Campo>

      <!-- JUSTIFICAÇÃO do DF -->
      <Campo
        v-if="classe.justificacaoDF && classe.justificacaoDF != ''"
        color="neutralpurple"
        nome="Justificação"
        infoHeader="Justificação"
        :infoBody="myhelp.Classe.Campos.JustificacaoDF"
      >
        <template v-slot:conteudo>
          {{ classe.justificacaoDF }}
        </template>
      </Campo>

      <v-row v-if="classe.designacaoDono">
        <v-col cols="2">
          <div class="info-label">Dono</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ classe.designacaoDono }}</div>
        </v-col>
        <v-col cols="2">
          <div class="info-label">Participante</div>
        </v-col>
        <v-col>
          <div class="info-content">{{ classe.designacaoParticipante }}</div>
        </v-col>
      </v-row>
      <v-list v-if="classe.filhos.length > 0">
        <v-list-group v-for="(filho, i) in classe.filhos" :key="i" multiple>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                <span v-if="filho.codigo && filho.referencia"
                  >{{ filho.codigo }}
                  <span classe="ml-2">{{ filho.referencia }}</span>
                  <span class="ml-5">{{ filho.titulo }}</span></span
                >
                <span v-else-if="filho.codigo"
                  >{{ filho.codigo }}
                  <span class="ml-7">{{ filho.titulo }}</span></span
                >
                <span v-else-if="filho.referencia"
                  ><span class="ml-2"
                    >{{ filho.referencia }}
                    <span class="ml-5">{{ filho.titulo }}</span></span
                  ></span
                >
                <span v-else class="ml-9">{{ filho.titulo }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </template>

          <ShowPGD :classe="filho" />
        </v-list-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import Campo from "@/components/generic/Campo.vue";
import ShowPGD from "./ShowPGD.vue";

export default {
  name: "ShowPGD",
  props: ["classe"],

  components: {
    ShowPGD,
    Campo,
  },
  data: () => ({
    myhelp: require("@/config/help").help,
  }),
  created: function () {
    this.name = this.classe.classe;
  },
};
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
