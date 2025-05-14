<script setup>
import { ref } from 'vue'

// 模拟待会签合同列表
const contracts = ref([
  { id: 1, name: '软件开发合同A', customer: '客户公司A', draftDate: '2023-05-10', drafter: '张三' },
  { id: 2, name: '设备采购合同B', customer: '客户公司B', draftDate: '2023-05-12', drafter: '李四' },
  { id: 3, name: '服务外包合同C', customer: '客户公司C', draftDate: '2023-05-15', drafter: '王五' }
])

const selectedContract = ref(null)
const opinion = ref('')
const successMessage = ref('')

const viewContract = (contract) => {
  selectedContract.value = contract
  opinion.value = ''
}

const submitOpinion = () => {
  if (!opinion.value) {
    alert('请填写会签意见')
    return
  }
  
  // 模拟提交
  successMessage.value = '会签意见提交成功'
  
  // 从列表中移除已会签的合同
  contracts.value = contracts.value.filter(c => c.id !== selectedContract.value.id)
  
  // 重置
  setTimeout(() => {
    selectedContract.value = null
    opinion.value = ''
    successMessage.value = ''
  }, 2000)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">会签合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待会签合同列表</h3>
      
      <div v-if="contracts.length === 0" class="text-center p-4">
        <p>暂无待会签合同</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>合同名称</th>
            <th>客户名称</th>
            <th>起草日期</th>
            <th>起草人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ contract.draftDate }}</td>
            <td>{{ contract.drafter }}</td>
            <td>
              <button @click="viewContract(contract)" class="btn btn-secondary">查看</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同详情</h3>
      
      <div class="mb-4">
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>起草日期：</strong>{{ selectedContract.draftDate }}</p>
        <p><strong>起草人：</strong>{{ selectedContract.drafter }}</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-bold mb-2">合同内容</h4>
        <div class="p-4 bg-gray-100 rounded">
          <p>这里是合同{{ selectedContract.name }}的详细内容...</p>
          <p>包含了合同的各项条款、双方责任和义务等信息。</p>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="opinion">
          会签意见 <span class="text-red-500">*</span>
        </label>
        <textarea 
          id="opinion"
          v-model="opinion"
          class="form-control"
          rows="4" 
          placeholder="请输入您的会签意见"
          required
        ></textarea>
      </div>
      
      <div class="flex justify-between">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
        <button @click="submitOpinion" class="btn btn-primary">提交会签意见</button>
      </div>
    </div>
  </div>
</template>
