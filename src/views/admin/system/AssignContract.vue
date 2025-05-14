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
  try {
    const response = await fetch('/api/contracts/assignable')
    contracts.value = await response.json()
  } catch (error) {
    console.error('获取合同列表失败:', error)
  }
}

// 获取可分配用户列表
const fetchAssignableUsers = async () => {
  try {
    const response = await fetch('/api/users/assignable')
    users.value = await response.json()
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

const selectContract = (contract) => {
  selectedContract.value = contract
  countersignUsers.value = []
  approvalUser.value = ''
}

const toggleCountersignUser = (userId) => {
  const index = countersignUsers.value.indexOf(userId)
  if (index === -1) {
    countersignUsers.value.push(userId)
  } else {
    countersignUsers.value.splice(index, 1)
  }
}

const submitAssignment = async () => {
  if (countersignUsers.value.length === 0 || !approvalUser.value) {
    alert('请至少选择一名会签人员和一名审批人员')
    return
  }
  
  try {
    const assignmentData = {
      contractId: selectedContract.value.id,
      countersignUserIds: countersignUsers.value,
      approvalUserId: approvalUser.value,
      signUserId: null // 签订人暂不指定
    }
    
    const response = await fetch('/api/contracts/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assignmentData)
    })
    
    if (!response.ok) {
      throw new Error('分配失败')
    }
    
    successMessage.value = '合同分配成功'
    await fetchAssignableContracts()
    
    setTimeout(() => {
      selectedContract.value = null
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('分配失败:', error)
    alert(error.message)
  }
}

// 初始化数据
onMounted(() => {
  fetchAssignableContracts()
  fetchAssignableUsers()
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">分配合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待分配合同列表</h3>
      
      <div v-if="contracts.length === 0" class="text-center p-4">
        <p>暂无待分配合同</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>合同编号</th>
            <th>合同名称</th>
            <th>客户名称</th>
            <th>起草日期</th>
            <th>起草人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id">
            <td>{{ contract.code }}</td>
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ new Date(contract.draftDate).toLocaleDateString() }}</td>
            <td>{{ contract.drafter }}</td>
            <td>
              <button @click="selectContract(contract)" class="btn btn-secondary">分配</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同人员分配</h3>
      
      <div class="mb-4">
        <p><strong>合同编号：</strong>{{ selectedContract.code }}</p>
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>起草人：</strong>{{ selectedContract.drafter }}</p>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          会签人员 <span class="text-red-500">*</span>
          <span class="text-sm text-gray-500">（可多选）</span>
        </label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div v-for="user in users" :key="user.id" class="flex items-center">
            <input 
              :id="`countersign-${user.id}`"
              type="checkbox"
              :checked="countersignUsers.includes(user.id)"
              @change="toggleCountersignUser(user.id)"
              class="mr-2"
            >
            <label :for="`countersign-${user.id}`">
              {{ user.username }} ({{ user.role === 'admin' ? '管理员' : '操作员' }})
            </label>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="approval-user">
          审批人员 <span class="text-red-500">*</span>
        </label>
        <select 
          id="approval-user"
          v-model="approvalUser"
          class="form-control"
          required
        >
          <option value="">请选择审批人员</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.username }} ({{ user.role === 'admin' ? '管理员' : '操作员' }})
          </option>
        </select>
      </div>
      
      <div class="flex justify-between">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
        <button @click="submitAssignment" class="btn btn-primary">提交分配</button>
      </div>
    </div>
  </div>
</template>