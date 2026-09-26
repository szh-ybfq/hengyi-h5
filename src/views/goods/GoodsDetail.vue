<template>
  <div class="detail-page">
    <!-- 顶部详情轮播 van‑swiper 自动2秒切换 -->
    <van-swipe
      v-model:active="swipeActiveIndex"
      :autoplay="isAutoPlay ? 2000 : 0"
      stop-on-touch
    >
      <van-swipe-item v-for="(imgUrl, idx) in goodsInfo.detailImgList" :key="idx">
        <van-image
          width="100%"
          height="300"
          :src="imgUrl"
          @click="openImgPreview(idx)"
        />
      </van-swipe-item>
    </van-swipe>

    <!-- 图片预览组件：预览轮播图片数组，打开预览停止轮播，关闭恢复 -->
    <van-image-preview
      v-model:show="showPreview"
      :images="goodsInfo.detailImgList"
      :start-position="previewStartIndex"
      @close="onPreviewClose"
    />

    <div class="info">
      <h2>{{goodsInfo.spuName}}</h2>
      <p class="price">¥{{goodsInfo.price}}</p>
    </div>

    <!-- 商品参数板块 -->
    <div class="param-section">
      <h3>商品描述</h3>
      <p class="desc-text">{{goodsInfo.spuDescription}}</p>

      <h3>商品参数</h3>
      <!-- paramImgList 一行一张图片竖向摆放 -->
      <div class="param-img-list">
        <van-image
          v-for="(imgUrl,idx) in goodsInfo.paramImgList"
          :key="idx"
          width="100%"
          :src="imgUrl"
          fit="contain"
        />
      </div>
    </div>

    <!--猜你喜欢占位板块，后续对接接口-->
    <div class="like-section">
      <h3>猜你喜欢</h3>
      <div>TODO 商品列表</div>
    </div>

    <!--给页面增加底部padding，防止内容被固定栏遮挡-->
    <div class="placeholder-bottom"></div>

    <!-- 底部固定栏 -->
    <div class="bottom-bar">
      <div class="left-group">
        <div class="menu-item" @click="showMorePopup=true">
          <van-icon name="bars" size="22"/>
          <div>更多</div>
        </div>
        <div class="menu-item" @click="handleCollect">
          <van-icon :name="isCollected ? 'star' : 'star-o'" size="22"/>
          <div>{{ isCollected ? '已收藏' : '收藏' }}</div>
        </div>
        <div class="menu-item" @click="$router.push('/customer-service')">
          <van-icon name="chat" size="22"/>
          <div>客服</div>
        </div>
      </div>
      <van-button type="danger" class="btn-pin" @click="openSpecPopup">发起拼单</van-button>
    </div>

    <!--更多弹出面板 action‑sheet -->
    <van-action-sheet
      v-model:show="showMorePopup"
      :actions="moreActions"
      cancel-text="取消"
      @select="onMenuSelect"
    />
    <!-- 规格选择弹窗 -->
    <van-popup v-model:show="showSpecPopup" position="bottom">
      <div class="spec-wrap">
        <h3>选择款式</h3>
        <div class="spec-item" v-for="item in specList" :key="item.id" @click="selectSpec(item)">
          {{item.name}}
        </div>
        <van-button block type="danger" class="confirm-btn" @click="confirmPin">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGoodsDetail } from '@/api/goods'
const route = useRoute()
const router = useRouter()

//商品详情数据 VO: detailImgList、paramImgList
const goodsInfo = ref({
  detailImgList: [],
  paramImgList: []
})
//轮播
const swipeActiveIndex = ref(0)
//是否自动播放：打开预览就关闭自动播放
const isAutoPlay = ref(true)
//图片预览
const showPreview = ref(false)
const previewStartIndex = ref(0)

//更多菜单弹窗
const showMorePopup = ref(false)
//拼单规格弹窗
const showSpecPopup = ref(false)
//是否收藏状态
const isCollected = ref(false)
const moreActions = ref([
  { name: '历史浏览', value: 'history' },
  { name: '回到首页', value: 'home' },
  { name: '帮助与反馈', value: 'feedback' }
])
const specList = ref([
  {id:1,name:"【含油宿舍10件套推荐】生抽+油400ml"},
  {id:2,name:"【含油超值宿舍7件套】油+盐+酱+醋"}
])
const selectedSpec = ref(null)

const loadDetail = async () => {
  const res = await getGoodsDetail(route.params.spuId)
  goodsInfo.value = res.data.data || {}
  console.log('商品详情', goodsInfo.value)
}
//打开预览，传入当前点击图片下标，停止自动轮播
const openImgPreview = (idx)=>{
  previewStartIndex.value = idx
  showPreview.value = true
  isAutoPlay.value = false
}
//关闭预览，恢复自动轮播
const onPreviewClose = ()=>{
  showPreview.value = false
  isAutoPlay.value = true
}
const onMenuSelect = (item)=>{
  switch(item.value){
    case 'history':
      console.log('打开历史浏览，自己做页面');
      break;
    case 'home':
      router.push('/');
      break;
    case 'feedback':
      console.log('帮助反馈页面');
      break;
  }
  showMorePopup.value=false
}
const handleCollect = ()=>{
  isCollected.value = !isCollected.value
  console.log("点击收藏",isCollected.value)
}
const openSpecPopup = ()=>{
  showSpecPopup.value=true
}
const selectSpec = (item)=>{
  selectedSpec.value = item
}
const confirmPin = ()=>{
  console.log("确认拼单",selectedSpec.value)
  showSpecPopup.value=false
}
onMounted(()=>{
  loadDetail()
})
</script>

<style scoped>
.info{
  padding:12px;
}
.price{
  color:red;
  font-size:20px;
}
/*商品参数区域*/
.param-section{
  padding:12px;
}
.param-section h3{
  font-size:16px;
  margin:12px 0 8px;
}
.desc-text{
  line-height:1.6;
}
.param-img-list{
  display:flex;
  flex-direction:column;
  gap:10px;
}
/*猜你喜欢*/
.like-section{
  padding:12px;
}
.like-section h3{
  font-size:16px;
}
/*占位，内容往下挤开，避开底部固定栏*/
.placeholder-bottom{
  height:70px;
}
.bottom-bar{
  position:fixed;
  bottom:0;
  left:0;
  width:100%;
  background:#fff;
  display:flex;
  align-items:center;
  padding:8px 12px;
  box-sizing:border-box;
  gap:12px;
  border-top:1px solid #eee;
}
.left-group{
  display:flex;
  gap:12px;
}
.menu-item{
  display:flex;
  flex-direction:column;
  align-items:center;
  font-size:12px;
  color:#444;
}
.btn-pin{
  flex:1;
  border-radius:20px;
}
.spec-wrap{
  padding:20px;
  min-height:320px;
}
.spec-item{
  border:1px solid #ccc;
  border-radius:6px;
  padding:10px;
  margin:8px 0;
}
.confirm-btn{
  margin-top:20px;
}
</style>
