import React, { Component } from 'react'
import { Card, Form, Input, Upload, Cascader, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/linkButton/linkButton';
import { reqCategorys } from '../../api';
import { element } from 'prop-types';
/* const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        isLeaf: false,
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        isLeaf: false,
    },
]; */
export default class ProductAddUpdate extends Component {
    state = {
        options: []
    }
    //values为对象，其中包括各个Item的值
    onFinish = (values) => {
        console.log(values)
    }
    validatePrice = (_, value) => {
        if (value * 1 < 0) {
            return Promise.reject(new Error('价格必须大于0'))

        } else {
            return Promise.resolve()
        }
    }
    initOptions = (categorys) => {
        const options = categorys.map(element => ({ value: element._id, label: element.name, isLeaf: false }))
        this.setState({ options })
    }
    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[0];//targetOption表示选择的上一级option
        targetOption.loading = true; 
        const subCategorys = await this.getCategorys(targetOption.value) 
        //如果存在二级列表 则显示二级列表
        if (subCategorys && subCategorys.length > 0) {
            targetOption.loading = false;
            targetOption.children = subCategorys.map(element => ({
                label: element.name,
                value: element._id,
                isLeaf: true
            }))
        //如果不存在二级列表 
        }else{
            targetOption.loading = false;
            targetOption.isLeaf = true
        }
        //虚假更新状态以调用render更新界面
        this.setState({options:[...this.state.options]})
    };
    //异步获取一级分类列表和二级分类列表
    /*  
         async函数的返回值是一个新的promise ，promise的结果和值有async函数决定
             规则和Promise.then()返回的一样
     */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(result.data)
            } else {
                return result.data
            }
        }
    }
    componentDidMount() {
        this.getCategorys('0')
    }
    render() {
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ color: "#1DA57A", fontSize: 20 }} />
                </LinkButton>&nbsp;
                <span>商品详情</span>
            </span >
        )


        return (
            <Card title={title}>
                <Form
                    labelCol={{ span: 2 }} //左侧label的宽度
                    wrapperCol={{ span: 8 }} //指定右侧包裹的宽度
                    //ref={c => this.form = c}
                    onFinish={this.onFinish} //onFinish指定的回调会在表单通过验证提交后调用
                >
                    <Form.Item label='商品名称' name='productName'
                        rules={[
                            { required: true, whitespace: true, message: '必须输入商品名称' }
                        ]}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Form.Item>
                    <Form.Item label='商品描述' name='productDesc'
                        rules={[
                            { required: true, whitespace: true, message: '必须输入商品描述' }
                        ]}
                    >
                        <Input.TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} showCount />
                    </Form.Item>
                    <Form.Item label='商品价格' name='productPrice'
                        rules={[
                            { required: true, whitespace: true, message: '必须输入商品价格' },
                            { validator: this.validatePrice }
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'/* 指定后缀 */ />
                    </Form.Item>
                    <Form.Item label='商品分类' name='productCategory'>
                        <Cascader
                            options={this.state.options}  //指定需要显示的列表数据
                            loadData={this.loadData}  //指定当选择某个列表项加载下一级列表的回调
                        />
                    </Form.Item>
                    <Form.Item label='商品图片'>
                        <div>商品图片</div>
                    </Form.Item>
                    <Form.Item label='商品详情'>
                        <div>商品详情</div>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            span: 8,
                            offset: 4
                        }}
                    >
                        <Button type="primary" htmlType="submit">{/* 必须指定 htmlType="submit"才能配合onFinish使用*/}
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
