import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import "./assets/main.css"

// 路由配置
import Login from "./views/Login.vue"
import Register from "./views/Register.vue"
import WaitingForApproval from "./views/WaitingForApproval.vue"
import AdminDashboard from "./views/admin/Dashboard.vue"
import OperatorDashboard from "./views/operator/Dashboard.vue"

// 管理员页面
import ContractManagement from "./views/admin/ContractManagement.vue"
import DraftContract from "./views/admin/contract/DraftContract.vue"
import CountersignContract from "./views/admin/contract/CountersignContract.vue"
import FinalizeContract from "./views/admin/contract/FinalizeContract.vue"
import ApproveContract from "./views/admin/contract/ApproveContract.vue"
import SignContract from "./views/admin/contract/SignContract.vue"
import QueryStatistics from "./views/admin/QueryStatistics.vue"
import BasicDataManagement from "./views/admin/BasicDataManagement.vue"
import SystemManagement from "./views/admin/SystemManagement.vue"
import AssignContract from "./views/admin/system/AssignContract.vue"
import PermissionManagement from "./views/admin/system/PermissionManagement.vue"
import LogManagement from "./views/admin/system/LogManagement.vue"

// 操作员页面
import OperatorContractManagement from "./views/operator/ContractManagement.vue"
import OperatorQueryStatistics from "./views/operator/QueryStatistics.vue"
import OperatorBasicDataManagement from "./views/operator/BasicDataManagement.vue"
import OperatorApproveContract from "./views/operator/contract/ApproveContract.vue"

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/waiting-approval", component: WaitingForApproval },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "contract", component: ContractManagement },
      { path: "contract/draft", component: DraftContract },
      { path: "contract/countersign", component: CountersignContract },
      { path: "contract/finalize", component: FinalizeContract },
      { path: "contract/approve", component: ApproveContract },
      { path: "contract/sign", component: SignContract },
      { path: "query", component: QueryStatistics },
      { path: "basic-data", component: BasicDataManagement },
      { path: "system", component: SystemManagement },
      { path: "system/assign", component: AssignContract },
      { path: "system/permissions", component: PermissionManagement },
      { path: "system/logs", component: LogManagement },
    ],
  },
  {
    path: "/operator",
    component: OperatorDashboard,
    meta: { requiresAuth: true, role: "operator" },
    children: [
      { path: "contract", component: OperatorContractManagement },
      { path: "contract/approve", component: OperatorApproveContract },
      { path: "query", component: OperatorQueryStatistics },
      { path: "basic-data", component: OperatorBasicDataManagement },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("user")

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login")
  } else if (isAuthenticated && (to.path === "/login" || to.path === "/register")) {
    const user = JSON.parse(isAuthenticated)
    if (user.role === "admin") {
      next("/admin/contract")
    } else if (user.role === "operator") {
      next("/operator/contract")
    } else {
      next("/waiting-approval")
    }
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount("#app")
