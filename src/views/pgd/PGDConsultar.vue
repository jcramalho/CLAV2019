<template>
  <div>
    <ConsultarPGD 
      :classes="classes"
    />
  </div>
</template>
<script>
import ConsultarPGD from "@/components/pgd/ConsultarPGD.vue"

export default {
  components: {
    ConsultarPGD
  },
  data: () => ({
    classes: [],
    idPGD: ""
  }),
  created: async function () {
    try {
      this.idPGD = window.location.pathname.split("/")[2];

      var response = await this.$request("get","/pgd/"+this.idPGD)
      this.classes = response.data
    } 
    catch (e) {
      this.classes = []
    }
  }
}
</script>
