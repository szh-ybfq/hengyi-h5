<template>
  <div class="register-box" style="padding:20px;">
    <van-form ref="registerRef" @submit="handleRegister">
      <van-field
        v-model="registerForm.username"
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        :rules="usernameRules"
      />
      <van-field
        v-model="registerForm.password"
        name="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        show-password
        :rules="passwordRules"
      />
      <van-field
        v-model="registerForm.confirmPassword"
        name="confirmPassword"
        type="password"
        label="确认密码"
        placeholder="再次输入密码"
        show-password
        :rules="confirmPwdRules"
      />
      <van-field
        v-model="registerForm.nickname"
        name="nickname"
        label="昵称"
        placeholder="请输入昵称"
        :rules="nicknameRules"
      />

      <!-- 头像上传 Vant Uploader -->
      <van-uploader
        v-model="avatarFileList"
        :max-count="1"
        :after-read="handleUploadSuccess"
      />

      <div style="margin:16px 0;">
        <van-button round block type="primary" native-type="submit">注册</van-button>
        <van-button block type="text" @click="$router.push('/login')" style="margin-top:8px">
          已有账号？去登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import request from '@/utils/request'

const router = useRouter()
const registerRef = ref(null)

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  avatar: ''
})
// 头像文件列表
const avatarFileList = ref([])

// =====表单校验规则=====
const usernameRules = [
  { required: true, message: '用户名不能为空' },
  { min: 5, max: 60, message: '用户名长度5~60位' }
]
const passwordRules = [
  { required: true, message: '密码不能为空' },
  { min: 6, max: 60, message: '密码长度6~60位' }
]
const nicknameRules = [
  { required: true, message: '昵称不能为空' },
  { min: 1, max: 50, message: '昵称长度1~50位' }
]
// 自定义校验：两次密码一致
const confirmPwdRules = [
  { required: true, message: '请再次输入密码' },
  {
    validator: (val) => {
      if (val !== registerForm.value.password) {
        return '两次输入密码不一致'
      }
      return true
    }
  }
]

// 上传成功回调
const handleUploadSuccess = async (file) => {
  // vant uploader拿到file，手动调用上传接口
  const formData = new FormData()
  formData.append('file', file.file)
  const res = await request.post('/admin/api/v1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if(res.code ===200){
    registerForm.value.avatar = res.data.url
    showToast('头像上传成功')
  }
}

// 注册提交
const handleRegister = async () => {
  const submitData = { ...registerForm.value }
  delete submitData.confirmPassword
  console.log(submitData)
  const res = await request.post('/register', submitData)
  if (res.code === 200) {
    showToast('注册成功，请登录')
    router.push('/login')
  } else {
    showToast.fail(res.msg || '注册失败')
  }
}
</script>
