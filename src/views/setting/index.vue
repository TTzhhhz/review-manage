<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <el-table border :data="roleList">
              <el-table-column
                label="序号"
                width="120"
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="角色"
                width="240"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="描述"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    type="success"
                    size="small"
                    @click="assignPermission(row.id)"
                    >分配</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    size="small"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                layout="prev, pager, next"
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                @current-change="changePage"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert
              title="下头内容不得改"
              type="info"
              :closable="false"
              :show-icon="true"
            >
            </el-alert>
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.companyAddress"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.companyPhone"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.mailbox"
                ></el-input>
              </el-form-item>
              <el-form-item label="remarks">
                <el-input
                  style="width: 400px"
                  disabled
                  type="textarea"
                  :rows="3"
                  v-model="formData.remarks"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form :model="roleForm" :rules="rules" ref="roleForm">
        <el-form-item label="角色名称" label-width="100px" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="showPermDialog"
      title="分配权限"
      @close="btnPermCancel"
    >
      <el-tree
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        node-key="id"
        :default-checked-keys="selectedCheck"
        check-strictly
        show-checkbox
        ref="permTree"
      ></el-tree>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnPermCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnPermOk"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting.js";
import { mapGetters } from "vuex";
import { getPermissionList } from "@/api/permission.js";
import { transListToTreeData } from "@/utils/index.js";
export default {
  data() {
    return {
      roleList: [], // 接受角色数组
      page: {
        page: 1, //当前页码
        pagesize: 5, // 每页展示的数据条数
        total: 0, // 数据总数
      }, //放置页码相关数据
      formData: {},
      showDialog: false, //控制弹层显示
      showPermDialog: false, // 控制分配权限的显示和隐藏
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
      permData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      selectedCheck: [],
      roleId: null, // 记录当前分配权限的id
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.roleList = rows;
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    changePage(newPage) {
      // newPage为当前点击的页码
      this.page.page = newPage;
      this.getRoleList();
    },
    async deleteRole(id) {
      try {
        await this.$confirm("确认删除该角色嘛");
        await deleteRole(id);
        // 刷新页面
        this.getRoleList();
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    async editRole(id) {
      // 先获取数据
      this.roleForm = await getRoleDetail(id);
      // 显示弹层
      this.showDialog = true;
    },
    async assignPermission(id) {
      this.roleId = id;
      this.permData = transListToTreeData(await getPermissionList(), "0");
      const { permIds } = await getRoleDetail(id);
      this.selectedCheck = permIds;
      this.showPermDialog = true;
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        // 判断新增还是编辑
        if (this.roleForm.id) {
          // 编辑
          // 校验成功才会执行
          await updateRole(this.roleForm);
        } else {
          // 新增
          await addRole(this.roleForm);
        }
        // 重新拉取数据
        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        // 校验失败
        console.log(error);
      }
    },
    btnCancel() {
      this.roleForm = {
        name: "",
        description: "",
      };
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },
    async btnPermOk() {
      console.log(this.$refs.permTree.getCheckedKeys());
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.showPermDialog = false;
    },
    btnPermCancel() {
      this.selectedCheck = [];
      this.showPermDialog = false;
    },
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
};
</script>

<style>
</style>