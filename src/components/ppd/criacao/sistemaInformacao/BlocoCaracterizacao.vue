<template>
  <v-expansion-panel popout focusable>
    <!-- CONTEXTO DE CARACTERIZAÇÃO DO PPD -->
    <v-expansion-panel-header class="expansion-panel-heading">
      <div>
        3.  Caracterização tecnológica do sistema de informação
        <InfoBox header="Caracterização SI" :text="myhelp.Ppd.Caracterizacao.geral"  helpColor="white"/>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
         <v-col cols="12" xs="12" sm="12">
            <div class="separador">Dependência tecnológica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Nível de dependência do Software</div>
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="9"
        >
          <v-select
            :items="dependenciaSoft"
            label="Indique nível de dependência para com fornecedores privados"
            v-model="ppd.si.caracterizacao.dependenciaSoft"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Categoria dos dados</div>
        </v-col>
        <v-col
          class="d-flex"
          cols="12"
          sm="9"
        >
          <v-select
            :items="categoriaDados"
            label="Indique o tipo de categoria dos dados"
            v-model="ppd.si.caracterizacao.categoriaDados"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Formatos</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.caracterizacao.formatos"
              label="Indique os formatos utilizados (ex: Mysql, doc, pdf, xlsx)"
              solo
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12">
            <div class="separador">Crescimento do sistema</div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Modelo de crescimento</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="modeloCres"
            label="Indique o modelo de adição de dados ao sistema"
            v-model="modeloCresCheck"
            dense
            solo
          ></v-select>
          <v-text-field v-if="modeloCresCheck ==='Outra situação'"
            :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
            v-model="ppd.si.caracterizacao.modeloCres"
            label="Indique qual"
            solo
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Dimensão atual</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.caracterizacao.dimensao"
              label="Indique a dimensão em unidades binárias (Gb)."
              solo
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Crescimento anual</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-text-field
              :rules="[v => !!v || 'Campo de preenchimento obrigatório!']"
              v-model="ppd.si.caracterizacao.crescimento"
              label="Indique a dimensão em unidades binárias (Gb)."
              solo
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" xs="12" sm="12">
            <div class="separador">Segurança geral da plataforma tecnológica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Localização de Sistema</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="localSistema"
            label="Indique se os sistemas estão sediados num ponto central ou dispersos"
            v-model="ppd.si.caracterizacao.localSistema"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sala técnica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="ppd.si.caracterizacao.salaTec" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Acesso reservado a sala técnica</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="ppd.si.caracterizacao.acessoSalaTec" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Sistemas de energia redundantes</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-radio-group v-model="ppd.si.caracterizacao.energiaRed" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
            <div class="info-label">Energia socorrida</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
           <v-radio-group v-model="ppd.si.caracterizacao.energiaSoc" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Sistema de alarme e extinção de incêndio</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="alarme"
            label="Indique se há segurança relativamente a incêndios"
            v-model="ppd.si.caracterizacao.alarme"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Climatização dedicada</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.caracterizacao.climatizacao" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Utilização de métodos de prevenção ou mitigação de malware e outras ciberameaças</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="seguranca"
            label="Indique se existe algum tipo de proteção"
            v-model="ppd.si.caracterizacao.seguranca"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Comunicação externa segura</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.caracterizacao.comunicacaoEx" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Plano contingência</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="simNaoDesen"
            label="Indique se existe plano de contingência"
            v-model="ppd.si.caracterizacao.planoContingencia"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Plano para gerir mudança e evolução da plataforma tecnológica</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="simNaoDesen"
            label="Indique se existe plano para gerir mudança e evolução da plataforma"
            v-model="ppd.si.caracterizacao.planoMudEvolucao"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12">
            <div class="separador">Segurança específica dos sistemas</div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Privilégios de acesso</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.caracterizacao.privAcesso" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Categorias de segurança dos dados</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="catSegDados"
            label="Indique se a informação residente nos sistemas tem algum tipo de classificação de segurança"
            v-model="ppd.si.caracterizacao.catSegDados"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Rotinas de auditoria configuradas</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.caracterizacao.rotinaAuditoria" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Logs das rotinas periodicamente analisados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.caracterizacao.logsRotinas" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Integridade da informação do sistema</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="integridadeInfo"
            label="Indique como a integridade da informação contida no sistema é verificada"
            v-model="ppd.si.caracterizacao.integridadeInfo"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12">
            <div class="separador">Armazenamento</div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Armazenamento dedicado</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="armazenamento"
            label="Indique se a organização dispõe de armazenamento com maior ou menor grau de sofisticação"
            v-model="ppd.si.caracterizacao.armazenamento"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Replicação de dados</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.caracterizacao.replicacaoDados" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Backups regulares</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="backupsRegular"
            label="Indique se são produzidos backups regularmente"
            v-model="ppd.si.caracterizacao.backupsRegular"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Modelo do backup</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="modeloBackup"
            label="Indique o tipo do modelo do backup"
            v-model="ppd.si.caracterizacao.modeloBackup"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Qualidade do backup</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="integridadeInfo"
            label="Indique se a qualidade do backup é testada"
            v-model="ppd.si.caracterizacao.qualidadeBackup"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="12">
            <div class="separador">Documentação</div>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Inventário de Software</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="inventario"
            label="Indique a metainformção e documentação do sistema"
            v-model="ppd.si.caracterizacao.inventarioSoft"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Inventário de Hardware</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="inventario"
            label="Indique a metainformção e documentação do sistema"
            v-model="ppd.si.caracterizacao.inventarioHard"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Documentação dos sistemas</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="documentacaoSis"
            label="Indique a metainformção e documentação do sistema"
            v-model="ppd.si.caracterizacao.documentacaoSis"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Documentação de procedimentos</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="documentacaoProc"
            label="Indique se os procedimentos técnicos informáticos de manutenção são facilmente acessíveis pelo pessoal TIC"
            v-model="ppd.si.caracterizacao.documentacaoProc"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Controlo de versões</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
            <v-radio-group v-model="ppd.si.caracterizacao.controlVersaoDProc" row>
            <v-radio
              v-for="(p, i) in simNao"
              :key="i"
              :label="p"
              :value="p"
              color="indigo darken-3"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Contratos de manutenção</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="contratoAtivos"
            label="Indique se tem contratos de manutenção ativos"
            v-model="ppd.si.caracterizacao.contratoAtivos"
            dense
            solo
          ></v-select>
        </v-col>
        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Plano recuperação de dados</div>
        </v-col>
        <v-col class="d-flex" cols="12" sm="9">
          <v-select
            :items="planoRecuperacao"
            label="Indique se existe um plano de contingência em caso de paragem programada ou intempestiva de sistema"
            v-model="ppd.si.caracterizacao.planoRecuperacao"
            dense
            solo
          ></v-select>
        </v-col>

        <v-col cols="12" xs="12" sm="3">
          <div class="info-label">Notas</div>
        </v-col>
        <v-col cols="12" xs="12" sm="9">
          <v-textarea
              v-model="ppd.si.caracterizacao.notas"
              label=""
              solo
              clearable
          ></v-textarea>
        </v-col>


        </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";

