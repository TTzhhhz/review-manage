<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <el-button
          slot="after"
          type="primary"
          size="small"
          @click="addPermission(1, '0')"
          >添加权限</el-button
        >
      </page-tools>
      <el-table :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column
          label="标识"
          align="center"
          prop="code"
        ></el-table-column>
        <el-table-column
          label="描述"
          align="center"
          prop="description"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              v-if="row.type === 1"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deletePermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增和编辑弹层 -->
    <el-dialog :visible.sync="showDialog" :title="title" @close="btnCancel">
      <el-form
        label-width="80px"
        :model="formData"
        :rules="rules"
        ref="permForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            style="width: 90%"
          ></el-input>
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            style="width: 90%"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  delPermission,
  addPermission,
  updatePermission,
  getPermissionDetail,
} from "@/api/permission.js";
import { transListToTreeData } from "@/utils/index.js";
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    title() {
      return this.formData.id ? "编辑权限" : "新增权限";
    },
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), "0");
    },
    deletePermission(id) {
      this.$confirm("确认删除该权限吗")
        .then(() => {
          return delPermission(id);
        })
        .then(() => {
          this.$message.success("删除成功");
          this.getPermissionList();
        });
    },
    addPermission(type, pid) {
      // type表示类型，访问权还是按钮操作权，pid表示层级
      this.formData.type = type;
      this.formData.pid = pid;
      this.showDialog = true;
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    btnOk() {
      this.$refs.permForm
        .validate()
        .then(() => {
          if (this.formData.id) {
            // 编辑
            return updatePermission(this.formData);
          } else {
            // 新增
            return addPermission(this.formData);
          }
        })
        .then(() => {
          this.$message.success("操作成功");
          this.getPermissionList();
          this.showDialog = false;
        });
    },
    btnCancel() {
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      this.$refs.permForm.resetFields();
      this.showDialog = false;
    },
  },
  created() {
    this.getPermissionList();
  },
};
</script>

<style>
</style>