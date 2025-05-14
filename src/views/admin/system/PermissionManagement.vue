<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const users = ref([])
const roles = ref([
  { id: 'admin', name: '合同管理员', permissions: ['draft', 'countersign', 'finalize', 'approve', 'sign', 'query', 'assign', 'permission', 'log'] },
  { id: 'operator', name: '合同操作员', permissions: ['draft', 'countersign', 'finalize', 'sign', 'query'] },
  { id: 'newuser', name: '新用户', permissions: [] }
])

const selectedUser = ref(null)
const newRole = ref('')
const successMessage = ref('')

// 获取用户列表
const fetchUsers = async () => {
  try {
    const res = await axios.get('/api/auth/find')
    console.log(res)
    users.value = res.data
    console.log(users.value)
  } catch (err) {
    console.error('获取用户失败:', err)
  }
}

onMounted(fetchUsers)

const editUser = (user) => {
  selectedUser.value = { ...user }
  newRole.value = user.role
}

const updateUserRole = async () => {
  try {
    await axios.put(`/api/auth/${selectedUser.value.username}/role`, {
      role: newRole.value
    })

    // 更新本地数据
    const index = users.value.findIndex(u => u.username === selectedUser.value.username)
    if (index !== -1) {
      users.value[index].role = newRole.value
    }

    successMessage.value = '用户权限更新成功'
    setTimeout(() => {
      selectedUser.value = null
      newRole.value = ''
      successMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('权限更新失败:', err)
  }
}
</script>


<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">权限管理</h2>

    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>

    <div v-if="!selectedUser">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">用户列表</h3>

        <table class="table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="{
                  'text-green-600': user.role === 'admin',
                  'text-blue-600': user.role === 'operator',
                  'text-gray-600': user.role === 'new'
                }">
                  {{ roles.find(r => r.id === user.role)?.name || user.role }}
                </span>
              </td>
              <td>
                <button @click="editUser(user)" class="btn btn-secondary">编辑权限</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">编辑用户权限</h3>

      <div class="mb-4">
        <p><strong>用户名：</strong>{{ selectedUser.username }}</p>
        <p><strong>邮箱：</strong>{{ selectedUser.email }}</p>
        <p><strong>当前角色：</strong>{{ roles.find(r => r.id === selectedUser.role)?.name || selectedUser.role }}</p>
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="new-role">
          分配角色 <span class="text-red-500">*</span>
        </label>
        <select 
          id="new-role"
          v-model="newRole"
          class="form-control"
          required
        >
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </div>

      <div v-if="newRole" class="mb-6">
        <h4 class="font-bold mb-2">该角色拥有的权限：</h4>
        <ul class="list-disc pl-5">
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('draft')">起草合同</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('countersign')">会签合同</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('finalize')">定稿合同</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('approve')">审批合同</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('sign')">签订合同</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('query')">查询合同</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('assign')">分配合同</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('permission')">权限管理</li>
          <li v-if="roles.find(r => r.id === newRole)?.permissions.includes('log')">日志管理</li>
        </ul>
      </div>

      <div class="flex justify-between">
        <button @click="selectedUser = null" class="btn btn-secondary">返回</button>
        <button @click="updateUserRole" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</template>
