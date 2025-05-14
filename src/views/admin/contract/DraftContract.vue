<script setup>
import { ref } from 'vue'

const contractName = ref('')
const customerName = ref('')
const startDate = ref('')
const content = ref('')
const file = ref(null)
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleFileChange = (event) => {
  file.value = event.target.files[0]
}

const submitForm = async () => {
  const creatorId = localStorage.getItem('userId');
  const formData = new FormData();
  formData.append('contractName', contractName.value);
  formData.append('customerName', customerName.value);
  formData.append('startDate', startDate.value);
  formData.append('content', content.value);
  formData.append('creatorId', creatorId); // 添加creatorId到表单数据
  if (file.value) {
    formData.append('file', file.value);
  }
    
    const response = await fetch('/api/contracts/draft', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('提交失败')
    }
    
    successMessage.value = '合同起草成功，等待管理员分配'
    
    // 重置表单
    contractName.value = ''
    customerName.value = ''
    startDate.value = ''
    content.value = ''
    file.value = null
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">起草合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="submitForm" class="card">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="contract-name">
          合同名称 <span class="text-red-500">*</span>
        </label>
        <input 
          id="contract-name"
          v-model="contractName"
          class="form-control"
          type="text" 
          placeholder="请输入合同名称"
          required
        >
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="customer-name">
          客户名称 <span class="text-red-500">*</span>
        </label>
        <input 
          id="customer-name"
          v-model="customerName"
          class="form-control"
          type="text" 
          placeholder="请输入客户名称"
          required
        >
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="start-date">
          开始时间 <span class="text-red-500">*</span>
        </label>
        <input 
          id="start-date"
          v-model="startDate"
          class="form-control"
          type="date" 
          required
        >
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
          合同内容 <span class="text-red-500">*</span>
        </label>
        <textarea 
          id="content"
          v-model="content"
          class="form-control"
          rows="6" 
          placeholder="请输入合同内容"
          required
        ></textarea>
      </div>
      
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="file">
          合同附件
        </label>
        <input 
          id="file"
          type="file"
          @change="handleFileChange"
          class="form-control"
          accept=".doc,.docx,.jpg,.jpeg,.png,.bmp,.gif"
        >
        <p class="text-sm text-gray-500">支持的格式：doc, jpg, jpeg, png, bmp, gif</p>
      </div>
      
      <div>
        <button 
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? '提交中...' : '提交' }}
        </button>
      </div>
    </form>
  </div>
</template>