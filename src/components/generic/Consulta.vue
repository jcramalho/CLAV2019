<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
      <!-- HEADER -->
      <v-col class="py-0 my-0">
        <v-btn
          @click="goBack"
          rounded
          class="white--text mb-6"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown
          }"
          id="default-button"
        >
          <unicon
            name="arrow-back-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 37.261"
            fill="#ffffff"
          />
          <p class="ml-2">Voltar</p>
        </v-btn>

        <v-card flat style="border-radius: 10px !important;">
          <p
            v-if="tipo === 'Legislação'"
            class="content-title-2 pa-5"
            :class="{
              'mb-n5': $vuetify.breakpoint.smAndDown,
              'mb-n4': $vuetify.breakpoint.mdAndUp
            }"
            style="color: #4da0d0 !important; text-align: center;"
          >
            {{ titulo }}
            <InfoBox
              header="Tipo + Entidade + Número"
              :text="
                myhelp.Legislacao.Campos.Tipo +
                  ' + ' +
                  myhelp.Legislacao.Campos.Entidades +
                  ' + ' +
                  myhelp.Legislacao.Campos.Numero
              "
              helpColor="info"
            />
          </p>
          <p
            v-else
            class="content-title-2 pa-5"
            :class="{
              'mb-n5': $vuetify.breakpoint.smAndDown,
              'mb-n4': $vuetify.breakpoint.mdAndUp
            }"
            style="color: #4da0d0 !important; text-align: center;"
          >
            {{ titulo }}
          </p>
          <!-- CONTENT -->
          <v-card-text class="px-8">
            <v-row
              v-for="(item, index) in objeto"
              v-bind:key="index"
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2" v-if="item.text">
                <div class="info-label">
                  {{ item.campo }}
                  <InfoBox
                    v-if="tipo === 'Entidades'"
                    :header="item.campo"
                    :text="myhelp.Entidade.Campos[item.campo]"
                    helpColor="info"
                  />
                  <InfoBox
                    v-if="tipo === 'Tipologias'"
                    :header="item.campo"
                    :text="myhelp.Tipologias.Campos[item.campo]"
                    helpColor="info"
                  />
                  <InfoBox
                    v-if="tipo === 'Legislação'"
                    :header="item.campo"
                    :text="myhelp.Legislacao.Campos[item.campo]"
                    helpColor="info"
                  />
                </div>
              </v-col>

              <v-col cols="12" lg="10" v-if="item.text">
                <div v-if="item.campo === 'Link'" class="info-content pa-4">
                  <a :href="item.text" target="_blank">{{ item.text }}</a>
                </div>
                <div v-else>
                  <div
                    v-if="item.campo === 'Entidades'"
                    class="info-content pa-4"
                  >
                    <a
                      v-for="(ent, index) in item.text.split(' ')"
                      v-bind:key="index"
                      :href="'/entidades/ent_' + ent"
                      >{{ ent }}</a
                    >
                  </div>
                  <div v-else class="info-content pa-4">
                    <span
                      :class="{
                        'texto-verde': item.text === 'Ativa',
                        'texto-amarelo': item.text === 'Em revisão...',
                        'texto-vermelho': item.text === 'Inativa'
                      }"
                      >{{ item.text }}</span
                    >
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- Consulta de Entidade: tipologias a que pertence -->
            <v-row v-if="tipo == 'Entidades' && listaTip.length" class="mt-n4">
              <v-col cols="12" lg="2">
                <div class="info-label">
                  Tipologias de Entidade
                  <InfoBox
                    header="Tipologias de Entidade"
                    :text="myhelp.Entidade.Campos.Tipologias"
                    helpColor="info"
                  />
                </div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content py-4 px-2">
                  <ul style="margin-bottom: 0 !important;">
                    <li v-for="(l, index) in listaTip" v-bind:key="index">
                      <a :href="'/tipologias/' + l.id">{{ l.sigla }}</a>
                      -
                      {{ l.designacao }}
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>

            <!-- Consulta de Entidade: Natureza de intervenção nos PNs -->
            <v-row v-if="tipo === 'Entidades' && listaProcD.length">
              <v-col>
                <v-toolbar
                  color="#083581"
                  class="caption mt-8"
                  dark
                  height="45"
                  style="border-radius: 6px;"
                >
                  <v-toolbar-title
                    :class="{
                      'mx-auto': $vuetify.breakpoint.smAndDown,
                      'mx-0': $vuetify.breakpoint.mdAndUp
                    }"
                  >
                    Natureza de intervenção nos Processos de Negócio
                  </v-toolbar-title>
                </v-toolbar>
              </v-col>
            </v-row>
            <v-row
              v-if="listaProcD.length"
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">
                  Como Dono
                  <InfoBox
                    header="Intervenção nos PNs como Dono"
                    :text="myhelp.Entidade.Intervencoes.Dono"
                    helpColor="info"
                  />
                </div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content py-4 px-2">
                  <ul
                    style="margin-bottom: 0 !important;"
                    :class="{ 'is-collapsed': domainCollapsed }"
                  >
                    <li v-for="(l, index) in listaProcD" v-bind:key="index">
                      <a :href="'/classes/consultar/c' + l.codigo">{{
                        l.codigo
                      }}</a>
                      - {{ l.titulo }}
                    </li>
                  </ul>
                  <a
                    @click="domainCollapsed = !domainCollapsed"
                    v-if="listaProcD.length > 6"
                  >
                    <span
                      v-if="domainCollapsed"
                      style="color:#283593;"
                      class="pl-3"
                      >Mostrar mais...</span
                    >
                    <span v-else style="color:#283593;" class="pl-3"
                      >Mostrar menos...</span
                    >
                  </a>
                </div>
              </v-col>
            </v-row>

            <v-row
              v-if="parts"
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">
                  Como Participante
                  <InfoBox
                    header="Intervenção nos PNs como Participante"
                    :text="myhelp.Entidade.Intervencoes.Participante"
                    helpColor="info"
                  />
                </div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content pb-4 pt-n6 px-2">
                  <ul
                    v-for="(key, index) in Object.keys(listaProcP)"
                    v-bind:key="index"
                    style="margin-bottom: 0 !important;"
                    class="mt-6"
                  >
                    <li v-if="listaProcP[key].length > 0">
                      <b v-if="listaProcP[key].length > 0"
                        >{{ participationsDic[key] }}:</b
                      >
                      <ul
                        style="margin-bottom: 0 !important;"
                        :class="{ 'is-collapsed': partsCollapsed[key] }"
                      >
                        <li
                          v-for="(p, index) in listaProcP[key]"
                          v-bind:key="index"
                        >
                          <a :href="'/classes/consultar/c' + p.codigo">{{
                            p.codigo
                          }}</a>
                          - {{ p.titulo }}
                        </li>
                      </ul>
                      <a
                        @click="partsCollapsed[key] = !partsCollapsed[key]"
                        v-if="listaProcP[key].length > 6"
                      >
                        <span
                          v-if="partsCollapsed[key]"
                          style="color:#283593;"
                          class="pl-3"
                          >Mostrar mais...</span
                        >
                        <span v-else style="color:#283593;" class="pl-3"
                          >Mostrar menos...</span
                        >
                      </a>
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>

            <!-- Consulta de Tipologia: Natureza de intervenção nos PNs -->
            <v-row v-if="tipo === 'Tipologias' && listaProcD.length">
              <v-col>
                <v-toolbar
                  color="#083581"
                  class="caption mt-8"
                  dark
                  height="45"
                  style="border-radius: 6px;"
                >
                  <v-toolbar-title
                    :class="{
                      'mx-auto': $vuetify.breakpoint.smAndDown,
                      'mx-0': $vuetify.breakpoint.mdAndUp
                    }"
                  >
                    Natureza de intervenção nos Processos de Negócio
                  </v-toolbar-title>
                </v-toolbar>
              </v-col>
            </v-row>
            <v-row
              v-if="listaProcD.length"
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">
                  Como Dono
                  <InfoBox
                    header="Intervenção nos PNs como Dono"
                    :text="myhelp.Tipologias.Intervencoes.Dono"
                    helpColor="info"
                  />
                </div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content py-4 px-2">
                  <ul
                    style="margin-bottom: 0 !important;"
                    :class="{ 'is-collapsed': domainCollapsed }"
                  >
                    <li v-for="(l, index) in listaProcD" v-bind:key="index">
                      <a :href="'/classes/consultar/c' + l.codigo">{{
                        l.codigo
                      }}</a>
                      - {{ l.titulo }}
                    </li>
                  </ul>
                  <a
                    @click="domainCollapsed = !domainCollapsed"
                    v-if="listaProcD.length > 6"
                  >
                    <span
                      v-if="domainCollapsed"
                      style="color:#283593;"
                      class="pl-3"
                      >Mostrar mais...</span
                    >
                    <span v-else style="color:#283593;" class="pl-3"
                      >Mostrar menos...</span
                    >
                  </a>
                </div>
              </v-col>
            </v-row>

            <v-row v-if="parts">
              <v-col cols="12" lg="2">
                <div class="info-label">
                  Como Participante
                  <InfoBox
                    header="Intervenção nos PNs como Participante"
                    :text="myhelp.Tipologias.Intervencoes.Participante"
                    helpColor="info"
                  />
                </div>
              </v-col>

              <v-col cols="12" lg="10">
                <div class="info-content pb-4 pt-n6 px-2">
                  <ul
                    v-for="(key, index) in Object.keys(listaProcP)"
                    v-bind:key="index"
                    style="margin-bottom: 0 !important;"
                    class="mt-6"
                  >
                    <li v-if="listaProcP[key].length > 0">
                      <b v-if="listaProcP[key].length > 0"
                        >{{ participationsDic[key] }}:</b
                      >
                      <ul
                        style="margin-bottom: 0 !important;"
                        :class="{ 'is-collapsed': partsCollapsed[key] }"
                      >
                        <li
                          v-for="(p, index) in listaProcP[key]"
                          v-bind:key="index"
                        >
                          <a :href="'/classes/consultar/c' + p.codigo">{{
                            p.codigo
                          }}</a>
                          - {{ p.titulo }}
                        </li>
                      </ul>
                      <a
                        @click="partsCollapsed[key] = !partsCollapsed[key]"
                        v-if="listaProcP[key].length > 6"
                      >
                        <span
                          v-if="partsCollapsed[key]"
                          style="color:#283593;"
                          class="pl-3"
                          >Mostrar mais...</span
                        >
                        <span v-else style="color:#283593;" class="pl-3"
                          >Mostrar menos...</span
                        >
                      </a>
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>

            <!-- Consulta de Tipologia: entidades pertencentes à Tipologia -->
            <v-row v-if="tipo === 'Tipologias' && listaEnt.length">
              <v-col cols="12" lg="2">
                <div class="info-label">
                  Entidades
                  <InfoBox
                    header="Entidades"
                    :text="myhelp.Tipologias.Campos.Entidades"
                    helpColor="info"
                  />
                </div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content py-4 px-2">
                  <ul
                    style="margin-bottom: 0 !important;"
                    :class="{ 'is-collapsed': entCollapsed }"
                  >
                    <li v-for="(l, index) in listaEnt" v-bind:key="index">
                      <a :href="'/entidades/' + l.id">{{ l.sigla }}</a>
                      -
                      {{ l.designacao }}
                    </li>
                  </ul>
                  <a
                    @click="entCollapsed = !entCollapsed"
                    v-if="listaEnt.length > 6"
                  >
                    <span
                      v-if="entCollapsed"
                      style="color:#283593;"
                      class="pl-3"
                      >Mostrar mais...</span
                    >
                    <span v-else style="color:#283593;" class="pl-3"
                      >Mostrar menos...</span
                    >
                  </a>
                </div>
              </v-col>
            </v-row>

            <!-- Consulta de legislação: processos regulados -->
            <v-row v-if="tipo === 'Legislação' && listaReg.length">
              <v-col cols="12" lg="2">
                <div class="info-label">
                  Processos de negócio que regula ou enquadra
                  <InfoBox
                    header="Processos de negócio que regula ou enquadra"
                    :text="myhelp.Legislacao.Campos.ProcessosRegulados"
                    helpColor="info"
                  />
                </div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content py-4 px-2">
                  <ul style="margin-bottom: 0 !important;">
                    <li v-for="(l, index) in listaReg" v-bind:key="index">
                      <a :href="'/classes/consultar/' + l.id">{{ l.codigo }}</a>
                      - {{ l.titulo }}
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const help = require("@/config/help").help;
import InfoBox from "@/components/generic/infoBox.vue";

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
    "parts"
  ],
  components: {
    InfoBox
  },
  data: () => ({
    domainCollapsed: true,
    entCollapsed: true,
    partsCollapsed: {
      Apreciador: true,
      Assessor: true,
      Comunicador: true,
      Decisor: true,
      Executor: true,
      Iniciador: true
    },
    participationsDic: {
      Apreciador: "Apreciar",
      Assessor: "Assessorar",
      Comunicador: "Comunicar",
      Decisor: "Decidir",
      Executor: "Executar",
      Iniciador: "Iniciar"
    },
    myhelp: help
  }),
  methods: {
    goBack() {
      switch (this.tipo) {
        case "Entidades":
          this.$router.push("/entidades/consultar");
          break;
        case "Tipologias":
          this.$router.push("/tipologias/consultar");
          break;
        case "Legislação":
          this.$router.push("/legislacao/consultar");
          break;
        default:
          this.$router.push("/");
          break;
      }
    }
  }
};
</script>

<style scoped>
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
.texto-verde {
  color: #46c354 !important;
}
.texto-amarelo {
  color: #dfb83a !important;
}
.texto-vermelho {
  color: #f44336 !important;
}
</style>
