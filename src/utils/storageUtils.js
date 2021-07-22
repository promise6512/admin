//store是一个对storeage相关api进行代码简化的库
import store from 'store'
 const storageUtils = {
    /* 
      保存user
    */
    saveUser(user){
        //localStorage.setItem('user_key',JSON.stringify(user))
        store.set('user_key',user)
    },
   /* 
      读取user
   */
    getUser(){
        //如果读取不到值会返回null
        //return  JSON.parse(localStorage.getItem('user_key')||'{}')
        return store.get('user_key')
    },
  /* 
      删除user
  */
    removeUser(){
        //localStorage.removeItem('user_key')
        store.remove('user_key')
    }
}
export default storageUtils