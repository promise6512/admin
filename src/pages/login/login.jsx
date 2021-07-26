import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Form, Input, Button,message } from 'antd';
import { UserOutlined,LockOutlined} from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
export default class Login extends Component {
    onFinish = async (values) =>{
        const {username,password} = values;
        //使用await可以省略使用then()来指定成功/失败的回调函数
        //直接将成功的值返回给response
        const response = await reqLogin(username,password)
        console.log(response)  
        
        if(response.status===0){
            message.success('登陆成功')
            memoryUtils.user = response.data
           // console.log(memoryUtils.user)
            storageUtils.saveUser(response.data)
            //console.log(storageUtils.getUser())
            //不需要回退
            this.props.history.push('/')
        }else{
            message.error(response.msg)
        }
    }
    onFinishFailed = (errorInfo) => {
        console.log('failed',errorInfo)
    }
    render() {
        const {user} = memoryUtils;
        if(user&&user._id){
            return <Redirect to='/'/>
        }
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React项目 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <div>
                        <Form
                            name="basic"
                            wrapperCol={{
                                span: 100,
                            }}
                            className='login-form'
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                        >
                            <Form.Item
                               /*  label="Username" */
                                name="username"
                                rules={[
                                    {whitespace:true,message:'Please input your username!'},
                                    { required: true,message: 'Please input your username!',},
                                    { min: 4,message: '用户名至少4位' },
                                    { max: 12,message: '用户名最多12位'},
                                    { pattern: /^[a-zA-Z0-9_]+$/,message: '用户名必须由字母数字下划线组成'}
                                ]}
                                initialValue='admin'
                            >
                                <Input placeholder='用户名' prefix={<UserOutlined style={{color:'rgba(0,0,0,.25)'}}/>}/>
                            </Form.Item>

                            <Form.Item
                               /*  label="Password" */
                                name="password"
                                /* rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]} */
                                rules={[
                                    {whitespace:true,message:'Please input your password!'},
                                    { required: true,message: 'Please input your password!',},
                                    { min: 4,message: '密码至少4位' },
                                    { max: 12,message: '密码最多12位'},
                                    { pattern: /^[a-zA-Z0-9_]+$/,message: '用户名必须由字母数字下划线组成'}
                                ]}
                            >
                                <Input.Password placeholder='密码' prefix={<LockOutlined style={{color:'rgba(0,0,0,.25)'}}/>}/>
                            </Form.Item>

                            <Form.Item >
                                <Button type="primary" htmlType="submit" className='login-form-button'>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}
