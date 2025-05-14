<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-bold">合同管理系统</h2>
        <p class="text-sm">操作员面板</p>
      </div>
      
      <ul class="sidebar-menu">
        <li>
          <router-link to="/operator/contract">合同管理</router-link>
        </li>
        <li><router-link to="/operator/query">查询统计</router-link></li>
        <li><router-link to="/operator/basic-data">基础数据管理</router-link></li>
      </ul>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <header class="header">
        <h1 class="text-xl">操作员控制面板</h1>
        <div class="flex items-center">
          <span class="mr-4">欢迎，{{ user?.username || '操作员' }}</span>
          <button @click="logout" class="btn btn-danger">注销登录</button>
        </div>
      </header>
      
      <div class="p-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
