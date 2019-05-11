<template>
  <div class="contain_wrap">
    <div class="contain">
      <div class="login">
        <div class="login_title">
          <span>账号登录</span>
        </div>
        <div class="login_fields">
          <div class="login_fields__user">
            <div class="icon">
              <img src="../../images/img/user_icon_copy.png">
            </div>
            <input placeholder="用户名" type="text">
            <div class="validation">
              <img src="../../images/img/tick.png">
            </div>
          </div>
          <div class="login_fields__password">
            <div class="icon">
              <img src="../../images/img/lock_icon_copy.png">
            </div>
            <input placeholder="密码" type="password">
            <div class="validation">
              <img src="../../images/img/tick.png">
            </div>
          </div>
          <div class="login_fields__submit">
            <input type="submit" value="登录">
            <div class="forgot"></div>
          </div>
        </div>
        <div class="success">
          <h2>wubo_w3@qq.com</h2>
          <p>欢迎回来</p>
          <p>
            您一共收藏了&nbsp;
            <b>110</b>&nbsp;个单词, 赶快
          </p>
          <p>
            去&nbsp;
            <b id="qrcode">小程序</b>&nbsp;上复习吧
          </p>
          <div class="qrcode_wrap">
            <img src="../../images/img/ycx-mp.jpg">
          </div>
        </div>
        <div class="disclaimer">
          <p>
            Icons made by
            <a
              href="https://www.flaticon.com/authors/freepik"
              title="Freepik"
              target="_blank"
            >Freepik</a> from
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              target="_blank"
            >www.flaticon.com</a> is licensed by
            <a
              href="http://creativecommons.org/licenses/by/3.0/"
              title="Creative Commons BY 3.0"
              target="_blank"
            >CC 3.0 BY</a>
          </p>
        </div>
        <p class="switch_wrap">
          <span>划词 &nbsp;</span>
          <el-switch v-model="value3" active-color="#afb1be" inactive-color="#555"></el-switch>
        </p>
      </div>
      <div class="authent">
        <img src="../../images/img/puff.svg">
        <p>登录中</p>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import URL from "url-parse";
import OptionsLoader from "../mixins/options-loader";
import Loader from "./Loader.vue";
import { openExtensionPage } from "../helpers/utils";
import { getActiveTab } from "../helpers/tabs";
import $ from "jquery";

import ui from "../helpers/ui";

const { loading, loginSuccess, onUserInteraction } = ui;
export default {
  mixins: [OptionsLoader],
  data() {
    return {
      radio: "1",
      value3: true
    };
  },
  created() {},
  mounted() {
    onUserInteraction();
    $('input[type="submit"]').click(function() {
      loading();

      setTimeout(() => {
        loginSuccess();
      }, 3000);
    });
    $('#qrcode').hover(()=>{
      $('.qrcode_wrap').fadeIn(500)
    }, ()=>{
      $('.qrcode_wrap').fadeOut(300)
    })
  },
  computed: {},
  methods: {},
  watch: {},
  components: {}
};
</script>
