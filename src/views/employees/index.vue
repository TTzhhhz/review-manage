<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :showBefore="true">
        <!-- 左侧显示总记录数 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <!-- 右侧显示按钮 -->
        <template v-slot:after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
            >excel导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >excel导出</el-button
          >
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
            :disabled="!checkPermission('POINT-USER-ADD')"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <el-table v-loading="loading" :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="头像" align="center">
          <template slot-scope="{ row }">
            <img
              v-imagerror="require('@/assets/common/head.jpg')"
              :src="row.staffPhoto"
              alt=""
              style="
                border-radius: 50%;
                width: 100px;
                height: 100px;
                padding: 10px;
              "
              @click="showQrCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column
          label="聘用形式"
          sortable=""
          prop="formOfEmployment"
          :formatter="formatEmployment"
        />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template slot-scope="{ row }">
            <el-switch v-model="row.enableState === 1"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="editRole(row.id)"
              >角色</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deleteEmployeeById(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
          :current-page="page.page"
          :page-size="page.size"
          @current-change="pageChange"
        ></el-pagination>
      </el-row>
    </div>
    <add-employee :showDialog.sync="showDialog"></add-employee>
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>
    <assign-role
      ref="assignRole"
      :showRoleDialog.sync="showRoleDialog"
      :userId="userId"
    ></assign-role>
  </div>
</template>

<script>
import { getEmployeeList, deleteEmployeeById } from "@/api/employees.js";
import EmployeeEnum from "@/api/constant/employees.js"; // 员工
import AddEmployee from "./components/add-employee.vue";
import AssignRole from "./components/assign-role.vue";
import { formatDate } from "@/filters/index.js";
import QrCode from "qrcode";
export default {
  components: {
    AddEmployee,
    AssignRole,
  },
  data() {
    return {
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10, // 每页展示的条数
        total: 0, // 分页总数
      },
      loading: false, // 显示遮罩层
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: null,
    };
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.list = rows;
      this.page.total = total;
      this.loading = false;
    },
    pageChange(currentPage) {
      this.page.page = currentPage;
      this.getEmployeeList();
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async deleteEmployeeById(id) {
      try {
        await this.$confirm("确定删除该员工嘛");
        await deleteEmployeeById(id);
        this.$message.success("删除成功");
        this.getEmployeeList();
      } catch (error) {
        console.log(error);
      }
    },
    exportData() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      // 导出excel方法
      // 懒加载
      import("@/vendor/Export2Excel.js").then(async (excel) => {
        // 所有员工数据
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        // 转化数据格式
        const data = this.formatJson(headers, rows);
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        // excel是引入文件的导出方法组成的对象
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data, // data需要所有数据,list只是当前页面的数据
          filename: "员工工资表",
          multiHeader: multiHeader,
          merges: merges,
        });
      });
    },
    // 员工数据转化为数组套数组的形式
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            // 格式化日期
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = EmployeeEnum.hireType.find(
              (arr) => arr.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true; // 页面的渲染是异步的，拿不到ref
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url);
        });
      } else {
        this.$message.warning("该用户暂未上传头像");
      }
    },
    async editRole(id) {
      await this.$refs.assignRole.getUserDetailById(id);
      this.userId = id;
      this.showRoleDialog = true;
    },
  },
  created() {
    this.getEmployeeList();
  },
};
</script>

<style>
</style>