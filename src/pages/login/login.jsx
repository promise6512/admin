import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined,LockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './login.less'
import logo from './images/logo.png'
export default class Login extends Component {
    onFinish = (values) =>{
        console.log(values)
    }
    onFinishFailed = (errorInfo) => {
        console.log('failed',errorInfo)
    }
    render() {
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
                                    { max: 12,message: '用户名最多12位'},
                                    { pattern: /^[a-zA-Z0-9_]+$/,message: '用户名必须由字母数字下划线组成'}
                                ]}
                            >
                                <Input placeholder='用户名' prefix={<UserOutlined style={{color:'rgba(0,0,0,.25)'}}/>}/>
                            </Form.Item>

                            <Form.Item
                               /*  label="Password" */
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
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