export default {
  props: ["ppd"],

  components: {
    InfoBox
  },

  data: () => {
    return {
      simNao: ["Sim", "Não"],
      modeloCresCheck: "",

      myhelp: help,
      dependenciaSoft: ["Uso exclusivo de SW não proprietário",
                        "Uso de SW proprietário, mas com adequadas facilidades de exportação de dados",
                        "Uso de SW proprietário com especificações fechadas, e sem adequadas facilidades de exportação de dados"],
      categoriaDados: ["Dados tabulares (Ex. Sql, Mysql, Oracle, MS Access, etc)",
                       "Grafos (Ex. Neo4J)",
                       "Texto estruturado (doc, odt, pdf, etc)",
                       "Folha de cálculo (xlsx, odf, etc)",
                       "Multimédia (som, imagem - bitmap e vetorial-, vídeo)",
                       "Misto (combinação de formatos, por ex. Sql + imagem + texto estruturado)"],
      modeloCres: ["Acumulção contínua - dados continuamente adicionados sem se proceder a expurgo",
                   "Substituição de dado - os dados são escritos por cima de registos anteriores criando diferentes versões de um registo qs quais podem ou não ser guardadas",
                   "Expurgo de registos que perdem utilidade operacional - periodicamente o sistema é purgado de dados que perdem utilidade operacional",
                   "Outra situação"],
      seguranca: ["Sim", "Não", "Em estudo"],
      simNaoDesen: ["Sim","Não","Em desenvolvimento"],
      integridadeInfo: ["Reativamente em resposta a incidentes","Proativamente de forma rotineira","Proativamente de forma aleatória","Não é verificada"],
      catSegDados: ["Sim. Para toda a informação do sistema", "Sim. Para alguma informação do sistema","Não"],
      armazenamento: ["Sim (NAS, CAS, SAN, outros)","Sim (arquivos óticos, e similares)","Não (informação reside em servidores, discos externos, etc)","Outros"],
      alarme: ["Sim há sistemas de alarme e extinção", "Não há sistemas de alarme ou extinção",
               "Há sistemas de alarme mas não de extinção", "Outros"],
      modeloBackup: ["Armazenamento","Incremental","Diferencial","Misto","Outro"],
      backupsRegular: ["Sim. De acordo com política formalizada", "Sim. Sem política formalizada","Sim. Backups aleatórios ou ocasionais", "Não"],
      localSistema: ["Centralizado","Descentralizado","Misto"],
      inventario: ["Sim","Não","Em construção"],
      documentacaoSis: ["Existe toda a documentação considerada necessária para a utilização, recuperação e salvagurda do sistema.",
                        "Existe alguma documentação mas não a consideramos suficiente para a utilização, recuperação ou salvagarda do sistema.",
                        "Existe apenas documentação comercial não personalizada para o sistema na organização.","Sistema não documentado."],
      documentacaoProc: ["Sim, todos", "Sim, alguns", "Não"],
      contratoAtivos: ["Sim", "Não", "N/A (Não aplicável. Manutenção assegurada internamente)"],
      planoRecuperacao: ["Sim", "Não", "Em planeamento"],
    };
  },

  methods: {

  },
  watch:{
    "metodoCheck": function() {

      if(this.modeloCresCheck !='Outra situação'){
        this.ppd.si.caracterizacao.modeloCres = this.modeloCresCheck;
      }
      else{
        this.ppd.si.caracterizacao.modeloCres = "";
      }
    },
  }
};
</script>
<style>
.info-label {
  color: #2e7d32; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; 
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}

.separador {
  color: white; 
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1A237E; 
  font-size: 14pt;
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
  text-align: center;
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
