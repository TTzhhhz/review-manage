<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登陆账户设置">
            <el-form
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
              :model="userInfo"
              :rules="rules"
              ref="userInfoForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  style="width: 300px"
                  v-model="userInfo.username"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input
                  style="width: 300px"
                  type="password"
                  v-model="userInfo.password2"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="saveUserInfo">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <user-info></user-info> -->
            <component :is="UserComponent"></component>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JobComponent"></component>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from "@/api/user.js";
import UserInfo from "./components/user-info.vue";
import JobInfo from "./components/job-info.vue";
export default {
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      UserComponent: "UserInfo",
      JobComponent: "JobInfo",
      userInfo: {
        username: "",
        password2: "",
      },
      userId: this.$route.params.id,
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId);
    },
    saveUserInfo() {
      this.$refs.userInfoForm
        .validate()
        .then(async () => {
          await saveUserDetailById({
            ...this.userInfo,
            password: this.userInfo.password2, // 覆盖原有的password
          });
          this.$message.success("修改成功");
        })
        .error((error) => {
          console.log(error.message);
        });
    },
  },
  created() {
    this.getUserDetailById();
  },
};
</script>

<style>
</style>