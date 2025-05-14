<script setup>
import { ref , computed } from 'vue'

// 模拟客户数据
const customers = ref([
  { id: 1, code: 'KH001', name: '客户公司A', contact: '张先生', phone: '13800138001', address: '北京市海淀区' },
  { id: 2, code: 'KH002', name: '客户公司B', contact: '李女士', phone: '13900139002', address: '上海市浦东新区' },
  { id: 3, code: 'KH003', name: '客户公司C', contact: '王先生', phone: '13700137003', address: '广州市天河区' },
  { id: 4, code: 'KH004', name: '客户公司D', contact: '赵女士', phone: '13600136004', address: '深圳市南山区' }
])

const searchCustomerCode = ref('')
const searchCustomerName = ref('')

const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    return (
      (searchCustomerCode.value === '' || customer.code.toLowerCase().includes(searchCustomerCode.value.toLowerCase())) &&
      (searchCustomerName.value === '' || customer.name.toLowerCase().includes(searchCustomerName.value.toLowerCase()))
    )
  })
})

const resetCustomerSearch = () => {
  searchCustomerCode.value = ''
  searchCustomerName.value = ''
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">基础数据管理</h2>
    
    <div class="card mb-6">
      <h3 class="text-xl font-bold mb-4">客户信息查询</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-customer-code">
            客户编号
          </label>
          <input 
            id="search-customer-code"
            v-model="searchCustomerCode"
            class="form-control"
            type="text" 
            placeholder="请输入客户编号"
          >
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-customer-name">
            客户名称
          </label>
          <input 
            id="search-customer-name"
            v-model="searchCustomerName"
            class="form-control"
            type="text" 
            placeholder="请输入客户名称"
          >
        </div>
      </div>
      
      <div class="flex justify-end mb-4">
        <button @click="resetCustomerSearch" class="btn btn-secondary mr-2">重置</button>
        <button class="btn btn-primary">查询</button>
      </div>
      
      <div v-if="filteredCustomers.length === 0" class="text-center p-4">
        <p>暂无符合条件的客户</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>客户编号</th>
            <th>客户名称</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>地址</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>{{ customer.code }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.contact }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
