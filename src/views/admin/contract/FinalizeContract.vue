<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const contracts = ref([])
const selectedContract = ref(null)
const updatedContent = ref('')
const successMessage = ref('')
const userId = localStorage.getItem('userId')

const fetchContracts = async () => {
  const response = await axios.get('/api/contracts/finalize', {
    params: { creatorId: userId }
  })
  contracts.value = response.data
}

const viewContract = (contract) => {
  selectedContract.value = contract
  updatedContent.value = contract.content
}

const finalizeContract = async () => {
  if (!updatedContent.value) {
    alert('请填写修改后的合同内容')
    return
  }
  
  try {
    await axios.post('/api/contracts/finalize', {
      contractId: selectedContract.value.id,
      updatedContent: updatedContent.value
    })
    
    successMessage.value = '合同定稿成功'
    await fetchContracts()
    
    setTimeout(() => {
      selectedContract.value = null
      updatedContent.value = ''
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    alert(error.response?.data || '定稿失败')
  }
}

onMounted(fetchContracts)
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
            <th>起草人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in contracts" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ contract.createdAt }}</td>
            <td>{{ contract.creatorName }}</td>
            <td>
              <button @click="viewContract(contract)" class="btn btn-secondary">定稿</button>
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
        <p><strong>起草日期：</strong>{{ selectedContract.createdAt }}</p>
        <p><strong>起草人：</strong>{{ selectedContract.creatorName }}</p>
      </div>
      
      <div class="mb-4" v-if="selectedContract.countersignComments">
        <h4 class="font-bold mb-2">会签意见</h4>
        <div v-for="(comment, index) in selectedContract.countersignComments.split(';')" :key="index" class="p-3 bg-gray-100 rounded mb-2">
          <p v-if="comment">
            <strong>{{ comment.split('|')[0] }}</strong> ({{ comment.split('|')[1] }})
            <br>
            {{ comment.split('|')[2] }}
          </p>
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
          rows="10" 
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