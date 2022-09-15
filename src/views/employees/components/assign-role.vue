<template>
  <el-dialog title="分配角色" :visible.sync="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting.js";
import { getUserDetailById } from "@/api/user.js";
import { assignRoles } from "@/api/employees.js";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      roleList: [], // 存储所有角色
      roleIds: [], // 存储当前用户拥有的角色
    };
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 });
      this.roleList = rows;
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      this.roleIds = roleIds;
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds });
      this.$emit("update:showRoleDialog", false);
    },
    btnCancel() {
      this.$emit("update:showRoleDialog", false);
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style>
</style>