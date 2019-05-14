<template>
  <transition name="fade" @after-leave="close">
    <div class="cst-result-toast" v-if="result.show">
      <a href="javascript:;" class="close" @click="hide">&times;</a>
      <div class="cst-result" data-cst-theme="light" :data-cst-status="result.status" v-if="result">
        <h6 class="cst-result-text">{{ result.text}}</h6>

        <div class="ctx_result__loading" v-if="isLoading">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div v-else>
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
              <div class="ctx_result_collect" v-if="data.user_info && data.user_info.token">
                <a href="javascript:;" @click="handleCollct">{{collect_text}}</a>
              </div>
            </div>
          </div>

          <div v-if="data.status ==='failure'">
            <p class="additional">抱歉，无法找到解释。</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { clearSelection } from "../helpers/selection";
import axios from "axios";
export default {
  props: ["result"],
  data() {
    return {
      collect_text: "[收藏]",
      timer: null,
      data: {},
      isLoading: true
    };
  },
  created() {
    this.translate();
  },
  methods: {
    translate() {
      // console.trace("resutl toast translate");
      this.isLoading = true;
      const message = {
        type: "translate",
        text: this.result.text,
        from: "page"
      };
      chrome.runtime.sendMessage(message, result => {
        this.isLoading = false;
        this.data = Object.assign({}, result);
        // console.log(this.data);
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
    },
    handleCollct() {
      if (this.collect_text === "[收藏成功]") {
        return;
      }
      this.collect_text = "[收藏中...]";
      clearTimeout(this.timer);
      let word_id = this.data.word_id;
      let token = this.data.user_info.token;
      axios({
        url: `${REMOTE_HOST}/api/v1/collection`,
        method: "get",
        params: {
          word_id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          this.collect_text = "[收藏成功]";
          this.timer = setTimeout(() => {
            this.result.show = false;
          }, 3 * 1000);
        })
        .catch(err => {
          this.collect_text = "[收藏失败]";
          this.timer = setTimeout(() => {
            this.result.show = false;
          }, 3 * 1000);
        });
    }
  },
  components: {}
};
</script>

