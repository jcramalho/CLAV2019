<template>
  <v-col cols="auto">
    <span v-if="!hide">
      <v-icon
        v-if="validate"
        class="mr-1"
        color="green"
        @click="validate(campo)"
      >
        check
      </v-icon>
      <v-icon
        v-if="invalidate"
        class="mr-1"
        color="red"
        @click="invalidate(campo)"
      >
        clear
      </v-icon>
    </span>
    <v-icon v-if="edit" class="mr-1" color="orange" @click="edit(campo)">
      create
    </v-icon>
    <v-icon v-if="comment" @click="comment(campo)">
      add_comment
    </v-icon>
  </v-col>
</template>

<script>
export default {
  props: {
    hide: {
      type: Boolean,
      default: false
    },
    campo: String,
    validate: Function,
    invalidate: Function,
    edit: Function,
    comment: Function
  }
};
</script>
