<template>
  <div>
    <upload-excel :on-success="success"></upload-excel>
  </div>
</template>

<script>
import { importEmployee } from "@/api/employees.js";
export default {
  methods: {
    async success({ header, results }) {
      // 但是这里header属性都是中文，后台需要的是英文的，需要进行转换
      // console.log(header, results);
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      // let arr = [];
      // results.forEach((item) => {
      //   let userInfo = {};
      //   Object.keys(item).forEach((key) => {
      //     userInfo[userRelations[key]] = item[key];
      //   });
      //   arr.push(userInfo);
      // });
      let newArr = results.map((item) => {
        let userInfo = {};
        Object.keys(item).forEach((key) => {
          if (
            userRelations[key] === "timeOfEntry" ||
            userRelations[key] === "correctionTime"
          ) {
            // 后端接口要求不能是字符串，需要转化成时间格式
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], "/")
            );
          } else {
            userInfo[userRelations[key]] = item[key];
          }
        });
        return userInfo;
      });
      console.log(newArr);
      await importEmployee(newArr);
      this.$message.success("导入excel成功");
      this.$router.back();
    },
    // excel具有独特的日期格式，需要进行转化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style>
</style>