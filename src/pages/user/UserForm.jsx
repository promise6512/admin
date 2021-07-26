import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
const Item = Form.Item
const Option = Select.Option
export default class UserForm extends Component {
    constructor(props) {
        super(props)
        this.UserForm = React.createRef()
    }
    shouldComponentUpdate(nextProps){
        const {user} = nextProps
        const {username,email,phone,role_id} = user
        this.UserForm.current.setFieldsValue({
            username,email,phone,role_id
        })
        return true
    }
    componentDidMount() {
        const { setForm } = this.props;
        setForm(this.UserForm.current)
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        const { roles, user } = this.props
        const {username,email,phone,role_id} = user
        return (
            <Form
                {...formItemLayout}
                ref={this.UserForm}
                initialValues = {{
                    username,email,phone,role_id
                }}
            >
                <Item label='用户名' name='username'>
                    <Input placeholder='请输入用户名'></Input>
                </Item>
                {
                    user._id ? null :
                    <Item label='密码' name='password'>
                        <Input.Password placeholder='请输入密码' visibilityToggle={false} >
                        </Input.Password>
                    </Item>
                }
                <Item label='手机号' name='phone'>
                    <Input placeholder='请输入手机号'></Input>
                </Item>
                <Item label='邮箱' name='email'>
                    <Input placeholder='请输入邮箱'></Input>
                </Item>
                <Item label='角色' name='role_id'>
                    <Select>
                        {
                            roles.map((element) => {
                                return (
                                    <Option value={element._id} key={element._id}>{element.name}</Option>
                                )
                            })
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
