async和await
1.作用
    简化promise的使用\
    以同步编码(没有回调函数)方式实现异步流程
2.哪里写await
    在返回promise的表达式左侧写await 不想要promise，想要promise异步执行的成功的value数据
3.哪里写async
    await所在函数(最近的)定义的左侧