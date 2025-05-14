<script setup>
import { ref } from 'vue'

// 模拟待定稿合同列表
const contracts = ref([
  { 
    id: 1, 
    name: '软件开发合同A', 
    customer: '客户公司A', 
    draftDate: '2023-05-10', 
    drafter: '张三',
    countersignStatus: '已完成',
    opinions: [
      { user: '李四', content: '第三条款需要明确交付时间', date: '2023-05-12' },
      { user: '王五', content: '建议增加违约责任条款', date: '2023-05-13' }
    ]
  },
  { 
    id: 2, 
    name: '设备采购合同B', 
    customer: '客户公司B', 
    draftDate: '2023-05-12', 
    drafter: '李四',
    countersignStatus: '进行中',
    opinions: [
      { user: '张三', content: '采购数量需要确认', date: '2023-05-14' }
    ]
  }
])

const selectedContract = ref(null)
const updatedContent = ref('')
const successMessage = ref('')

const viewContract = (contract) => {
  selectedContract.value = contract
  updatedContent.value = `这里是合同${contract.name}的修改后内容...\n根据会签意见已经做了相应调整。`
}

const finalizeContract = () => {
  if (!updatedContent.value) {
    alert('请填写修改后的合同内容')
    return
  }
  
  // 模拟提交
  successMessage.value = '合同定稿成功，已提交审批'
  
  // 从列表中移除已定稿的合同
  contracts.value = contracts.value.filter(c => c.id !== selectedContract.value.id)
  
  // 重置
  setTimeout(() => {
    selectedContract.value = null
    updatedContent.value = ''
    successMessage.value = ''
  }, 2000)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">定稿合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待定稿合同列表</h3>
      
      <div v-if="contracts.length === 0" class="text-center p-4">
        <p>暂无待定稿合同</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>合同名称</th>
            <th>客户名称</th>
            <th>起草日期</th>
            <th>会签状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ contract.draftDate }}</td>
            <td>
              <span 
                :class="contract.countersignStatus === '已完成' ? 'text-green-600' : 'text-yellow-600'"
              >
                {{ contract.countersignStatus }}
              </span>
            </td>
            <td>
              <button 
                @click="viewContract(contract)" 
                class="btn btn-secondary"
                :disabled="contract.countersignStatus !== '已完成'"
              >
                {{ contract.countersignStatus === '已完成' ? '定稿' : '查看' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同定稿</h3>
      
      <div class="mb-4">
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>起草日期：</strong>{{ selectedContract.draftDate }}</p>
        <p><strong>起草人：</strong>{{ selectedContract.drafter }}</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-bold mb-2">会签意见</h4>
        <div v-for="(opinion, index) in selectedContract.opinions" :key="index" class="p-3 bg-gray-100 rounded mb-2">
          <p><strong>{{ opinion.user }}</strong> ({{ opinion.date }})</p>
          <p>{{ opinion.content }}</p>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="updated-content">
          修改后的合同内容 <span class="text-red-500">*</span>
        </label>
        <textarea 
          id="updated-content"
          v-model="updatedContent"
          class="form-control"
          rows="6" 
          placeholder="请根据会签意见修改合同内容"
          required
        ></textarea>
      </div>
      
      <div class="flex justify-between">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
        <button @click="finalizeContract" class="btn btn-primary">提交定稿</button>
      </div>
    </div>
  </div>
</template>
