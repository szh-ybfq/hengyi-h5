import request from '@/utils/request'

// -----------------商品分类接口
/**
 * 获取商品分类下拉选项列表（首页分类）
 */
export function getCategoryList() {
  return request({
    url: '/product/spu/option',
    method: 'get'
  })
}

// -----------------商品接口
/**
 * 获取商品分页列表
 * @param {Object} params { pageNum, pageSize }
 */
export function getGoodsByPage(params) {
  return request({
    url: '/product/spu/page',
    method: 'get',
    params
  })
}
/**
 * 根据id获取商品详情
 * @param {Number|String} id 商品spu id
 */
export function getGoodsDetail(id) {
  return request({
    url: `/product/spu/${id}`,
    method: 'get'
  })
}