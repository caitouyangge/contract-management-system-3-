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
        <p class="text-sm">管理员面板</p>
      </div>
      
      <ul class="sidebar-menu">
        <li>
          <router-link to="/admin/contract">合同管理</router-link>
          <ul class="pl-4">
            <li><router-link to="/admin/contract/draft">起草合同</router-link></li>
            <li><router-link to="/admin/contract/countersign">会签合同</router-link></li>
            <li><router-link to="/admin/contract/finalize">定稿合同</router-link></li>
            <li><router-link to="/admin/contract/approve">审批合同</router-link></li>
            <li><router-link to="/admin/contract/sign">签订合同</router-link></li>
          </ul>
        </li>
        <li><router-link to="/admin/query">查询统计</router-link></li>
        <li><router-link to="/admin/basic-data">基础数据管理</router-link></li>
        <li>
          <router-link to="/admin/system">系统管理</router-link>
          <ul class="pl-4">
            <li><router-link to="/admin/system/assign">分配合同</router-link></li>
            <li><router-link to="/admin/system/permissions">权限管理</router-link></li>
            <li><router-link to="/admin/system/logs">日志管理</router-link></li>
          </ul>
        </li>
      </ul>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <header class="header">
        <h1 class="text-xl">管理员控制面板</h1>
        <div class="flex items-center">
          <span class="mr-4">欢迎，{{ user?.username || '管理员' }}</span>
          <button @click="logout" class="btn btn-danger">注销登录</button>
        </div>
      </header>
      
      <div class="p-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
