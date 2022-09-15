<template>
  <div>
    <el-dialog :title="titleName" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="addForm"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            style="width: 80%"
            placeholder="1-50个字符"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            style="width: 80%"
            placeholder="1-50个字符"
            v-model="formData.code"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            style="width: 80%"
            placeholder="请选择"
            v-model="formData.manager"
            @focus="getEmployeeSimple"
          >
            <el-option
              v-for="item in people"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            style="width: 80%"
            placeholder="1-300个字符"
            type="textarea"
            v-model="formData.introduce"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部 -->
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取 消</el-button>
          <el-button type="primary" size="small" @click="btnOK"
            >确 定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartments,
  addDepartment,
  getDepartDetail,
  editaddDepartment,
} from "@/api/departments.js";
import { getEmployeeSimple } from "@/api/employees.js";

console.log(this);
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    const checkNameRepeated = async (rule, value, callback) => {
      // 名称不能与当前部门下同级部门重复
      // 校验时要更新一次页面数据
      let isRepeated;
      const { depts } = await getDepartments();
      if (this.formData.id) {
        // 编辑模式
        isRepeated = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some((item) => item.name === value);
      } else {
        // 新增模式
        isRepeated = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }
      isRepeated ? callback(new Error("部门名称重复，请更换")) : callback();
    };
    const checkCodeRepeated = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeated;
      if (this.formData.id) {
        // 编辑
        isRepeated = depts
          .filter((item) => item.code !== this.treeNode.code)
          .some((item) => item.code === value && value);
      } else {
        // 新增
        isRepeated = depts.some((item) => item.code === value && value);
      }
      isRepeated ? callback(new Error("部门编码已存在，请更换")) : callback();
    };
    return {
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称为必填", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameRepeated },
        ],
        code: [
          { required: true, message: "部门编码为必填", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkCodeRepeated },
        ],
        manager: [
          { required: true, message: "部门负责人为必填", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍为必填", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门编码要求1-300个字符",
            trigger: "blur",
          },
        ],
      },
      people: [],
    };
  },
  computed: {
    titleName() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  methods: {
    async getEmployeeSimple(id) {
      this.people = await getEmployeeSimple(id);
    },
    async getDepartDetail(id) {
      // 获取用户详情,这里为什么需要传id而不直接用props中的id呢，这时已经传来了呀，因为props传值是异步的，可能还没传来
      this.formData = await getDepartDetail(id);
    },
    btnOK() {
      this.$refs.addForm.validate(async (isOK) => {
        if (isOK) {
          //表单校验通过，拿到表单内容fromData进行新增。根据formdata中是否有id判断是新增还是编辑
          if (this.formData.id) {
            // 为编辑
            await editaddDepartment(this.formData);
          } else {
            // 为新增
            await addDepartment({ ...this.formData, pid: this.treeNode.id });
            // 让父组件重新获取数据并关闭dialog
            this.$message.success("新增部门成功");
          }
          this.$emit("addDept");
          this.$emit("update:showDialog", false);
        }
      });
    },
    btnCancel() {
      // 关闭弹层
      this.$emit("update:showDialog", false);
      // 重置表单，清空校验信息
      this.$refs.addForm.resetFields();
      // 这里只是情况了表单绑定的属性，当为编辑模式时，formdata中还有id等属性，要利用此属性给dialog名字，
      // 如果不清空，那么点过编辑之后id会一直存在。再点击新增也是显示编辑
      this.formData = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      };
    },
  },
};
</script>

<style>
</style>