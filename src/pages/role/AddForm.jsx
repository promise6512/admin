import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form, Input } from 'antd';
export default class AddForm extends Component {
    static propTypes = {
        setForm:PropTypes.func.isRequired
    }
    constructor(props){
        super(props)
        this.addForm = React.createRef()
        //console.log('construnctor add')
        
    }
    componentDidMount(){
      //  console.log('didmount add')
     // console.log(this.props,this.addForm)
      this.props.setForm(this.addForm.current)
    }
    render() {
        
       // console.log('render add')
        return (
            <Form ref={this.addForm}>
                <Form.Item 
                    label='角色名称'
                    wrapperCol={{span:16}}
                    name='roleName'
                    rules ={[
                        { required: true, whitespace: true, message: '必须输入角色名称' }
                    ]}
                > 
                    <Input placeholder='请输入角色名称'>
                    </Input>
                </Form.Item>
            </Form>
        )
    }
}
