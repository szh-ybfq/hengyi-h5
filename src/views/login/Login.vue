<template>
  <div class="login-box" style="padding:20px;">
    <van-form @submit="handleLogin">
      <van-field
        v-model="loginForm.username"
        name="username"
        label="账号"
        placeholder="请输入账号"
        :rules="[{ required: true, message: '请填写账号' }]"
      />
      <van-field
        v-model="loginForm.password"
        name="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        show-password
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin:16px;">
        <van-button round block type="primary" native-type="submit">登录</van-button>
        <van-button block type="text" @click="$router.push('/register')" style="margin-top:8px">
          没有账号？去注册
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
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: ''
})
const handleLogin = async () => {
  try {
    const res = await request.post('/login', loginForm.value)
    console.log('登录返回结果', res)
    // ✅ 改成 res.data.code
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.token)
      userStore.setUserInfo(res.data.data)
      showToast('登录成功')
      router.push('/')
    } else {
      showToast({ type: 'fail', message: res.data.msg || '登录失败' })
    }
  } catch (err) {
    showToast({ type: 'fail', message: '请求异常' })
  }
}


</script>
