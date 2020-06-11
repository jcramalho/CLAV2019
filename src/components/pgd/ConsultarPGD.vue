<template>
  <div>
    <v-card class="ma-4">
    <v-card-title class="indigo darken-4 white--text">
      {{ titulo }}
    </v-card-title>

    <v-card-text>
      <v-row v-for="(item, index) in objeto" v-bind:key="index">
        <v-col cols="2" v-if="item.text">
          <div class="info-label">
            {{ item.campo }}

            <InfoBox
              v-if="item.tipo === 'Legislação'"
              :header="item.campo"
              :text="myhelp.Legislacao.Campos[item.campo]"
            />
          </div>
        </v-col>

        <v-col v-if="item.text">
          <div v-if="item.campo === 'Link'" class="info-content">
            <a :href="item.text" target="_blank">{{ item.text }}</a>
          </div>
          <div v-else>
            <div v-if="item.campo === 'Entidades'" class="info-content">
              <ul>
                <li v-for="(ent, i) in item.text" :key="i">
                  <a :href="'/entidades/ent_' + ent.sigla">{{ ent.sigla }}</a>
                </li>
              </ul>
            </div>
            <div v-else class="info-content">{{ item.text }}</div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" class="mt-3">
          <div class="info-label">
            Tabela de Seleção
          </div>
        </v-col>
        <v-col cols="4"/>
        <v-col cols="6">
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
          <!--v-list>
            <v-list-group
              v-for="(classe, i) in classes"
              :key="i"
              multiple
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    <span v-if="classe.codigo">{{classe.codigo}} <span class="ml-7">{{classe.titulo}}</span></span>
                    <span v-else class="ml-9">{{classe.titulo}}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
                <ShowPGD :classe="classe"/>
            </v-list-group>
          </v-list-->
          <v-data-table
            :headers="headers"
            :items="classes"
            item-key="idClasse"
            :search="search"
            class="elevation-1"
            :footer-props="footer_props"
            :expanded="expanded"
            :single-expand="true"
            :hide-default-footer="true"
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
                    <v-row v-if="item.notaDF">
                      <v-col cols="2">
                        <div class="info-label">Nota do Destino Final</div>
                      </v-col>
                      <v-col>
                        <div class="info-content">{{item.notaDF}}</div>
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
import ShowPGD from "@/components/pgd/ShowPGD.vue"
export default {
  props: ["classes","objeto","titulo"],
  components: {
    //ShowPGD
  },
  data: () => ({
    search: "",
    expanded: [],
    singleExpand: false,
    headers: [
      {text: "Código", sortable: false, value: "codigo"},
      {text: "Referência", sortable: false, value: "referencia"},
      {text: "Título", sortable: false, value: "titulo"},
      {text: "PCA", sortable: false, value: "pca"},
      {text: "Destino Final", sortable: false, value: "df"},
    ],
    footer_props: {
      "items-per-page-options": [],
      "items-per-page-text": "Mostrar"
    }
  }),
  methods: {
    clicked(value) {
      if(value.descricao || value.notaDF || value.notaPCA || value.formaContagem || value.subFormaContagem || value.designacaoParticipante || value.designacaoDono)
        if(this.expanded[0] == value) this.expanded.pop();
        else this.expanded = [value]
    }
  },
  created: function() {
    this.footer_props["items-per-page-options"].push(this.classes.length)
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