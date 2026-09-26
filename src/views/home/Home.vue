<template>
  <div class="home-page" style="padding-bottom:60px">
    <!-- 顶部：搜索 + 分类，固定在页面上方 -->
    <van-search
      v-model="searchKey"
      placeholder="搜索商品名称"
      shape="round"
      @search="onSearch"
      @clear="onClearSearch"
    />
    <!-- 一级分类横向滚动 -->
    <div class="category-scroll-wrap">
      <!-- 固定首页选项，写死在最前面 -->
      <div 
        class="category-item" 
        :class="{active: selectedCid === null}"
        @click="handleCategoryClick(null)"
      >
        <p>首页</p>
      </div>
      <!-- 后端返回一级分类，parentId=0 -->
      <div 
        class="category-item" 
        :class="{active: selectedCid === item.id}"
        v-for="item in categoryList.filter(item => item.parentId === 0)" 
        :key="item.id" 
        @click="handleCategoryClick(item.id)"
      >
        <p>{{item.categoryName}}</p>
      </div>
    </div>

    <!-- ========== 新增：二级分类区域，选中一级分类才显示，一行3个 ========== -->
    <div v-if="selectedCid !== null && childCategoryList.length > 0" class="child-category-wrap">
      <div 
        class="child-category-item"
        :class="{active: selectedChildCid === item.id}"
        v-for="item in childCategoryList"
        :key="item.id"
        @click="handleChildCategoryClick(item.id)"
      >
        <p>{{ item.categoryName }}</p>
      </div>
    </div>

    <!-- 商品分页容器 -->
    <div style="height: calc(100vh - 170px);">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多商品"
        @load="onLoadGoods"
      >
        <div class="goods-grid">
          <van-card
            v-for="goods in goodsList"
            :key="goods.id"
            :title="goods.spuName"
            :thumb="goods.mainImageUrl"
            @click="goGoodsDetail(goods.id)"
          >
            <template #tags>
              <span class="price">{{ goods.price }}</span>
              本店已拼{{ goods.saleCount }}件
            </template>
          </van-card>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCategoryList, getGoodsByPage } from '@/api/goods'
const router = useRouter()
const route = useRoute()
const searchKey = ref('')
const categoryList = ref([])
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)
// selectedCid = null 代表选中首页，不携带分类条件
const selectedCid = ref(null)
// 新增：选中二级分类id
const selectedChildCid = ref(null)
// 新增：二级分类列表
const childCategoryList = ref([])

// 统一首页初始化方法
const initHomePage = () => {
  pageNum.value = 1
  goodsList.value = []
  finished.value = false
  onLoadGoods()
}
// 获取分类列表·
const loadCategory = async () => {
  const res = await getCategoryList()
  categoryList.value = res.data.data || []
}
// 点击一级分类
const handleCategoryClick = (cid) => {
  selectedCid.value = cid
  // 选中首页，清空二级分类
  if(cid === null){
    childCategoryList.value = []
    selectedChildCid.value = null
  }else{
    // 筛选parentId等于当前一级分类id的子分类（二级分类）
    childCategoryList.value = categoryList.value.filter(item => item.parentId === cid)
    selectedChildCid.value = null
  }
  // 切换分类重置分页
  pageNum.value = 1
  goodsList.value = []
  finished.value = false
  onLoadGoods()
}
// 新增：点击二级分类
const handleChildCategoryClick = (cid) => {
  selectedChildCid.value = cid
  pageNum.value = 1
  goodsList.value = []
  finished.value = false
  onLoadGoods()
}
// 搜索触发
const onSearch = () => {
  pageNum.value = 1
  goodsList.value = []
  finished.value = false
  onLoadGoods()
}
// 清除搜索框
const onClearSearch = () => {
  searchKey.value = ''
  pageNum.value = 1
  goodsList.value = []
  finished.value = false
  onLoadGoods()
}
// 商品分页加载，传分类id给后端
const onLoadGoods = async () => {
  loading.value = true
  try {
    // 优先传二级分类id；有二级选中就用二级，否则一级
    const queryCid = selectedChildCid.value ?? selectedCid.value
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      spuName: searchKey.value,
      categoryId: queryCid
    }
    const res = await getGoodsByPage(params)
    console.log('商品分页数据', res.data.data)
    const records = res.data.data?.records || []
    goodsList.value = goodsList.value.concat(records)
    if(records.length < pageSize.value) {
      finished.value = true
    }
    pageNum.value++
  }catch(err){
    console.error('加载商品失败', err)
  }finally{
    loading.value = false
  }
}
// 商品详情跳转
const goGoodsDetail = (spuId) => {
  router.push(`/goods-detail/${spuId}`)
}
onMounted(async ()=>{
  await loadCategory()
  initHomePage()
})
// 切回首页tab重置状态
watch(()=>route.path,async (newPath)=>{
  if(newPath === '/home'){
    selectedCid.value = null
    selectedChildCid.value = null
    childCategoryList.value = []
    await loadCategory()
    initHomePage()
  }
})
</script>
<style scoped>
.category-scroll-wrap{
  display: flex;
  overflow-x: auto;
  padding:10px 0;
  background: #f5f5f5;
  min-height:24px; 
  -webkit-overflow-scrolling: touch;
}
.category-item{
  flex-shrink: 0;
  padding: 4px 14px;
  font-size:14px;
  white-space: nowrap;
  cursor: pointer;
}
.category-item p{
  margin:0;
}
/* 激活样式：红色文字 + 下划线 */
.category-item.active p{
  color:red;
  font-weight:bold;
  border-bottom:2px solid red;
  padding-bottom:2px;
}

/* ========== 新增二级分类样式，一行3个 ========== */
.child-category-wrap{
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap:8px;
  padding:10px;
  background:#fff;
}
.child-category-item{
  text-align:center;
  padding:6px 0;
  font-size:14px;
}
.child-category-item p{
  margin:0;
}
.child-category-item.active p{
  color:red;
  font-weight:bold;
}

.goods-grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 10px;
}
:deep(.van-card){
  width: 100% !important;
}
.price{
  color:red;
  font-size:15px;
}
</style>
