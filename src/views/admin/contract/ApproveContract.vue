<script setup>
import { ref } from 'vue'

// 模拟待审批合同列表
const contracts = ref([
  { 
    id: 1, 
    name: '软件开发合同A', 
    customer: '客户公司A', 
    finalizeDate: '2023-05-15', 
    finalizer: '张三'
  },
  { 
    id: 2, 
    name: '设备采购合同B', 
    customer: '客户公司B', 
    finalizeDate: '2023-05-16', 
    finalizer: '李四'
  }
])

const selectedContract = ref(null)
const approvalResult = ref('approve') // approve or reject
const approvalComment = ref('')
const successMessage = ref('')

const viewContract = (contract) => {
  selectedContract.value = contract
  approvalResult.value = 'approve'
  approvalComment.value = ''
}

const submitApproval = () => {
  // 模拟提交
  successMessage.value = approvalResult.value === 'approve' 
    ? '合同审批通过，可以进行签订' 
    : '合同审批未通过，已退回修改'
  
  // 从列表中移除已审批的合同
  contracts.value = contracts.value.filter(c => c.id !== selectedContract.value.id)
  
  // 重置
  setTimeout(() => {
    selectedContract.value = null
    approvalComment.value = ''
    successMessage.value = ''
  }, 2000)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">审批合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待审批合同列表</h3>
      
      <div v-if="contracts.length === 0" class="text-center p-4">
        <p>暂无待审批合同</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>合同名称</th>
            <th>客户名称</th>
            <th>定稿日期</th>
            <th>定稿人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ contract.finalizeDate }}</td>
            <td>{{ contract.finalizer }}</td>
            <td>
              <button @click="viewContract(contract)" class="btn btn-secondary">审批</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同审批</h3>
      
      <div class="mb-4">
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>定稿日期：</strong>{{ selectedContract.finalizeDate }}</p>
        <p><strong>定稿人：</strong>{{ selectedContract.finalizer }}</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-bold mb-2">合同内容</h4>
        <div class="p-4 bg-gray-100 rounded">
          <p>这里是合同{{ selectedContract.name }}的定稿内容...</p>
          <p>包含了合同的各项条款、双方责任和义务等信息。</p>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          审批结果 <span class="text-red-500">*</span>
        </label>
        <div class="flex items-center">
          <input 
            id="approve"
            v-model="approvalResult"
            type="radio" 
            value="approve"
            class="mr-2"
          >
          <label for="approve" class="mr-4">通过</label>
          
          <input 
            id="reject"
            v-model="approvalResult"
            type="radio" 
            value="reject"
            class="mr-2"
          >
          <label for="reject">不通过</label>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="approval-comment">
          审批意见
        </label>
        <textarea 
          id="approval-comment"
          v-model="approvalComment"
          class="form-control"
          rows="4" 
          placeholder="请输入审批意见（可选）"
        ></textarea>
      </div>
      
      <div class="flex justify-between">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
        <button @click="submitApproval" class="btn btn-primary">提交审批</button>
      </div>
    </div>
  </div>
</template>
