/* 
  包含应用中所有接口请求函数的模块
  每个函数的返回值都是promise
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd';
const BASE = '';
//登录
export const reqLogin = (username,password) => ajax(BASE+'/login',{username,password},'POST')
//获取分类列表
export const reqCategorys = (parentId) => ajax(BASE+'/manage/category/list',{parentId})
//添加分类
export const reqAddCategory = (parentId,categoryName) => ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')
//修改分类
export const reqUpdateCategory = (categoryId ,categoryName) => ajax(BASE+'/manage/category/Update',{categoryId ,categoryName},'POST')
//获取商品列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})
//搜索商品分页列表
export const reqSearchProducts = (pageNum,pageSize,searchName,searchType) => ajax(BASE+'/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName
})
//获取一个分类
export const reqDetailCategory = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})
//获取商品上架/下架状态
export const reqChangeProductStatus = (productId,status) => ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')
//删除图片
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')
//添加商品
export const reqAddProduct = (pCategoryId,categoryId,name,desc,price,detail,imgs) => ajax('/manage/product/add',
{pCategoryId,categoryId,name,desc,price,detail,imgs},'POST')
//更新商品
export const reqUpdateProduct = (_id,pCategoryId,categoryId,name,desc,price,detail,imgs) => ajax('/manage/product/update',
{_id,pCategoryId,categoryId,name,desc,price,detail,imgs},'POST')
//获取角色列表
export const reqGetRoles = () => ajax('/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')
//更新角色                    //传入的role为对象
export const reqUpdateRole = (role) => ajax('/manage/role/update',role,'POST')
//请求用户
export const reqGetUsers = () => ajax('/manage/user/list')
//删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')
//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add',user,'POST')
//修改用户
export const reqUpdateUser = (user) => ajax('/manage/user/update',user,'POST')
/* 
  jsonp请求的接口请求函数
*/
export const reqWeather = (city) =>{
  return new Promise((resolve)=>{
    const cityToCode={
      '北京':110000,
      '上海':310000,
      '杭州':330100
    };
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityToCode[city]}&key=5348e4e333c889a1903e48244f69ea73`
    jsonp(url,{},(err,data)=>{
      //console.log('jsonp',err,data)
      //如果成功
      if(!err && data.status==='1'){
        //console.log(data.lives[0])
        const {city,weather,reporttime} = data.lives[0]
        resolve( {city,weather,reporttime})
      }else{
        message.error('请求失败')
      }
    })
  })

}
//console.log(reqWeather('北京'))