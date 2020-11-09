<template>
  <v-row>
    <v-col cols="12" xs="12" sm="3">
      <div class="info-label">
        Sistemas de informação
        <InfoBox header="Sistemas de Informação"/>
      </div>
    </v-col>
    <v-col v-if="sistema.length > 0">
      <v-data-table
        :headers="headers"
        :items="sistema"
        item-key="numeroSI"
        :sort-by="['numeroSI']"
        class="elevation-1"
        hide-default-footer
        :footer-props="footer_props"
      >
        <template v-slot:header="props">
          <tr>
            <th
              v-for="h in props.headers"
              :key="h.text"
              class="body-2 font-weight-bold"
              style="color: green;"
            >{{ h.text }}
            </th>
          </tr>
        </template>

        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.numeroSI }}</td>
            <td>{{ props.item.nomeSI }}</td>
            <td>
              <template>
                <div>
                  <v-dialog
                    :retain-focus="false"
                    v-model="alterar"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn small color="blue darken-2" dark rounded v-bind="attrs" v-on="on" @click="showSI(props.item)">
                        <v-icon dark>edit</v-icon>
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title class="expansion-panel-heading">Sitema de informação</v-card-title>
                      <div class="v-card__text mt-4">
                        <v-row>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Número SI
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.numeroSI"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Nome SI
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.nomeSI"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <div class="separador">Identificação</div>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Administrador do Sistema
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.adminSistema"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Administrador dos Dados
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.adminDados"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Proprietário do SI - Entidade pública
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.propSistemaPublico"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Proprietário do SI - Entidade privada
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.propSistemaPrivado"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Proprietário dos dados
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.propDados"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2">
                            <div class="info-label">Localização dos dados - Entidade pública
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.localDadosPublico"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Localização dos dados - Entidade privada
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.localDadosPrivado"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Definição formal de responsabilidades
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.defResponsavel"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Insourcing
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.insourcing"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Outsourcing
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.outsourcing"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Notas
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.identificacao.notas"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <div class="separador">Avaliação</div>
                        <v-row>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Descrição
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="10" >
                            <v-textarea
                              label="Não possui"
                              :value="siSpec.avaliacao.descricao"
                              readonly
                              rows="3"
                              max-rows="6"
                              solo
                              dense
                            ></v-textarea>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Decomposição
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.decomposicao"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Código de classificação da classe / série
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.codClasse"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">N.º de ref.ª da classe / série
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.numeroClasse"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Título da classe / série
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.tituloClasse"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">PCA da classe / série
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.pcaClasse"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Forma de contagem dos prazos
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.formaContagemPrazos"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Destino Final da classe / série
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.destinoFinalClasse"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">PCA do SI
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.pcaSI"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Destino final do SI
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.desfinoFinalSI"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">SI relacionado: n.º de referência
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.siRelacionado"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">SI relacionado: tipo de relação
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.siRelacionadoRelacao"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Atividade do SI
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.estadoSI"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Grau de utilização do SI
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.grauUtilizacaoSI"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Criticidade do SI
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.criticidadeSI"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">SI é objeto de preservação
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.siObjetoPreservacao"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Notas
                            </div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.avaliacao.notas"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <div class="separador">Caracterização</div>
                        <v-row>
                          <v-col cols="12" xs="12" sm="12" >
                            <div class="info-label">Em construção...
                            </div>
                          </v-col>
                        </v-row>
                        <div class="separador">Estratégia</div>
                        <v-row>
                          <v-col cols="12" xs="12" sm="12" >
                            <div class="info-label">Em construção...
                            </div>
                          </v-col>
                        </v-row>

                      </div>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="alterar = false"
                        >
                          Fechar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </template>
            </td>
            <td>
              <v-btn small color="red darken-2" dark rounded @click="unselectSistema(props.item)">
                <v-icon dark>remove_circle_outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>

        <template v-slot:footer.page-text="props">
            Sistemas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-col>
    <v-col v-else>
      <v-alert :value="true" type="warning">Não tem sistema selecionado...</v-alert>
    </v-col>
  </v-row>
</template>

