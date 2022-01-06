<template>
  <ConsultaPPD
    :ppd = ppd.data.dados
  />
</template>

<script>
import ConsultaPPD from "@/components/ppd/ConsultaPPD"; // @ is an alias to /src
export default {
    components: {
        ConsultaPPD
    },
    data: () => ({
    id: "",
    ppd: {}
  }),
    created: async function () {
      try {
        this.id = window.location.pathname.split("/")[2];
        this.ppd = await this.$request("get", "/ppd/" + this.id);
      }
      catch (e) {}
    }
}
</script>