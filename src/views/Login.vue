<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

import axios from 'axios'

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username.value,
      password: password.value
    })
    console.log('后端响应数据:', response)

    if (response.status === 200 ) {
      // 将用户ID存入localStorage
      localStorage.setItem('userId', response.data.data.id);
      const role = response.data.data.role
      const authorized =response.data.data.authorized
      const user = { username: username.value, role }
      localStorage.setItem('user', JSON.stringify(user))
      console.log(authorized)
      if (role === 'newuser') {
        router.push('/waiting-approval')
      } else {
        router.push(role === 'admin' ? '/admin/contract' : '/operator/contract')
      }
    } else {
      errorMessage.value = response.data.message || '登录失败'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '服务器连接失败'
  }
}


const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">合同管理系统登录</h1>
      
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            用户名
          </label>
          <input 
            id="username"
            v-model="username"
            class="form-control"
            type="text" 
            placeholder="请输入用户名"
            required
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            密码
          </label>
          <input 
            id="password"
            v-model="password"
            class="form-control"
            type="password" 
            placeholder="请输入密码"
            required
          >
        </div>
        
        <div class="flex items-center justify-between">
          <button 
            class="btn btn-primary w-full"
            type="submit"
          >
            登录
          </button>
        </div>
      </form>
      
      <div class="mt-4 text-center">
        <p>还没有账号？ <a @click="goToRegister" class="text-blue-500 cursor-pointer">立即注册</a></p>
      </div>
    </div>
  </div>
</template>
