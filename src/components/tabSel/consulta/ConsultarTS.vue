<template>
  <div>
  <v-card class="ma-4">
    <v-card-title class="indigo darken-4 white--text">
      Tabela de Seleção
      <v-spacer/>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
            <v-btn @click="csvExport()" color="white" icon v-on="on">
            <v-icon>get_app</v-icon>
            </v-btn>
        </template>
        <span>Transferir Tabela de Seleção</span>
        </v-tooltip>
    </v-card-title>

    <v-card-text class="ma-1">
      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Designação
          </div>
        </v-col>
        <v-col>
            <div class="info-content">{{ ts.designacao }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Data de Autenticação
          </div>
        </v-col>
        <v-col>
            <div class="info-content">{{ ts.data }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Entidade Produtora
          </div>
        </v-col>
        <v-col>
            <div class="info-content">
              <a :href="'/entidades/ent_' + ts.entidade">{{ ts.entidade }}</a>{{" ("+ts.responsavel+")"}}
            </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <div class="info-label">
            Entidades
          </div>
        </v-col>
        <v-col>
            <div class="info-content">
              <ul>
                <li v-for="(ent, i) in ts.entidades" :key="i">
                  <a :href="'/entidades/ent_' + ent">{{ ent }}</a>
                </li>
              </ul>
            </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="2" sm="2" class="mt-3">
          <div class="info-label">
            Tabela de Seleção
          </div>
        </v-col>
        <v-col xs="3" sm="3"/>
        <v-col xs="5" sm="5">
          <v-text-field
            label="Procurar" 
            v-model="search"
            append-icon="search"
            single-line
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="ts.classes"
            item-key="codigo"
            :search="search"
            class="elevation-1"
            :footer-props="footer_props"
            :page.sync="paginaTabela"
            :expanded="expanded"
            :single-expand="true"
            @click:row="clicked">
          >
            <template v-slot:expanded-item="{headers,item}">
              <td :colspan="headers.length">
                <v-card class="ma-1 elevation-0">
                  <v-card-text>
                    <v-row v-if="item.descricao">
                      <v-col cols="2">
                        <div class="info-label">Descrição</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.descricao}}</div>
                      </v-col>
                    </v-row>
                    <v-row v-if="item.diplomas">
                      <v-col cols="2">
                        <div class="info-label">Diplomas Jurídico-Administrativo</div>
                      </v-col>
                      <v-col>
                        <div class="info-content"><div v-for="(d,index) in item.diplomas.split('#')" :key="index">{{d}}</div></div>
                      </v-col>
                    </v-row>
                    <v-row v-if="item.notaPCA">
                      <v-col cols="2">
                        <div class="info-label">Nota do PCA</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.notaPCA}}</div>
                      </v-col>
                    </v-row>
                    
                    <v-row v-if="item.formaContagem">
                      <v-col cols="2">
                        <div class="info-label">Forma de Contagem</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.formaContagem}}</div>
                      </v-col>
                      <v-col cols="2" v-if="item.subFormaContagem">
                        <div class="info-label">Subforma de Contagem</div>
                      </v-col>
                      <v-col v-if="item.subFormaContagem">
                        <div class="info-content">{{item.subFormaContagem}}</div>
                      </v-col>
                    </v-row>
                    
                    <v-row v-if="item.justificacaoPCA">
                      <v-col cols="2">
                        <div class="info-label">Justificação do PCA</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.justificacaoPCA}}</div>
                      </v-col>
                    </v-row>

                    <v-row v-if="item.notaDF">
                      <v-col cols="2">
                        <div class="info-label">Nota do Destino Final</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.notaDF}}</div>
                      </v-col>
                    </v-row>
                    
                    <v-row v-if="item.justificacaoDF">
                      <v-col cols="2">
                        <div class="info-label">Justificação do DF</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.justificacaoDF}}</div>
                      </v-col>
                    </v-row>
                    
                    <v-row v-if="item.designacaoDono || item.designacaoParticipante">
                      <v-col cols="2" v-if="item.designacaoDono">
                        <div class="info-label">Dono</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.designacaoDono}}</div>
                      </v-col>
                      <v-col cols="2" v-if="item.designacaoParticipante">
                        <div class="info-label">Participante</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.designacaoParticipante}}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>      
  </div>
</template>
<script>
export default {
  props: ["ts"],
  data: () => ({
    search: "",
    expanded: [],
    singleExpand: false,
    tree_ou_tabela: false,
    paginaTabela: 1,
    headers: [
      {text: "Código", sortable: false, value: "codigo"},
      {text: "Título", sortable: false, value: "titulo"},
      {text: "PCA", sortable: false, value: "pca.valores"},
      {text: "Destino Final", sortable: false, value: "df.valor"},
    ],
    footer_props: {
      "items-per-page-options": [10,25,-1],
      "items-per-page-text": "Mostrar",
      "items-per-page-all-text": "Todos"
    }
  }),
  mounted: function() {
    this.ts.classes = this.ts.classes.map(c => {
      if(c.nivel<3) {
        delete c["df"]; delete c["pca"]
      }
      return c
    })
  },
  methods: {
    csvExport() { 
      //let csvContent = "data:text/csv;charset=utf-8,";
      let headers
      let csvContent
      let fileName = this.titulo.replace(/ /g,'_');
        headers = "Código,N.º Referência,Título,Descrição,Dono PN,Participante PN,PCA,Nota PCA,Forma de Contagem PCA,DF,Nota DF"
        csvContent = [headers,
          ...this.ts.classes.map(item => {
              var str = '"' + (item.codigo || "") + '",' 
                      + '"' + (item.referencia || "") + '",' 
                      + '"' + (item.titulo || "") + '",' 
                      + '"' + (item.descricao || "") + '",' 
                      + '"' + (item.designacaoDono ? 'X' : "") + '",' 
                      + '"' + (item.designacaoParticipante ? 'X' : "") + '",' 
                      + '"' + (item.pca || "") + '",' 
                      + '"' + (item.notaPCA || "") + '",' 
                      + '"' 
              if(item.formaContagem == "Data de conclusão do procedimento") str += "F04"
              else if(item.formaContagem == "Data de cessação da vigência") str += "F05"
              else if(item.formaContagem == "Data de início do procedimento") str += "F02"
              else if(item.formaContagem == "Data de emissão do título") str += "F03"
              else if(item.formaContagem == "Data de extinção da entidade sobre a qual recai o procedimento") str += "F06"
              else if(item.formaContagem == "Data de extinção do direito") str += "F07"
              else if(item.formaContagem == "Conforme disposição legal") {
                str += "F01."
                if(item.subFormaContagem ) str+= item.subFormaContagem.split("F01.")[1]
              }
      
              str += '","' + (item.df || "") + '",' 
                    + '"' + (item.notaDF || "") + '"'
              return str;
            })
          ]
            .join("\n")
            .replace(/(^\[)|(\]$)/gm, "");
      
      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + data);
      link.setAttribute("download", fileName +".csv");
      link.click();
    },
    clicked(value) {
      if(value.descricao || value.notaDF || value.notaPCA || value.formaContagem || value.subFormaContagem || value.designacaoParticipante || value.designacaoDono)
        if(this.expanded[0] == value) this.expanded.pop();
        else this.expanded = [value]
    }
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
  border: 1px solid #1a237e;
  border-radius: 3px;
}
</style>