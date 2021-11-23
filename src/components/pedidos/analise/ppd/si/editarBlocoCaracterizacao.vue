<template>
  <div>
    <div class="separador">Caracterização</div>
    <div class="separadorMini">Dependência</div>
    <v-card flat class="ma-1">
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="dependenciaSoft"
        campoText="Nível de dependência do Software"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="categoriaDados"
        campoText="Categoria dos dados"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="formatosUtilizados"
        campoText="Formatos"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>

      <div class="separadorMini">Crescimento do sistema</div>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="modeloCres"
        campoText="Modelo de crescimento"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="dimensao"
        campoText="Dimensão atual"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="crescimento"
        campoText="Crescimento anual"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>

      <div class="separadorMini">Segurança geral da plataforma</div>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="localSistema"
        campoText="Localização de Sistema"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="salaTec"
        campoText="Sala técnica"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="acessoSalaTec"
        campoText="Acesso reservado a sala técnica"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="energiaRed"
        campoText="Sistemas de energia redundantes"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="energiaSoc"
        campoText="Energia socorrida"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="alarme"
        campoText="Sistema de alarme e extinção de incêndio"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="climatizacao"
        campoText="Climatização dedicada"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="seguranca"
        campoText="Utilização de métodos de prevenção ou mitigação de malware e outras ciberameaças"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="comunicacaoEx"
        campoText="Comunicação externa segura"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="planoContingencia"
        campoText="Plano contingência"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="planoMudEvolucao"
        campoText="Plano para gerir mudança e evolução da plataforma tecnológica"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>

      <div class="separadorMini">Segurança específica dos sistemas</div>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="privAcesso"
        campoText="Privilégios de acesso"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="catSegDados"
        campoText="Categorias de segurança dos dados"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="rotinaAuditoria"
        campoText="Rotinas de auditoria configuradas"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="logsRotinas"
        campoText="Logs das rotinas periodicamente analisados"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="integridadeInfo"
        campoText="Integridade da informação do sistema"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>

      <div class="separadorMini">Armazenamento</div>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="armazenamento"
        campoText="Armazenamento dedicado"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="replicacaoDados"
        campoText="Replicação de dados"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="backupsRegular"
        campoText="Backups regulares"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="modeloBackup"
        campoText="Modelo do backup"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="qualidadeBackup"
        campoText="Qualidade do backup"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>

      <div class="separadorMini">Documentação</div>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="inventarioSoft"
        campoText="Inventário de Software"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="inventarioHard"
        campoText="Inventário de Hardware"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="documentacaoSis"
        campoText="Documentação dos sistemas"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="documentacaoProc"
        campoText="Documentação de procedimentos"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="controlVersaoDProc"
        campoText="Controlo de versões"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="contratoAtivos"
        campoText="Contratos de manutenção"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="planoRecuperacao"
        campoText="Plano recuperação de dados"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
      <ValidaCampo
        :dadosOriginais="siSpec.caracterizacao"
        :novoHistorico=novoHistorico.sistemasInfo.dados[indexSI].caracterizacao
        campoValue="notas"
        campoText="Notas"
        tipo="string"
      >
        <template v-slot:input="props">
          <v-text-field
            :rules="[(v) => !!v || 'Campo obrigatório']"
            solo
            v-model="props.items.campoEditado"
            @input="props.items.updateValue"
          ></v-text-field> </template
      ></ValidaCampo>
    </v-card>
  </div>
</template>

<script>
import ValidaCampo from "@/components/pedidos/analise/ppd/ValidaCampo";


export default {
  props: ["siSpec", "novoHistorico", "indexSI"],
  components: {
    ValidaCampo,
  },
}

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
