<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools
          :treeNode="company"
          :isRoot="true"
          @showDialog="addDept"
        ></tree-tools>
        <el-tree :data="departs" :props="defaultProps">
          <tree-tools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @showDialog="addDept"
            @editDept="editDept"
          ></tree-tools>
        </el-tree>
      </el-card>
    </div>
    <add-dept
      :showDialog.sync="showDialog"
      :treeNode="currentDept"
      @addDept="getDepartments"
      ref="addDept"
    ></add-dept>
  </div>
</template>

<script>
import TreeTools from "./component/tree-tools.vue";
import { getDepartments } from "@/api/departments.js";
import { transListToTreeData } from "@/utils/index.js";
import AddDept from "./component/add-dept.vue";
export default {
  components: {
    TreeTools,
    AddDept,
  },
  data() {
    return {
      showDialog: false,
      company: {
        name: "",
        manager: "负责人",
        id: "", // id主要是用于头部添加部门规则的校验
      },
      departs: [],
      defaultProps: {
        label: "name", // 表示 从这个属性显示内容
      },
      currentDept: null,
    };
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.company.name = result.companyName;
      this.departs = transListToTreeData(result.depts, "");
      // depts需要经过处理转化为树形结构才能赋给this.departs
    },
    addDept(currentDept) {
      this.showDialog = true;
      this.currentDept = currentDept;
    },
    editDept(currentDept) {
      this.showDialog = true;
      this.currentDept = currentDept;
      // 利用currentDept的id，父组件调用子组件方法
      this.$refs.addDept.getDepartDetail(currentDept.id);
    },
  },
  created() {
    this.getDepartments();
  },
};
</script>

<style scoped>
/deep/.el-card__body {
  padding: 30px 140px;
}
</style>

