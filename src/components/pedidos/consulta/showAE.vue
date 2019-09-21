<template>

    <v-card class="mt-4">
        <v-card-title class="info-label title" dark>
            {{ p.objeto.acao }} do Auto de Eliminação
        </v-card-title>
        <v-card-text>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Entidade Responsável</div>
              </v-col>
              <v-col>
                <div class="info-content">{{p.objeto.dados.ae.entidade}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Identificação do Responsável</div>
              </v-col>
              <v-col>
                <div class="info-content">{{p.objeto.dados.ae.responsavel}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Fonte de Legitimação</div>
              </v-col>
              <v-col>
                <div class="info-content">{{p.objeto.dados.ae.legislacao}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Fundo</div>
              </v-col>
              <v-col>
                <div class="info-content">{{p.objeto.dados.ae.fundo}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
                <div class="info-label">Zona de Controlo</div>
            </v-row>
                <v-list>
                  <v-list-group
                  class="info-content my-2"
                    v-for="item in p.objeto.dados.ae.zonaControlo"
                    :key="item.codigo"
                    no-action
                  >
                    <template v-slot:activator>
                      <v-list-item-content>
                        <v-list-item-title v-text="'Zona de Controlo - '+item.codigo+' '+item.referencia"></v-list-item-title>
                      </v-list-item-content>
                    </template>
                    
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-row v-if="item.codigo" class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Código da classe</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.codigo}}</div>
                          </v-col>
                        </v-row>
                        <v-row v-if="item.referencia" class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Referencia</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.referencia}}</div>
                          </v-col>
                        </v-row>
                        <v-row v-if="item.ni" class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Natureza de intervenção</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.ni}}</div>
                          </v-col>
                        </v-row>
                        <v-row v-if="item.dono" class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Dono do PN</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.dono}}</div>
                          </v-col>
                        </v-row>
                        <v-row class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Data Inicio</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.dataInicio}}</div>
                          </v-col>
                        </v-row>
                        <v-row class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Data Fim</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.dataFim}}</div>
                          </v-col>
                        </v-row>
                        <v-row class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">N.º de agregações</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.agregacoes.length}}</div>
                          </v-col>
                        </v-row>
                        <v-row v-if="item.uiPapel" class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Medição das UI em papel (m.l.)</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.uiPapel}}</div>
                          </v-col>
                        </v-row>
                        <v-row v-if="item.uiDigital" class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Medição das UI em digital (Gb)</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.uiDigital}}</div>
                          </v-col>
                        </v-row>
                        <v-row v-if="item.uiOutros" class="ma-1">
                          <v-col cols="2">
                            <div class="info-label">Medição das UI noutros suportes</div>
                          </v-col>
                          <v-col>
                            <div class="info-content">{{item.uiOutros}}</div>
                          </v-col>
                        </v-row>
                        <v-row class="ma-1">
                            <div class="info-label">Zona de Agregações</div>
                        </v-row>
                            <v-list>
                              <v-list-group
                                class="info-content my-2"
                                  v-for="subItem in item.agregacoes"
                                  :key="subItem.codigo"
                                  no-action
                              >
                                <template v-slot:activator>
                                  <v-list-item-content>
                                    <v-list-item-title v-text="'Agregação '+subItem.codigo"></v-list-item-title>
                                  </v-list-item-content>
                                </template>
                                <v-list-item-content>
                                  <v-list-item-title>
                                    <v-row class="ma-1">
                                      <v-col cols="2">
                                        <div class="info-label">Código da agregação</div>
                                      </v-col>
                                      <v-col>
                                        <div class="info-content">{{subItem.codigo}}</div>
                                      </v-col>
                                    </v-row>
                                    <v-row class="ma-1">
                                      <v-col cols="2">
                                        <div class="info-label">Título da agregação</div>
                                      </v-col>
                                      <v-col>
                                        <div class="info-content">{{subItem.titulo}}</div>
                                      </v-col>
                                    </v-row>
                                    <v-row class="ma-1">
                                      <v-col cols="2">
                                        <div class="info-label">Data de inicio de contagem do PCA</div>
                                      </v-col>
                                      <v-col>
                                        <div class="info-content">{{subItem.dataContagem}}</div>
                                      </v-col>
                                    </v-row>
                                    <v-row v-if="subItem.ni" class="ma-1">
                                      <v-col cols="2">
                                        <div class="info-label">Natureza de intervenção</div>
                                      </v-col>
                                      <v-col>
                                        <div class="info-content">{{subItem.ni}}</div>
                                      </v-col>
                                    </v-row>
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-group>
                            </v-list>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-group>
                </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
  props: ["p"],

  data: () => ({
    
  })
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
</style>