<script>
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["sistema"],

  components: {
    InfoBox
  },

  data: function() {
    return {
      myhelp: help,
      alterar: false,
      headers: [
        { text: "Número", value: "numeroSI" },
        { text: "Nome", value: "nomeSI" },
        { text: "Ver", value: ""},
        { text: "Remover", value: "" }
      ],

      footer_props: {
        "items-per-page-text": "Sistemas por página",
        "items-per-page-options": [5, 10, 20, -1],
        "items-per-page-all-text": "Todos"
      },
      siSpec: {
        numeroSI: [],
        nomeSI: [],
        identificacao:{
          adminSistema: [],
          adminDados: [],
          propSistemaPublico: [],
          propSistemaPrivado: [],
          propDados: [],
          localDadosPublico: [],
          localDadosPrivado: [],
          userList: [],
          defResponsavel: [],
          expressaoResponsavel:[],
          insourcing: [],
          outsourcing: [],
          notas: [],
        },
        avaliacao:{},
        caracterizacao:{},
        estrategia:{}
      }
    };
  },

  methods: {
    unselectSistema: function(sistema) {
      this.$emit("unselectSistema", sistema);
    },

    showSI: function(item){
      this.alterar = true;
      //this.siSpec = item;
      this.item2Show(item);
    },

    item2Show: function(item){
      this.siSpec.numeroSI= item.numeroSI;
      this.siSpec.nomeSI= item.nomeSI;
      this.siSpec.identificacao.propSistemaPrivado= item.identificacao.propSistemaPrivado;
      this.siSpec.identificacao.localDadosPrivado= item.identificacao.localDadosPrivado;
      this.siSpec.identificacao.userList= item.identificacao.userList;
      this.siSpec.identificacao.defResponsavel= item.identificacao.defResponsavel;
      this.siSpec.identificacao.expressaoResponsavel=item.identificacao.expressaoResponsavel;
      this.siSpec.identificacao.insourcing= item.identificacao.insourcing;
      this.siSpec.identificacao.outsourcing= item.identificacao.outsourcing;
      this.siSpec.identificacao.notas= item.identificacao.notas;
      this.siSpec.avaliacao.descricao= item.avaliacao.descricao;
      this.siSpec.avaliacao.decomposicao= item.avaliacao.decomposicao;
      this.siSpec.avaliacao.codClasse= item.avaliacao.codClasse;
      this.siSpec.avaliacao.numeroClasse= item.avaliacao.numeroClasse;
      this.siSpec.avaliacao.tituloClasse= item.avaliacao.tituloClasse;
      this.siSpec.avaliacao.pcaClasse= item.avaliacao.pcaClasse;
      this.siSpec.avaliacao.formaContagemPrazos= item.avaliacao.formaContagemPrazos;
      this.siSpec.avaliacao.destinoFinalClasse= item.avaliacao.destinoFinalClasse;
      this.siSpec.avaliacao.pcaSI= item.avaliacao.pcaSI;
      this.siSpec.avaliacao.desfinoFinalSI= item.avaliacao.desfinoFinalSI;
      this.siSpec.avaliacao.siRelacionado= item.avaliacao.siRelacionado;
      this.siSpec.avaliacao.siRelacionadoRelacao= item.avaliacao.siRelacionadoRelacao;
      this.siSpec.avaliacao.estadoSI= item.avaliacao.estadoSI;
      this.siSpec.avaliacao.grauUtilizacaoSI= item.avaliacao.grauUtilizacaoSI;
      this.siSpec.avaliacao.criticidadeSI= item.avaliacao.criticidadeSI;
      this.siSpec.avaliacao.siObjetoPreservacao= item.avaliacao.siObjetoPreservacao;
      this.siSpec.avaliacao.notas= item.avaliacao.notas;
      this.siSpec.caracterizacao={};
      this.siSpec.estrategia={};

      if(item.importado){
        this.siSpec.identificacao.adminSistema= item.identificacao.adminSistema
        this.siSpec.identificacao.adminDados= item.identificacao.adminDados,
        this.siSpec.identificacao.propSistemaPublico= item.identificacao.propSistemaPublico,
        this.siSpec.identificacao.propDados= item.identificacao.propDados,
        this.siSpec.identificacao.localDadosPublico= item.identificacao.localDadosPublico
      }
      else{
        this.siSpec.identificacao.adminSistema= item.identificacao.adminSistema.map(e => e.sigla).toString()
        this.siSpec.identificacao.adminDados= item.identificacao.adminDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propSistemaPublico= item.identificacao.propSistemaPublico.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propDados= item.identificacao.propDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.localDadosPublico= item.identificacao.localDadosPublico.map(e => e.sigla).toString()
      }
    }

  }
};
</script>
<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
