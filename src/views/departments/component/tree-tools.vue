<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span> 操作<i class="el-icon-arrow-down"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('addDepartment')"
                >添加子部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="del"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartment } from "@/api/departments.js";
export default {
  props: {
    treeNode: {
      type: Object,
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleCommand(command) {
      if (command === "add") {
        // 添加子部门的操作
        this.$emit("showDialog", this.treeNode);
      } else if (command === "edit") {
        // 编辑子部门的操作
        this.$emit("editDept", this.treeNode);
      } else {
        // 删除部门的操作
        this.$confirm("您确认要删除该部门嘛", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 调用删除结构，删除成功再提示
            return deleteDepartment(this.treeNode.id);
          })
          .then(() => {
            // 要让父元素重新拉取部门数据
            this.$emit("delDepts");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
      }
    },
  },
};
</script>

<style>
</style>