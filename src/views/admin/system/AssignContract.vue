<script setup>
import { ref, onMounted } from 'vue'

const contracts = ref([])
const users = ref([])
const selectedContract = ref(null)
const countersignUsers = ref([])
const approvalUser = ref('')
const successMessage = ref('')

// 获取待分配合同列表
const fetchAssignableContracts = async () => {
  const response = await fetch('/api/contracts/assignable')
  contracts.value = await response.json()
}

// 获取可分配用户列表（管理员和操作员）
const fetchAssignableUsers = async () => {
  const response = await fetch('/api/auth/assignable-users')
  users.value = await response.json()
}

// 使用多选组件管理选择
const toggleCountersignUser = (userId) => {
  const index = countersignUsers.value.indexOf(userId)
  if (index === -1) {
    countersignUsers.value.push(userId)
  } else {
    countersignUsers.value.splice(index, 1)
  }
}

const submitAssignment = async () => {
  if (!validateSelection()) return
  // 强制转换为纯数组（防止Proxy对象）
  const countersignIds = JSON.parse(JSON.stringify(countersignUsers.value))
  
  
  const assignmentData = {
    contractId: selectedContract.value.id,
    countersignUserIds: countersignUsers.value, // 确保这是数组
    approvalUserId: approvalUser.value
  };

  // 调试输出
  console.log('提交数据:', {
    contractId: selectedContract.value.id,
    countersignUserIds: countersignIds, // 确保是如 [1,2,3] 的格式
    approvalUserId: approvalUser.value
  })
  
  try {
    const response = await fetch('/api/contracts/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractId: selectedContract.value.id,
        countersignUserIds: countersignIds, // 使用处理后的数组
        approvalUserId: approvalUser.value
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '分配失败')
    }
    
    successMessage.value = '分配成功！'
    await fetchAssignableContracts()
    resetForm()
  } catch (error) {
    alert(error.message)
  }
}

// 验证选择
const validateSelection = () => {
  if (countersignUsers.value.length === 0) {
    alert('请至少选择一名会签人员')
    return false
  }
  if (!approvalUser.value) {
    alert('请选择审批人员')
    return false
  }
  return true
}

// 重置表单
const resetForm = () => {
  setTimeout(() => {
    selectedContract.value = null
    countersignUsers.value = []
    approvalUser.value = ''
    successMessage.value = ''
  }, 2000)
}

onMounted(() => {
  fetchAssignableContracts()
  fetchAssignableUsers()
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-6">合同分配</h2>
    
    <!-- 成功消息 -->
    <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
      {{ successMessage }}
    </div>
    
    <!-- 合同列表 -->
    <div v-if="!selectedContract">
      <h3 class="text-xl font-semibold mb-4">待分配合同</h3>
      <div v-if="contracts.length === 0" class="text-gray-500">
        暂无待分配合同
      </div>
      <table v-else class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 text-left">合同名称</th>
            <th class="p-2 text-left">客户</th>
            <th class="p-2 text-left">起草人</th>
            <th class="p-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id" class="border-b">
            <td class="p-2">{{ contract.name }}</td>
            <td class="p-2">{{ contract.customer }}</td>
            <td class="p-2">{{ contract.drafter }}</td>
            <td class="p-2">
              <button 
                @click="selectedContract = contract"
                class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                分配
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分配表单 -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold">分配合同：{{ selectedContract.name }}</h3>
        <button @click="selectedContract = null" class="text-gray-500 hover:text-gray-700">
          ← 返回列表
        </button>
      </div>
      
      <!-- 合同基本信息 -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">合同编号</label>
          <p>{{ selectedContract.code || '-' }}</p>
        </div> -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">起草日期</label>
          <p>{{ new Date(selectedContract.createdAt).toLocaleDateString() }}</p>
        </div>
      </div>
      
      <!-- 会签人员多选 -->
      <div class="space-y-2">
        <div v-for="user in users" :key="user.id" class="flex items-center">
          <input 
            type="checkbox" 
            v-model="countersignUsers"
            :value="user.id"
            :id="'user-'+user.id"
            class="mr-2"
          >
          <label :for="'user-'+user.id">
            {{ user.username }} ({{ user.role === 'admin' ? '管理员' : '操作员' }})
          </label>
        </div>
      </div>
            
      <!-- 审批人员选择 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          审批人员 <span class="text-red-500">*</span>
        </label>
        <select 
          v-model="approvalUser"
          class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">请选择审批人员</option>
          <option 
            v-for="user in users" 
            :key="user.id" 
            :value="user.id"
            class="flex items-center"
          >
            {{ user.username }} ({{ user.role === 'admin' ? '管理员' : '操作员' }})
          </option>
        </select>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button 
          @click="selectedContract = null"
          class="px-4 py-2 border rounded hover:bg-gray-50"
        >
          取消
        </button>
        <button 
          @click="submitAssignment"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          确认分配
        </button>
      </div>
    </div>
  </div>
</template>