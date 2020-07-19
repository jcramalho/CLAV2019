<template>
  <div>
    <v-list shaped>
      <v-list-group
        v-for="(item,index) in auto.zonaControlo"
        :key="index"
        color="grey darken-1"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              <v-row>
                <v-col :md="2">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Classe</v-card>
                </v-col>
                <v-col>
                  <div class="mt-2" v-if="item.codigo && item.referencia">{{ item.codigo + " " + item.referencia +" - "+item.titulo }}</div>
                  <div class="mt-2" v-else-if="item.codigo">{{ item.codigo +" - "+item.titulo }}</div>
                  <div class="mt-2" v-else-if="item.referencia">{{ item.referencia +" - "+item.titulo }}</div>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item-content>
          <v-list-item-title class="mx-2">
            <v-row justify="end" class="mx-4">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" class="mr-2" @click="editarIndex=index; editarZC=true;">edit</v-icon>
                </template>
                <span>Editar Classe</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" @click="deleteIndex=index; ag=item.agregacoes.length; deleteDialog=true">delete</v-icon>
                </template>
                <span>Remover Classe</span>
              </v-tooltip>
            </v-row>
              <v-row v-if="item.prazoConservacao">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Prazo de Conservação Administrativa</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">
                  <span v-if="item.prazoConservacao=='1'">{{ item.prazoConservacao }} Ano</span>
                  <span v-else>{{ item.prazoConservacao }} Anos</span>
                </v-card></v-col>
              </v-row>
              <v-row v-if="item.notasPCA">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Notas do PCA</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.notasPCA }}</v-card></v-col>
              </v-row>
              <v-row v-if="item.destino">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Destino Final</v-card>
                </v-col>
                <v-col v-if="item.destino === 'E'"><v-card class="mt-2" style="color: #757575" elevation="0">Eliminação</v-card></v-col>
                <v-col v-else-if="item.destino === 'C'"><v-card class="mt-2" style="color: #757575" elevation="0">Conservação</v-card></v-col>
                <v-col v-else><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.destino }}</v-card></v-col>
              </v-row>
              <v-row v-if="item.ni  && item.df!='Eliminação' && tipo!='RADA' && tipo!='PGD'">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Natureza de intervenção</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.ni }}</v-card></v-col>
              </v-row>
              <v-row v-if="item.destino === 'C' && tipo!='RADA' && tipo!='PGD'">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Dono do PN <v-icon color="red" v-if="item.dono.length==0">warning</v-icon></v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0"><p v-for="d in item.dono" :key="d">{{ d }}</p></v-card></v-col>
              </v-row>
              <v-row v-if="item.notaDF">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Nota do DF</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.notaDF }}</v-card></v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Data de Início</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.dataInicio }}</v-card></v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Data de Fim</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.dataFim }}</v-card></v-col>
              </v-row>
              <v-row>
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">N.º de agregações</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.agregacoes.length }}</v-card></v-col>
              </v-row>
              <v-row v-if="item.uiPapel">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Medição das UI em papel (m.l.)</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.uiPapel }}</v-card></v-col>
              </v-row>
              <v-row v-if="item.uiDigital">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Medição das UI em digital (Gb)</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.uiDigital }}</v-card></v-col>
              </v-row>
              <v-row v-if="item.uiOutros">
                <v-col cols="3">
                  <v-card class="info-label" style="color: #1a237e; background-color: #dee2f8;" elevation="0">Medição das UI noutros suportes</v-card>
                </v-col>
                <v-col><v-card class="mt-2" style="color: #757575" elevation="0">{{ item.uiOutros }}</v-card></v-col>
              </v-row>
            <!-- Lista de Agregacoes -->
            <ListaAgregacoes
              v-bind:auto="auto"
              v-bind:index="index"
              v-bind:agregacoes="auto.zonaControlo[index].agregacoes"
            />
            
          </v-list-item-title>
        </v-list-item-content>
        <v-dialog v-model="editarZC">
          <DialogZonaControlo 
            v-bind:auto="auto"
            v-bind:classes="classes"
            v-bind:entidades="entidades"
            v-bind:closeZC="closeZC"
            v-bind:zona="auto.zonaControlo[editarIndex]"
            v-bind:index="editarIndex"
            v-bind:classesCompletas="classesCompletas"
            v-bind:donos="donos"
            v-bind:tipo="tipo"
          />
        </v-dialog>
        <v-dialog v-model="deleteDialog" width="700" persistent>
          <v-card outlined>
            <v-card-title
              class="red darken-4 title white--text"
              dark
            >Eliminação de Classe</v-card-title>

            <v-card-text>
              <div v-if="ag>0" class="subtitle-1" style="white-space: pre-wrap">Esta ação vai <strong>eliminar permanentemente</strong> a zona de controlo assim como todas as agregações que lhe estão associadas.
              </div>
              <div v-else class="subtitle-1" style="white-space: pre-wrap">Esta ação vai <strong>eliminar permanentemente</strong> a zona de controlo.
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="green darken-4" text @click="deleteDialog = false">Fechar</v-btn>
              <v-btn color="red darken-4" text @click="deleteZC">Confirmar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-group>
    </v-list>
    <v-dialog v-model="erroDialog" width="700" persistent>
      <v-card outlined>
        <v-card-title
          class="red darken-4 title white--text"
          dark
        >Erro: Não foi possível adicionar a Classe</v-card-title>

        <v-card-text>
          <span class="subtitle-1" style="white-space: pre-wrap" v-html="erro"></span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="red darken-4" text @click="erroDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      color="success"
    >
      Classe editada com sucesso!
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
const help = require("@/config/help").help;
import AdicionarAgregacao from "@/components/autosEliminacao/criacao/AdicionarAgregacao.vue"
import DialogZonaControlo from "@/components/autosEliminacao/criacao/DialogZonaControlo.vue"
import ListaAgregacoes from "@/components/autosEliminacao/criacao/ListaAgregacoes.vue"

export default {
  props: ["classes", "entidades", "auto", "classesCompletas","donos","tipo"],
  components: {
    DialogZonaControlo,
    ListaAgregacoes
  },
  data: () => ({
    classe: null,
    ni: "Vazio",
    dono: null,
    dataInicio: null,
    dataFim: null,
    uiPapel: null,
    uiDigital: null,
    uiOutros: null,
    ag: 0,
    editarZC: false,
    editarIndex: null,
    snackbar: false,
    deleteDialog: false,
    deleteIndex: null,


    natureza: ["Vazio", "Dono", "Paticipante"],
    
    erro: null,
    erroDialog: false
  }),
  methods: {
    deleteZC: function () {
      this.auto.zonaControlo.splice(this.deleteIndex,1)
      this.deleteDialog = false;
    },
    closeZC: function () {
      this.editarZC = false
      this.snackbar = true
    }
  }
};
</script>