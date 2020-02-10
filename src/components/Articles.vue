<template>
  <article>
    {{ text }}
    <!-- thanks to https://cloudfour.com/thinks/when-7-kb-equals-7-mb/ for -->
    <img :src="img" crossorigin="anonymous" />
  </article>
</template>

<script>
import axios from "axios";

export default {
  name: "Articles.",
  data() {
    return {
      msg: undefined,
      text: undefined,
      img: undefined
    };
  },
  mounted() {
    axios.get("http://localhost:5051/article/buildings").then(response => {
      this.msg = response.data.msg;
      this.text = response.data.article.text;
      this.img = response.data.article.img;
    });

    const updateChannel = new BroadcastChannel("wbu-channel");
    this.imgUpdate = 1;
    updateChannel.addEventListener("message", event => {
      if (event.data.payload.updatedUrl === this.img) {
        this.img = `${this.img}?upd=${this.imgUpdate}`;
        this.imgUpdate++;
      }
    });
  }
};
</script>

<style lang="scss"></style>
