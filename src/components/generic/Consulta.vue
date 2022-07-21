<template>
  <v-card class="ma-4" flat>
    <v-card-title v-if="tipo === 'Legislação'" class="indigo darken-4 white--text">
      {{ titulo }}
      <InfoBox header="Tipo + Entidade + Número" :text="
        myhelp.Legislacao.Campos.Tipo +
        ' + ' +
        myhelp.Legislacao.Campos.Entidades +
        ' + ' +
        myhelp.Legislacao.Campos.Numero
      " />
    </v-card-title>

    <v-card-text>
      <CampoCLAV v-for="(item, index) in objeto" :key="index" color="neutralpurple" :nome="item.campo"
        :infoHeader="item.campo"
        :infoBody="tipo === 'Entidades' ? myhelp.Entidade.Campos[item.campo] : (tipo === 'Tipologias' ? myhelp.Tipologias.Campos[item.campo] : myhelp.Legislacao.Campos[item.campo])">
        <template v-slot:conteudo>
          <v-row v-if="item.text">
            <v-col v-if="item.campo === 'Link'" align="left">
              <a :href="item.text" target="_blank">{{ item.text }}</a>
            </v-col>
            <v-col v-else>
              <div v-if="item.campo === 'Entidades'" align="left">
                <a v-for="(ent, index) in item.text.split(' ')" :key="index" :href="'/entidades/ent_' + ent">
                  {{ ent }}
                </a>
              </div>
              <div v-else>{{ item.text }}</div>
            </v-col>
          </v-row>
        </template>
      </CampoCLAV>

      <!-- Consulta de Entidade: tipologias a que pertence -->
      <CampoCLAV v-if="tipo == 'Entidades' && listaTip.length" color="neutralpurple" nome="Tipologias de Entidade"
        infoHeader="Tipologias de Entidade" :infoBody="myhelp.Entidade.Campos.Tipologias" class="mb-3">
        <template v-slot:conteudo>
          <v-row>
            <v-col align="left">
              <ul>
                <li v-for="(l, index) in listaTip" :key="index">
                  <a :href="'/tipologias/' + l.id">{{ l.sigla }}</a>
                  -
                  {{ l.designacao }}
                </li>
              </ul>
            </v-col>
          </v-row>
        </template>
      </CampoCLAV>

      <!-- Consulta de Entidade: Natureza de intervenção nos PNs -->
      <v-expansion-panels v-model="panel">
        <PainelCLAV v-if="tipo === 'Entidades' && (listaProcD.length || parts)"
          titulo="Natureza de intervenção nos Processos de Negócio" infoHeader="Descritivo da Classe"
          icon="mdi-clipboard-file-outline">
          <template v-slot:conteudo>

            <CampoCLAV v-if="listaProcD.length" color="neutralpurple" nome="Como Dono" infoHeader="Como Dono"
              :infoBody="myhelp.Entidade.Intervencoes.Dono" class="mb-3">
              <template v-slot:conteudo>
                <v-row>
                  <v-col align="left">
                    <ul :class="{ 'is-collapsed': domainCollapsed }">
                      <li v-for="(l, index) in listaProcD" v-bind:key="index">
                        <a :href="'/classes/consultar/c' + l.codigo">{{
                            l.codigo
                        }}</a>
                        - {{ l.titulo }}
                      </li>
                    </ul>
                    <a @click="domainCollapsed = !domainCollapsed" v-if="listaProcD.length > 6">
                      <span v-if="domainCollapsed" style="color:#283593;">Mostrar mais...</span>
                      <span v-else style="color:#283593;">Mostrar menos...</span>
                    </a>
                  </v-col>
                </v-row>
              </template>
            </CampoCLAV>

            <CampoCLAV v-if="parts" color="neutralpurple" nome="Como Participante" infoHeader="Como Participante"
              :infoBody="myhelp.Entidade.Intervencoes.Participante" class="mb-3">
              <template v-slot:conteudo>
                <v-row>
                  <v-col align="left">
                    <ul v-for="(key, index) in Object.keys(listaProcP)" v-bind:key="index" style="padding-left:5px;">
                      <li v-if="listaProcP[key].length > 0">
                        <b v-if="listaProcP[key].length > 0">{{ participationsDic[key] }}:</b>
                        <ul :class="{ 'is-collapsed': partsCollapsed[key] }">
                          <li v-for="(p, index) in listaProcP[key]" v-bind:key="index">
                            <a :href="'/classes/consultar/c' + p.codigo">{{
                                p.codigo
                            }}</a>
                            - {{ p.titulo }}
                          </li>
                        </ul>
                        <a @click="partsCollapsed[key] = !partsCollapsed[key]" v-if="listaProcP[key].length > 6">
                          <span v-if="partsCollapsed[key]" style="color:#283593;">Mostrar mais...</span>
                          <span v-else style="color:#283593;">Mostrar menos...</span>
                        </a>
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </template>
            </CampoCLAV>
          </template>
        </PainelCLAV>
      </v-expansion-panels>

      <!-- Consulta de Tipologia: entidades pertencentes à Tipologia -->
      <CampoCLAV v-if="tipo === 'Tipologias' && listaEnt.length" color="neutralpurple" nome="Entidades"
        infoHeader="Entidades" :infoBody="myhelp.Tipologias.Campos.Entidades" class="mb-3">
        <template v-slot:conteudo>
          <v-row>
            <v-col align="left">
              <ul :class="{ 'is-collapsed': entCollapsed }">
                <li v-for="(l, index) in listaEnt" v-bind:key="index">
                  <a :href="'/entidades/' + l.id">{{ l.sigla }}</a>
                  -
                  {{ l.designacao }}
                </li>
              </ul>
              <a @click="entCollapsed = !entCollapsed" v-if="listaEnt.length > 6">
                <span v-if="entCollapsed" style="color:#283593;">Mostrar mais...</span>
                <span v-else style="color:#283593;">Mostrar menos...</span>
              </a>
            </v-col>
          </v-row>
        </template>
      </CampoCLAV>

      <!-- Consulta de legislação: processos regulados -->
      <CampoCLAV v-if="tipo === 'Legislação' && listaReg.length" color="neutralpurple"
        nome="Processos de negócio que regula ou enquadra" infoHeader="Processos de negócio que regula ou enquadra"
        :infoBody="myhelp.Legislacao.Campos.ProcessosRegulados" class="mb-3">
        <template v-slot:conteudo>
          <v-row>
            <v-col align="left">
              <ul>
                <li v-for="(l, index) in listaReg" v-bind:key="index">
                  <a :href="'/classes/consultar/' + l.id">{{ l.codigo }}</a>
                  - {{ l.titulo }}
                </li>
              </ul>
            </v-col>
          </v-row>
        </template>
      </CampoCLAV>

      <!-- Consulta de Tipologia: Natureza de intervenção nos PNs -->
      <v-expansion-panels v-model="panel">
        <PainelCLAV v-if="tipo === 'Tipologias' && listaProcD.length"
          titulo="Natureza de intervenção nos Processos de Negócio" infoHeader="Descritivo da Classe"
          icon="mdi-clipboard-file-outline">
          <template v-slot:conteudo>
            <CampoCLAV v-if="listaProcD.length" color="neutralpurple" nome="Como Dono" infoHeader="Como Dono"
              :infoBody="myhelp.Tipologias.Intervencoes.Dono" class="mt-3">
              <template v-slot:conteudo>
                <v-row>
                  <v-col align="left">
                    <ul :class="{ 'is-collapsed': domainCollapsed }">
                      <li v-for="(l, index) in listaProcD" v-bind:key="index">
                        <a :href="'/classes/consultar/c' + l.codigo">{{
                            l.codigo
                        }}</a>
                        - {{ l.titulo }}
                      </li>
                    </ul>
                    <a @click="domainCollapsed = !domainCollapsed" v-if="listaProcD.length > 6">
                      <span v-if="domainCollapsed" style="color:#283593;">Mostrar mais...</span>
                      <span v-else style="color:#283593;">Mostrar menos...</span>
                    </a>
                  </v-col>
                </v-row>
              </template>
            </CampoCLAV>

            <CampoCLAV v-if="parts" color="neutralpurple" nome="Como Participante" infoHeader="Como Participante"
              :infoBody="myhelp.Tipologias.Intervencoes.Participante" class="mt-3">
              <template v-slot:conteudo>
                <v-row>
                  <v-col align="left">
                    <ul v-for="(key, index) in Object.keys(listaProcP)" v-bind:key="index">
                      <li v-if="listaProcP[key].length > 0">
                        <b v-if="listaProcP[key].length > 0">{{ participationsDic[key] }}:</b>
                        <ul :class="{ 'is-collapsed': partsCollapsed[key] }">
                          <li v-for="(p, index) in listaProcP[key]" v-bind:key="index">
                            <a :href="'/classes/consultar/c' + p.codigo">{{
                                p.codigo
                            }}</a>
                            - {{ p.titulo }}
                          </li>
                        </ul>
                        <a @click="partsCollapsed[key] = !partsCollapsed[key]" v-if="listaProcP[key].length > 6">
                          <span v-if="partsCollapsed[key]" style="color:#283593;">Mostrar mais...</span>
                          <span v-else style="color:#283593;">Mostrar menos...</span>
                        </a>
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </template>
            </CampoCLAV>
          </template>
        </PainelCLAV>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
