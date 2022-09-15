<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :http-request="upload"
      :on-preview="preview"
      :on-remove="remove"
      :on-change="change"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width: 180px"
    ></el-progress>
    <el-dialog :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "AKIDWu52kETUGn58wVpukKflcEcleKlwsZ1E",
  SecretKey: "0lHYaMtBG8l9ICqFQL1SdZGjyxjHaeT2",
});
export default {
  data() {
    return {
      showDialog: false,
      imgUrl: "",
      fileList: [],
      currentFileUid: null, // 记录当前正在上传的图片的uid
      percent: 0,
      showPercent: false,
    };
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    beforeUpload(file) {
      this.showPercent = true;
      // 检查文件类型
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.some((item) => item === file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式");
        return false;
      }
      // 检查文件大小
      const maxsize = 5 * 1024 * 1024;
      if (file.size > maxsize) {
        this.$message.error("图片最大为5M");
        return false;
      }
      this.currentFileUid = file.uid;
      return true;
    },
    upload(params) {
      if (params.file) {
        // 上传操作
        cos.putObject(
          {
            Bucket: "xiaoxin-1311667203", // 存储桶名称
            Region: "ap-chongqing", // 地域
            Key: params.file.name, // 存储在存储桶的名称
            Body: params.file,
            StorageClass: "STANDARD",
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            console.log(err || data);
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentFileUid) {
                  return {
                    url: "http://" + data.Location,
                    upload: true, // 表示这张图片已经上传完毕，为了保存做准备
                  };
                }
                return item;
              });
              // 说明文件上传成功
              setTimeout(() => {
                this.showPercent = false;
                this.percent = 0;
              }, 1000);
            }
          }
        );
      }
    },
    change(file, fileList) {
      this.fileList = fileList.map((item) => item);
    },
    preview(file) {
      // 点击预览会触发
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    remove(file, fileList) {
      // file为删除的文件，fileList为删除后的文件
      this.fileList = fileList;
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>