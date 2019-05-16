<template>
  <div class="contain_wrap">
    <div class="contain">
      <div class="login">
        <div class="login_title">
          <span>注册或登录</span>
        </div>
        <div class="login_fields">
          <div class="login_fields__user">
            <div class="icon">
              <img src="../../images/img/user_icon_copy.png">
            </div>
            <input placeholder="邮箱" type="text">
            <div class="validation">
              <img src="../../images/img/tick.png">
            </div>
          </div>
          <div class="login_fields__password">
            <div class="icon">
              <img src="../../images/img/lock_icon_copy.png">
            </div>
            <input placeholder="至少6位的密码" type="password">
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
          <h2 id="user_name">您好</h2>
          <p>欢迎回来</p>
          <p>
            您一共收藏了&nbsp;
            <b id="count">0</b>&nbsp;个单词, 赶快
          </p>
          <p>
            去&nbsp;
            <b id="qrcode">小程序</b>&nbsp;上复习吧
          </p>
          <div class="qrcode_wrap">
            <img src="../../images/qrcode.jpg">
          </div>
        </div>
        <div class="disclaimer">
          <p></p>
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
          <el-switch
            v-model="value"
            active-color="#afb1be"
            inactive-color="#555"
            @change="handleChange"
          ></el-switch>
        </p>
      </div>
      <div class="authent">
        <img src="../../images/img/puff.svg">
        <p id="loading_msg">登录中</p>
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
import axios from "axios";

import ui from "../helpers/ui";

const { loading, loginSuccess, onUserInteraction, loginFail } = ui;

export default {
  mixins: [OptionsLoader],
  data() {
    return {
      radio: "1",
      value: true
    };
  },
  created() {},
  mounted() {
    onUserInteraction();
    chrome.storage.sync.get(["user_info", "option_config"], data => {
      let { user_info, option_config } = data;
      // 划词
      if (option_config) {
        if (option_config.is_selection === true) {
          this.value = option_config.is_selection;
        } else if (option_config.is_selection === false) {
          this.value = option_config.is_selection;
        } else {
          this.value = true;
          option_config.is_selection = true;
        }
      }
      if (user_info && user_info.token) {
        let login_time = user_info.login_time;
        let now = new Date().getTime();
        if (now - login_time < 1000 * 60 * 60 * 24 * 7) {
          $(".login>div").hide();
          $("#user_name").text(user_info.email);
          $("#count").text(user_info.words_count);
          $(".success").fadeIn();
          let { token } = user_info;
          axios({
            url: `${REMOTE_HOST}/api/v1/word/count`,
            method: "get",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).then(res => {
            let result = res.data;
            $("#count").text(result.data.count);
            // console.log(res);
          });
          return;
        }
      }
      let email_pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      $('input[type="submit"]').click(function() {
        $("#loading_msg").text("登录中");
        let email = $('input[type="text"]').val();
        let password = $('input[type="password"]').val();
        if (email_pattern.test(email) && /\w{6,}/.test(password)) {
          loading();
          axios
            .post(`${REMOTE_HOST}/api/v1/signup`, {
              email,
              password
            })
            .then(result => {
              const { data } = result;
              // console.log(data);
              if (data.code < 400) {
                setTimeout(() => {
                  let res = data.data;
                  $("#user_name").text(res.email);
                  $("#count").text(res.words_count);
                  res.login_time = new Date().getTime();
                  chrome.storage.sync.set({ user_info: res });
                  loginSuccess();
                }, 2000);
              } else {
                $("#loading_msg").text(">_<密码错误");
                setTimeout(() => {
                  loginFail();
                }, 3000);
              }
            })
            .catch(err => {
              $("#loading_msg").text(">_<登录失败");
              setTimeout(() => {
                loginFail();
              }, 3000);
            });
        }
      });
    });
  },
  computed: {},
  methods: {
    handleChange() {
      let val = this.value;
      chrome.storage.sync.get(["option_config"], data => {
        let { option_config } = data;
        if (!option_config) {
          option_config = {
            is_selection: val
          };
        } else {
          option_config.is_selection = val;
        }
        chrome.storage.sync.set({ option_config });
      });
    }
  },
  watch: {},
  components: {}
};
</script>
