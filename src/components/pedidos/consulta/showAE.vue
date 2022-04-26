<template>
  <v-card class="mt-2">
    <v-card-title class="clav-linear-background white--text">
      {{ p.objeto.acao }} do Auto de Eliminação
      <v-spacer></v-spacer>
      <unicon
        name="criar-icon"
        width="20"
        height="20"
        viewBox="0 0 20.71 20.721"
        fill="white"
      />
    </v-card-title>
    </br>
    <v-card-text>
      <Campo
        nome="Entidade Responsável"
        infoHeader="Nome da Entidade Responsável"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <span v-if="p.objeto.dados.entidade">
            {{ p.objeto.dados.entidade.split("_")[1] }}
          </span>
          <span v-else>
            {{ p.entidade }}
          </span>
        </template>
      </Campo>
      <Campo
        v-if="p.objeto.dados.legislacao"
        nome="Fonte de Legitimação"
        infoHeader="Fonte de Legitimação"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <a :href="'/legislacao/' + p.objeto.dados.refLegislacao">
            {{ p.objeto.dados.legislacao }}
          </a>
        </template>
      </Campo>
      <Campo
        v-else
        nome="Referencial Classificativo"
        infoHeader="Referencial Classificativo"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <a
            v-if="p.objeto.dados.tipo == 'RADA'"
            :href="'/rada/' + p.objeto.dados.referencial.split('#')[1]"
          >
            {{ p.objeto.dados.referencial.split("#")[0] }}
          </a>
          <span v-else>{{ p.objeto.dados.referencial.split("#")[0] }}</span>
        </template>
      </Campo>
      <Campo nome="Entidades" infoHeader="Entidades" color="neutralpurple">
        <template v-slot:conteudo>
          <ul>
            <li v-for="(e, i) in p.objeto.dados.entidades" :key="i">
              <a :href="'/entidades/ent_' + e.entidade"
                >{{ e.entidade }}: {{ e.designacao }}</a
              >
            </li>
          </ul>
        </template>
      </Campo>

      <Campo nome="Classes" infoHeader="Classes" color="neutralpurple">
        <template v-slot:conteudo>
          <v-list dense color="secondary">
            <v-list-group
              v-for="(item, index) in p.objeto.dados.classes"
              :key="index"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title
                    v-if="item.codigo && item.referencia"
                    v-text="item.codigo + ', ' + item.referencia"
                  ></v-list-item-title>
                  <v-list-item-title 
                    v-else-if="item.codigo" 
                    v-text="item.codigo"
                  ></v-list-item-title>
                  <v-list-item-title 
                    v-else 
                    v-text="item.referencia"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item-content>
                <v-list-item-title>
                  <Campo
                    v-if="item.codigo"
                    nome="Código da classe"
                    infoHeader="Código da classe"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.codigo }}</span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.referencia"
                    nome="Referência"
                    infoHeader="Referência"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.referencia }}</span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.titulo"
                    nome="Título"
                    infoHeader="Título"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.titulo }}</span>
                    </template>
                  </Campo>
                  <Campo
                    nome="Ano de Início"
                    infoHeader="Ano de Início"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.dataInicio }}</span>
                    </template>
                  </Campo>
                  <Campo nome="Ano de Fim" infoHeader="Ano de Fim" color="neutralpurple">
                    <template v-slot:conteudo>
                      <span> {{ item.dataFim }}</span>
                    </template>
                  </Campo>
                  <Campo
                    nome="N.º de agregações"
                    infoHeader="N.º de agregações"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.numAgregacoes }}</span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.medicaoPapel"
                    nome="Medição das UI em papel"
                    infoHeader="Medição das UI em papel (m.l.)"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.medicaoPapel }} </span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.medicaoDigital"
                    nome="Medição das UI em digital"
                    infoHeader="Medição das UI em digital (Gb)"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.medicaoDigital }} </span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.medicaoOutro"
                    nome="Medição noutros suportes"
                    infoHeader="Medição das UI noutros suportes"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <span> {{ item.medicaoOutro }} </span>
                    </template>
                  </Campo>
                  <Campo
                    v-if="item.dono"
                    nome="Dono"
                    infoHeader="Dono"
                    color="neutralpurple"
                  >
                    <template v-slot:conteudo>
                      <ul class="info-content" :class="{ 'is-collapsed': entCollapsed }">
                        <li v-for="(l, index) in listaDonos[item.codigo]" v-bind:key="index">
                          <a :href="'/entidades/ent_' + l">{{ l }}</a>
                        </li>
                      </ul>
                      <a @click="entCollapsed = !entCollapsed" v-if="listaDonos.length > 6">
                        <span v-if="entCollapsed" style="color:#283593;"
                        >Mostrar mais...</span>
                        <span v-else style="color:#283593;">Mostrar menos...</span>
                      </a>
                    </template>
                  </Campo>
                  <div class="ma-1" v-if="item.agregacoes && item.agregacoes.length > 0">
                    <v-row style="margin-top:10px" justify="space-between" class="info-label">
                      <v-col>Lista de Agregações</v-col>
                      <v-col>
                        <v-text-field
                          v-model="search"
                          append-icon="search"
                          label="Procura"
                          single-line
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-data-table
                      :headers="cabecalho"
                      :items="item.agregacoes"
                      :items-per-page="5"
                      class="elevation-1 ml-2 mt-3"
                      :footer-props="footer_props"
                      :search="search"
                    />
                  </div>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-group>
          </v-list>
        </template>
      </Campo>
    </v-card-text>
  </v-card>
