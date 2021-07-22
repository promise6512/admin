/* 
  能发送异步axios请求的函数模块
  封装axios库
  函数的返回值是promise对象
  1.优化同意处理异常
*/
import axios from 'axios';
import { message } from 'antd';
export default function ajax(url,data={},type='GET'){

    return new Promise((resolve,reject)=>{
        let promise;
        //1.执行异步ajax请求 获取promise
        if(type==='GET'){
            promise = axios.get(url,{
                //params的值为对象类型 对象内保存get请求指定的参数
                params:data
            })
        }else{
            promise = axios.post(url,data)
        }

        promise.then(response=>{
            //2如果成功 执行resolve ajax函数返回成功的promise
            resolve(response.data)
        }).catch(error=>{
            //3.如果失败则执行reject
           // reject(error.message)
           //中断promise链
            message.error('请求出错'+error.message)
        })
    })
}

