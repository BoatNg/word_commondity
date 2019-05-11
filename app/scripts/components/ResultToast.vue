<template>
  <transition name="fade" @after-leave="close">
    <div class="cst-result-toast" v-if="result.show">
      <a href="javascript:;" class="close" @click="hide">&times;</a>
      <div class="cst-result" data-cst-theme="light" :data-cst-status="result.status" v-if="result">
        <h6 class="cst-result-text">{{ result.text}}</h6>
        <div v-if="data.value">
          <p class="cst-result-phonetic" v-if="data.pronounce">
            <span
              v-for="(item, ind) in data.pronounce"
              :key="ind"
            >{{item.type||''}}&nbsp;&nbsp;{{item.value||''}} &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </p>
          <div class="cst-result-translation" v-if="data.translation">
            <ul>
              <li v-for="(item ,ind) in data.translation" :key="ind">{{item.value}}</li>
            </ul>
            <p v-if="data.pos" v-html="data.pos" class="additional"></p>
          </div>
        </div>
        <!-- <div v-else>
          <p class="additional">请稍后...</p>
        </div>-->
        <div v-if="data.status ==='failure'">
          <p class="additional">抱歉，无法找到解释。</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { clearSelection } from "../helpers/selection";

export default {
  props: ["result"],
  data() {
    return {
      timer: null,
      data: {}
    };
  },
  created() {
    this.translate();
  },
  methods: {
    translate() {
      console.trace("resutl toast translate");
      const message = {
        type: "translate",
        text: this.result.text,
        from: "page"
      };
      chrome.runtime.sendMessage(message, result => {
        this.data = Object.assign({}, result);
        console.log(this.data);
        this.timer = setTimeout(() => {
          this.result.show = false;
        }, 8 * 1000);
      });
    },
    hide() {
      clearSelection();
      this.result.show = false;
    },
    close() {
      this.$emit("close");
    }
  },
  components: {}
};
</script>

