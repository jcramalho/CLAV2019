<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex md3 sm6 xs12 v-for="(stat, index) in stats" v-bind:key="index">
        <v-card :class="stat.bgColor" dark>
          <v-container fluid grid-list-sm dark>
            <v-layout class="mt-0 mb-0 pa-0" row>
              <v-flex d-flex xs3 md3 lg3>
                <v-icon class="mx-0" x-large dark>{{ stat.icon }}</v-icon>
              </v-flex>
              <v-flex d-flex xs9 md9 lg9 align-self-center="">
                <div class="silver--text caption">{{ stat.title }}</div>
              </v-flex>
            </v-layout>
            <v-layout class="mt-0 mb-0 pa-0" row align-center>
              <v-flex d-flex xs6 md6 lg6>
                <div class="silver--text display-1">{{ stat.data }}</div>
              </v-flex>
              <v-flex d-flex xs6 md6 lg6>
                <v-btn
                  v-if="stat.action"
                  text
                  outlined
                  small
                  @click="irPara(stat.action.link)"
                >
                  {{ stat.action.label }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Dashboard",
  components: {
  },
  data() {
    return {
      stats: []
    };
  },
  async mounted() {
    await this.getNumeroEntidades();
    await this.getNumeroTipologias();
    await this.getNumeroDocsLegislativos();
  },
  methods: {
    async getNumeroTipologias() {
      await this.$request("get", "/tipologias")
        .then(res => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "class",
            title: "Número de Tipologias",
            data: res.data.length,
            action: {
              label: "Mais info",
              link: "/tipologias"
            }
          });
        })
        .catch(error => alert(error));
    }
    ,async getNumeroEntidades() {
      await this.$request("get", "/entidades")
        .then(res => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "class",
            title: "Número de entidades",
            data: res.data.length,
            action: {
              label: "Mais info",
              link: "/entidades"
            }
          });
        })
        .catch(error => alert(error));
    },
    async getNumeroDocsLegislativos() {
      await this.$request("get", "/legislacao")
        .then(res => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "work",
            title: "Número de documentos legislativos",
            data: res.data.length,
            action: {
              label: "Mais info",
              link: "/legislacao"
            }
          });
        })
        .catch(error => alert(error));
    },
    irPara(path) {
      this.$router.push(path);
    }
  }
};
</script>
