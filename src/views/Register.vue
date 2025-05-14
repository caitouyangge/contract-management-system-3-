<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const role = ref('')
const errorMessage = ref('')

const register = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
    const response = await axios.post('http://localhost:8080/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      role: 'newuser'
    })

    if (response.data === '注册成功') {
      router.push('/waiting-approval')  // 注册成功跳转等待
    } else {
      errorMessage.value = response.data // 例如：用户名已存在
    }
  
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">注册账号</h1>
      
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="register">
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
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            电子邮箱
          </label>
          <input 
            id="email"
            v-model="email"
            class="form-control"
            type="email" 
            placeholder="请输入电子邮箱"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            密码
          </label>
          <input 
            id="password"
            v-model="password"
            class="form-control"
            type="text" 
            placeholder="请输入密码"
            required
          >
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">
            确认密码
          </label>
          <input 
            id="confirm-password"
            v-model="confirmPassword"
            class="form-control"
            type="text" 
            placeholder="请再次输入密码"
            required
          >
        </div>
        
        <!-- <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            注册角色
          </label> -->
          <!-- <div class="flex items-center">
            <input 
              id="operator"
              v-model="role"
              type="radio" 
              value="operator"
              class="mr-2"
            >
            <label for="operator" class="mr-4">合同操作员</label>
            
            <input 
              id="admin"
              v-model="role"
              type="radio" 
              value="admin"
              class="mr-2"
            >
            <label for="admin">合同管理员</label>
          </div>
        </div> -->
        
        <div class="flex items-center justify-between">
          <button 
            class="btn btn-primary w-full"
            type="submit"
          >
            注册
          </button>
        </div>
      </form>
      
      <div class="mt-4 text-center">
        <p>已有账号？ <a @click="goToLogin" class="text-blue-500 cursor-pointer">立即登录</a></p>
      </div>
    </div>
  </div>
</template>
