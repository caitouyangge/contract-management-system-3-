<script setup>
import { ref } from 'vue'

// 模拟待签订合同列表
const contracts = ref([
  { 
    id: 1, 
    name: '软件开发合同A', 
    customer: '客户公司A', 
    approvalDate: '2023-05-18', 
    approver: '赵六'
  },
  { 
    id: 2, 
    name: '设备采购合同B', 
    customer: '客户公司B', 
    approvalDate: '2023-05-19', 
    approver: '钱七'
  }
])

const selectedContract = ref(null)
const signDate = ref('')
const signLocation = ref('')
const customerRepresentative = ref('')
const companyRepresentative = ref('')
const remarks = ref('')
const successMessage = ref('')

const viewContract = (contract) => {
  selectedContract.value = contract
  signDate.value = new Date().toISOString().split('T')[0]
  signLocation.value = ''
  customerRepresentative.value = ''
  companyRepresentative.value = ''
  remarks.value = ''
}

const submitSignInfo = () => {
  if (!signDate.value || !signLocation.value || !customerRepresentative.value || !companyRepresentative.value) {
    alert('请填写所有必填字段')
    return
  }
  
  // 模拟提交
  successMessage.value = '合同签订信息已记录，合同流程完成'
  
  // 从列表中移除已签订的合同
  contracts.value = contracts.value.filter(c => c.id !== selectedContract.value.id)
  
  // 重置
  setTimeout(() => {
    selectedContract.value = null
    signDate.value = ''
    signLocation.value = ''
    customerRepresentative.value = ''
    companyRepresentative.value = ''
    remarks.value = ''
    successMessage.value = ''
  }, 2000)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">签订合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待签订合同列表</h3>
      
      <div v-if="contracts.length === 0" class="text-center p-4">
        <p>暂无待签订合同</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>合同名称</th>
            <th>客户名称</th>
            <th>审批日期</th>
            <th>审批人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ contract.approvalDate }}</td>
            <td>{{ contract.approver }}</td>
            <td>
              <button @click="viewContract(contract)" class="btn btn-secondary">签订</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同签订</h3>
      
      <div class="mb-4">
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>审批日期：</strong>{{ selectedContract.approvalDate }}</p>
        <p><strong>审批人：</strong>{{ selectedContract.approver }}</p>
      </div>
      
      <form @submit.prevent="submitSignInfo">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="sign-date">
            签订日期 <span class="text-red-500">*</span>
          </label>
          <input 
            id="sign-date"
            v-model="signDate"
            class="form-control"
            type="date" 
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="sign-location">
            签订地点 <span class="text-red-500">*</span>
          </label>
          <input 
            id="sign-location"
            v-model="signLocation"
            class="form-control"
            type="text" 
            placeholder="请输入签订地点"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="customer-representative">
            客户方代表 <span class="text-red-500">*</span>
          </label>
          <input 
            id="customer-representative"
            v-model="customerRepresentative"
            class="form-control"
            type="text" 
            placeholder="请输入客户方代表姓名"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="company-representative">
            我方代表 <span class="text-red-500">*</span>
          </label>
          <input 
            id="company-representative"
            v-model="companyRepresentative"
            class="form-control"
            type="text" 
            placeholder="请输入我方代表姓名"
            required
          >
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="remarks">
            备注
          </label>
          <textarea 
            id="remarks"
            v-model="remarks"
            class="form-control"
            rows="3" 
            placeholder="请输入备注信息（可选）"
          ></textarea>
        </div>
        
        <div class="flex justify-between">
          <button type="button" @click="selectedContract = null" class="btn btn-secondary">返回</button>
          <button type="submit" class="btn btn-primary">提交签订信息</button>
        </div>
      </form>
    </div>
  </div>
</template>
