import React, { Component } from 'react'
import { Form,Input } from 'antd'
export default class UpdateForm extends Component {
    componentDidMount(){
        //console.log(this.form)
        this.props.setForm(this.form)
    }
    render() {
        if(this.form){
            this.form.setFieldsValue({
                note:this.props.categoryName
            })
        }
        return (
            <Form ref={(c)=>{this.form=c}}>
                <Form.Item initialValue={this.props.categoryName} name='note'>
                    <Input placeholder='请输入分类名称'/>
                </Form.Item>
            </Form>
        )
    }
}