const help = require("@/config/help").help;
import InfoBox from "@/components/generic/infoBox.vue";
import CampoCLAV from "@/components/generic/CampoCLAV.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";

export default {
  props: [
    "tipo",
    "objeto",
    "titulo",
    "listaTip",
    "listaProcD",
    "listaProcP",
    "listaEnt",
    "listaReg",
    "parts",
  ],
  components: {
    InfoBox,
    CampoCLAV,
    PainelCLAV,
  },
  data: () => ({
    domainCollapsed: true,
    entCollapsed: true,
    panel: true,
    partsCollapsed: {
      Apreciador: true,
      Assessor: true,
      Comunicador: true,
      Decisor: true,
      Executor: true,
      Iniciador: true,
    },
    participationsDic: {
      Apreciador: "Apreciar",
      Assessor: "Assessorar",
      Comunicador: "Comunicar",
      Decisor: "Decidir",
      Executor: "Executar",
      Iniciador: "Iniciar",
    },
    myhelp: help,
  }),

  methods: {
    voltar() {
      switch (this.tipo) {
        case "Tipologias":
          this.$router.push("/tipologias/consultar");
          break;

        case "Entidades":
          this.$router.push("/entidades/consultar");
          break;

        case "Legislação":
          this.$router.push("/legislacao/consultar");
          break;

        default:
          this.$router.go(-1);
          break;
      }
    },
  },
};
</script>

<style>
</style>
