<script setup>
import { ref } from 'vue'

// 模拟合同数据
const contracts = ref([
  { 
    id: 1, 
    name: '软件开发合同A', 
    code: 'HT2023001',
    customer: '客户公司A', 
    draftDate: '2023-05-10',
    status: '已签订',
    amount: 100000
  },
  { 
    id: 2, 
    name: '设备采购合同B', 
    code: 'HT2023002',
    customer: '客户公司B', 
    draftDate: '2023-05-12',
    status: '审批中',
    amount: 50000
  },
  { 
    id: 3, 
    name: '服务外包合同C', 
    code: 'HT2023003',
    customer: '客户公司C', 
    draftDate: '2023-05-15',
    status: '会签中',
    amount: 80000
  }
])

const searchCode = ref('')
const searchName = ref('')
const searchCustomer = ref('')
const searchStatus = ref('')

const filteredContracts = computed(() => {
  return contracts.value.filter(contract => {
    return (
      (searchCode.value === '' || contract.code.toLowerCase().includes(searchCode.value.toLowerCase())) &&
      (searchName.value === '' || contract.name.toLowerCase().includes(searchName.value.toLowerCase())) &&
      (searchCustomer.value === '' || contract.customer.toLowerCase().includes(searchCustomer.value.toLowerCase())) &&
      (searchStatus.value === '' || contract.status === searchStatus.value)
    )
  })
})

const resetSearch = () => {
  searchCode.value = ''
  searchName.value = ''
  searchCustomer.value = ''
  searchStatus.value = ''
}

// 模拟流程数据
const selectedContract = ref(null)
const contractProcess = ref([
  { stage: '起草', date: '2023-05-10', operator: '张三', status: '完成' },
  { stage: '会签', date: '2023-05-13', operator: '李四,王五', status: '完成' },
  { stage: '定稿', date: '2023-05-15', operator: '张三', status: '完成' },
  { stage: '审批', date: '2023-05-18', operator: '赵六', status: '完成' },
  { stage: '签订', date: '2023-05-20', operator: '张三', status: '完成' }
])

const viewProcess = (contract) => {
  selectedContract.value = contract
}

import { computed } from 'vue'
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">查询统计</h2>
    
    <div v-if="!selectedContract">
      <div class="card mb-6">
        <h3 class="text-xl font-bold mb-4">合同信息查询</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="search-code">
              合同编号
            </label>
            <input 
              id="search-code"
              v-model="searchCode"
              class="form-control"
              type="text" 
              placeholder="请输入合同编号"
            >
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="search-name">
              合同名称
            </label>
            <input 
              id="search-name"
              v-model="searchName"
              class="form-control"
              type="text" 
              placeholder="请输入合同名称"
            >
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="search-customer">
              客户名称
            </label>
            <input 
              id="search-customer"
              v-model="searchCustomer"
              class="form-control"
              type="text" 
              placeholder="请输入客户名称"
            >
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="search-status">
              合同状态
            </label>
            <select 
              id="search-status"
              v-model="searchStatus"
              class="form-control"
            >
              <option value="">全部</option>
              <option value="起草中">起草中</option>
              <option value="会签中">会签中</option>
              <option value="定稿中">定稿中</option>
              <option value="审批中">审批中</option>
              <option value="已签订">已签订</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button @click="resetSearch" class="btn btn-secondary mr-2">重置</button>
          <button class="btn btn-primary">查询</button>
        </div>
      </div>
      
      <div class="card">
        <h3 class="text-xl font-bold mb-4">查询结果</h3>
        
        <div v-if="filteredContracts.length === 0" class="text-center p-4">
          <p>暂无符合条件的合同</p>
        </div>
        
        <table v-else class="table">
          <thead>
            <tr>
              <th>合同编号</th>
              <th>合同名称</th>
              <th>客户名称</th>
              <th>起草日期</th>
              <th>合同状态</th>
              <th>合同金额</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contract in filteredContracts" :key="contract.id">
              <td>{{ contract.code }}</td>
              <td>{{ contract.name }}</td>
              <td>{{ contract.customer }}</td>
              <td>{{ contract.draftDate }}</td>
              <td>{{ contract.status }}</td>
              <td>{{ contract.amount.toLocaleString() }}元</td>
              <td>
                <button @click="viewProcess(contract)" class="btn btn-secondary">查看流程</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同流程查询</h3>
      
      <div class="mb-4">
        <p><strong>合同编号：</strong>{{ selectedContract.code }}</p>
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>合同状态：</strong>{{ selectedContract.status }}</p>
      </div>
      
      <h4 class="font-bold mb-2">流程记录</h4>
      
      <table class="table">
        <thead>
          <tr>
            <th>流程阶段</th>
            <th>处理日期</th>
            <th>处理人</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(process, index) in contractProcess" :key="index">
            <td>{{ process.stage }}</td>
            <td>{{ process.date }}</td>
            <td>{{ process.operator }}</td>
            <td>{{ process.status }}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="mt-4">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
      </div>
    </div>
  </div>
</template>
