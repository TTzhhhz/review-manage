<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select
        size="small"
        style="width: 120px"
        v-model="currentYear"
        @change="dateChange"
      >
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        size="small"
        style="width: 120px; margin-left: 10px"
        v-model="currentMonth"
        @change="dateChange"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  data() {
    return {
      yearList: [],
      currentYear: null,
      currentMonth: null,
      currentDate: null,
    };
  },
  methods: {
    dateChange() {
      // 利用当前选中的年月生成最新的事件
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`);
    },
    isWeek(date) {
      // 判断当前日期是否是周末
      return date.getDay() === 6 || date.getDay() === 0;
    },
  },
  filters: {
    getDay(value) {
      const day = value.split("-")[2];
      return day.startsWith("0") ? day.substr(1) : day;
    },
  },
  created() {
    this.currentYear = this.startDate.getFullYear(); // 当前年份
    this.currentMonth = this.startDate.getMonth() + 1;
    this.yearList = Array.from(
      Array(11),
      (value, index) => this.currentYear + index - 5
    );
    this.dateChange();
  },
};
</script>

<style  scoped>
/deep/ .el-calendar-day {
  height: auto;
}
/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
  border: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
/deep/ .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
/deep/ .el-calendar__header {
  display: none;
}
</style>