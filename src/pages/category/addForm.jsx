import React, { Component } from 'react'
import { Form, Select,Input } from 'antd'
export default class AddForm extends Component {
    componentDidMount(){
        //console.log(this.form.getFieldValue('parentId'))
        //console.log(this.form.getFieldValue('categoryName'))
        this.props.setForm(this.form)
    }
    render() {
        const {categorys,parentId} = this.props;
        if(this.form){
            this.form.setFieldsValue({
                parentId
            })
        }
        return (
            <Form ref={c=>this.form = c}>
                <Form.Item initialValue={parentId} name='parentId'>
                    <Select>
                        <Select.Option value='0'>一级分类</Select.Option>
                        {
                            categorys.map(element=>(
                                <Select.Option value={element._id} key={element._id}>{element.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item initialValue='' name='categoryName'
                    rules={[
                        {required:true,whitespace:true,message:'名称不能为空'}
                    ]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Form.Item>
            </Form>
        )
    }
}
