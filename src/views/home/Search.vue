<template>
  <div class="search-page">
    <!--顶部导航栏-->
    <div class="search-header">
      <div class="back-icon" @click="goBack">
        <van-icon name="arrow-left" size="22"/>
      </div>
      <van-search
        v-model="searchKey"
        placeholder="搜索商品名称"
        shape="round"
        show-action
        @search="onSearch"
      />
    </div>
    <!--商品列表-->
    <div style="height: calc(100vh - 56px);">
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
import {ref,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {getGoodsByPage} from '@/api/goods'
const router = useRouter()
const route = useRoute()

const searchKey = ref('')
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = ref(10)

// 返回首页
const goBack = ()=>{
  router.push('/home')
}

//点击搜索按钮，重置分页，把搜索关键词写入url query
const onSearch = ()=>{
  pageNum.value = 1
  goodsList.value = []
  finished.value = false
  // 更新路由query，保存搜索词
  router.replace({
    query:{
      spuName: searchKey.value
    }
  })
  onLoadGoods()
}

//下拉加载商品
const onLoadGoods = async ()=>{
  loading.value = true
  try{
    const params = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      spuName: searchKey.value,
      categoryId: null
    }
    const res = await getGoodsByPage(params)
    const records = res.data.data?.records || []
    goodsList.value = goodsList.value.concat(records)
    if(records.length < pageSize.value){
      finished.value = true
    }
    pageNum.value++
  }catch (e){
    console.error(e)
  }finally {
    loading.value = false
  }
}

//跳转到商品详情页！！重点：详情页返回使用浏览器回退，不要push新页面覆盖query
const goGoodsDetail = (spuId)=>{
  router.push(`/goods-detail/${spuId}`)
}

//页面挂载：读取url query恢复搜索状态
onMounted(()=>{
  if(route.query.spuName){
    searchKey.value = route.query.spuName
    pageNum.value = 1
    goodsList.value = []
    finished.value = false
    onLoadGoods()
  }
})
</script>
<style scoped>
.search-page{
  background:#f5f5f5;
}
.search-header{
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px;
  background:#fff;
}
.back-icon{
  flex:0 0 32px;
}
:deep(.van-search){
  flex:1;
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
