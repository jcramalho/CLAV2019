<template>
    <v-toolbar app color="indigo darken-4" dark>
      <v-toolbar-title class="headline">
        <span class="text-uppercase">CLAV</span>
        <span class="font-weight-light"> - Classificação e Avaliação da Informação Pública</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-menu :nudge-width="100">
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <span>Classes</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>
        </template>

        <v-list>
          <v-list-tile
            v-for="item in classeOps"
            :key="item"
            @click="true"
          >
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu :nudge-width="100">
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <span>Entidades</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>
        </template>

        <v-list>
          <v-list-tile
            v-for="item in entidadeOps"
            :key="item"
            @click="true"
          >
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu :nudge-width="100">
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <span>Tipologias</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>
        </template>

        <v-list>
          <v-list-tile
            v-for="item in tipologiaOps"
            :key="item"
            @click="true"
          >
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-menu :nudge-width="100">
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <span>Legislação</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>
        </template>

        <v-list>
          <v-list-tile
            v-for="item in legislacaoOps"
            :key="item"
            @click="true"
          >
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
</template>
