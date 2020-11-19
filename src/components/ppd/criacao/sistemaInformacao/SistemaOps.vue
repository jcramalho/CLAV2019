<template>
  <v-row>
    <v-col cols="12" xs="12" sm="3">
      <div class="info-label">
        Sistemas de informação
        <InfoBox header="Sistemas de Informação"/></div>
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
                            <div class="info-label">Número SI</div>
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
                            <div class="info-label">Nome SI</div>
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
                            <div class="info-label">Administrador do Sistema</div>
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
                            <div class="info-label">Administrador dos Dados</div>
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
                            <div class="info-label">Proprietário do SI - Entidade pública</div>
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
                            <div class="info-label">Proprietário do SI - Entidade privada</div>
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
                            <div class="info-label">Proprietário dos dados</div>
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
                            <div class="info-label">Localização dos dados - Entidade pública</div>
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
                            <div class="info-label">Localização dos dados - Entidade privada</div>
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
                            <div class="info-label">Definição formal de responsabilidades</div>
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
                            <div class="info-label">Insourcing</div>
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
                            <div class="info-label">Outsourcing</div>
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
                            <div class="info-label">Notas</div>
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
                            <div class="info-label">Descrição</div>
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
                            <div class="info-label">Decomposição</div>
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
                            <div class="info-label">Código de classificação da classe / série</div>
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
                            <div class="info-label">N.º de ref.ª da classe / série</div>
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
                            <div class="info-label">Título da classe / série</div>
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
                            <div class="info-label">PCA da classe / série</div>
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
                            <div class="info-label">Forma de contagem dos prazos</div>
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
                            <div class="info-label">Destino Final da classe / série</div>
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
                            <div class="info-label">PCA do SI</div>
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
                            <div class="info-label">Destino final do SI</div>
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
                            <div class="info-label">SI relacionado: n.º de referência</div>
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
                            <div class="info-label">SI relacionado: tipo de relação</div>
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
                            <div class="info-label">Atividade do SI</div>
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
                            <div class="info-label">Grau de utilização do SI</div>
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
                            <div class="info-label">Criticidade do SI</div>
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
                            <div class="info-label">SI é objeto de preservação</div>
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
                            <div class="info-label">Notas</div>
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
                          <v-col cols="12" xs="12" sm="12">
                              <div class="separadorMini">Dependência</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="3" >
                            <div class="info-label">Nível de dependência do Software</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="9" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.dependenciaSoft"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Categoria dos dados</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.categoriaDados"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Formatos</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.formatos"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                              <div class="separadorMini">Crescimento do</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Modelo de crescimento</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.modeloCres"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Dimensão atual</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.dimensao"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Crescimento anual</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.crescimento"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                              <div class="separadorMini">Segurança geral da plataforma</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Localização de Sistema</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.localSistema"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Sala técnica</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.salaTec"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Acesso reservado a sala técnica</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.acessoSalaTec"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Sistemas de energia redundantes</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.energiaRed"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Energia socorrida</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.energiaSoc"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Sistema de alarme e extinção de incêndio</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.alarme"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Climatização dedicada</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.climatizacao"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Utilização de métodos de prevenção ou mitigação de malware e outras ciberameaças</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.seguranca"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Comunicação externa segura</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.comunicacaoEx"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Plano contingência</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.planoContingencia"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Plano para gerir mudança e evolução da plataforma tecnológica</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.planoMudEvolucao"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                              <div class="separadorMini">Segurança específica dos sistemas</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Privilégios de acesso</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.privAcesso"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Categorias de segurança dos dados</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.catSegDados"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Rotinas de auditoria configuradas</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.rotinaAuditoria"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Logs das rotinas periodicamente analisados</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.logsRotinas"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Integridade da informação do sistema</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.integridadeInfo"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                              <div class="separadorMini">Armazenamento</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Armazenamento dedicado</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.armazenamento"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Replicação de dados</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.replicacaoDados"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Backups regulares</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.backupsRegular"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Modelo do backup</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.modeloBackup"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Qualidade do backup</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.qualidadeBackup"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12" >
                            <div class="separadorMini">Documentação</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Inventário de Software</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.inventarioSoft"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Inventário de Hardware</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.inventarioHard"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Documentação dos sistemas</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.documentacaoSis"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Documentação de procedimentos</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.documentacaoProc"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Controlo de versões</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.controlVersaoDProc"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Contratos de manutenção</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.contratoAtivos"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Plano recuperação de dados</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.planoRecuperacao"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" xs="12" sm="2" >
                            <div class="info-label">Notas</div>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" >
                            <v-text-field
                              label="Não possui"
                              :value="siSpec.caracterizacao.notas"
                              readonly
                              solo
                              dense
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <div class="separador">Estratégia</div>

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
        identificacao:{},
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
      this.siSpec = item;
      if(item.visto){
        this.siSpec.identificacao.adminSistema= item.identificacao.adminSistema.map(e => e.sigla).toString()
        this.siSpec.identificacao.adminDados= item.identificacao.adminDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propSistemaPublico= item.identificacao.propSistemaPublico.map(e => e.sigla).toString(),
        this.siSpec.identificacao.propDados= item.identificacao.propDados.map(e => e.sigla).toString(),
        this.siSpec.identificacao.localDadosPublico= item.identificacao.localDadosPublico.map(e => e.sigla).toString()
        item.visto=false;
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
