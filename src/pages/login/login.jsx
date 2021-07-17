import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined,LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from './images/logo.png'
export default class Login extends Component {
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
                        >
                            <Form.Item
                               /*  label="Username" */
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
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
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}
