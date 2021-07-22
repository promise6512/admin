import React, { Component } from 'react'
import { Form, Select,Input } from 'antd'
export default class AddForm extends Component {
    render() {
        return (
            <Form>
                <h2>一级分类：</h2>
                <Form.Item >
                    <Select>
                        <Select.Option value='0'>一级分类</Select.Option>
                    </Select>
                </Form.Item>
                <h2>所属分类：</h2>
                <Form.Item initialValue=''>
                    <Input placeholder='请输入分类名称'/>
                </Form.Item>
            </Form>
        )
    }
}
