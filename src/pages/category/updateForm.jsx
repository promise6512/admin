import React, { Component } from 'react'
import PropTypes from 'prop-types' 
import { Form,Input } from 'antd'
export default class UpdateForm extends Component {
    static propTypes = {
        categoryName:PropTypes.string,
        setForm:PropTypes.func.isRequired
    }
    componentDidMount(){
        //console.log(this.form)
        console.log('updateform@')
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
                <Form.Item initialValue={this.props.categoryName} name='note'
                    rules={[{required:true,whitespace:true,message:'名称不能为空'}]}
                >
                    <Input placeholder='请输入分类名称'/>
                </Form.Item>
            </Form>
        )
    }
}