</template>

<script>
import Campo from "@/components/generic/CampoCLAV";

export default {
  props: ["p"],
  components: {
    Campo,
  },

  data: () => ({
    search: "",
    cabecalho: [
      { text: "Código de Agregação", align: "left", value: "codigoAgregacao" },
      { text: "Título", align: "left", value: "titulo" },
      { text: "Ano", align: "left", value: "dataContagem" },
      { text: "Natureza de Intervenção", align: "left", value: "ni" },
    ],
    footer_props: {
      "items-per-page-text": "Mostrar",
    },
    entCollapsed: true,
    listaDonos: {}
  }),

  created: function(){
    this.p.objeto.dados.classes.forEach(
      c => {
        if(c.dono) {
          this.listaDonos[c.codigo] = c.dono.split("#")
          if(!((/[a-zA-Z]+/).test(this.listaDonos[c.codigo][this.listaDonos[c.codigo].length - 1])))
            this.listaDonos[c.codigo].pop()
        }
      }
    )
  }
};
</script>

<style>
.panel-custom .panel-heading {
  background-image: linear-gradient(to top, #e8eaf6 0, #c7cefa 100%);
}

.panel-custom .page-header {
  border: none;
  margin: 0;
  color: #1a237e;
}

.panel-custom .panel-default:hover {
  border-color: #1a237e;
}

.consulta tr {
  vertical-align: top;
  border-bottom: 1px solid #ddd;
}

.consulta td {
  padding-left: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  align-content: center;
}

.consulta td:nth-of-type(2) {
  vertical-align: middle;
  padding-left: 15px;
}

.info-label {
  color: #1a237e; /* indigo darken-4 */
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  border-radius: 3px;
}

.panel-info-custom .panel-body {
  font-size: 1pc;
  font-family: "Times New Roman", Times, serif;
}

.panel-noticiabox .panel-body {
  font-size: 1pc;
}

.panel-linkbox .panel-body {
  padding-top: 5px !important;
  padding-left: 30px !important;
  padding-bottom: 10px;
}

li .panel-body {
  padding: 0px;
}

li .panel-body li {
  margin-left: 20px;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}

.wrap-text {
  -webkit-line-clamp: unset !important;
  white-space: normal;
}
</style>
