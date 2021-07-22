import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import LinkButton from '../../components/linkButton/linkButton';
import { reqCategorys } from '../../api';
import AddForm from './addForm';
import UpdateForm from './updateForm';
import { reqUpdateCategory, reqAddCategory } from '../../api';
export default class Category extends Component {
    state = {
        //dataSource:[],
        parentId: '0', // parentId用于标识显示哪一级列表
        parentName: '',
        categorys: [],
        subCategorys: [],
        loading: false,
        showStatus: 0
    }

    //该方法用于发送ajax请求 获取商品数据
    getCategorys = async (parentId) => {
        this.setState({ loading: true })
        //const { parentId } = this.state
        parentId = parentId || this.state.parentId
        const response = await reqCategorys(parentId);
        if (response.status === 0) {
            //取出分类数组 可能是一级 也可能是二级
            if (parentId === '0') {
                this.setState({ categorys: response.data, loading: false })
            } else {
                this.setState({ subCategorys: response.data, loading: false })
            }
        } else {
            message.error('请求商品失败')
        }
    }

    getSubCategorys = (category) => {
        this.setState({ parentId: category._id, parentName: category.name }, () => {
            //状态更新并调用render()后调用此回调函数
            this.getCategorys()
        })
    }
    firstList = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })

    }
    showAdd = () => {
        this.setState({ showStatus: 1 })
    }
    showUpdate = (category) => {
        this.category = category
        this.setState({ showStatus: 2 })
    }
    handleCancel = () => {
        this.setState({ showStatus: 0 })
        this.form && this.form.resetFields()
        this.addForm && this.addForm.resetFields()
    }
    addCategory = async () => {
        /*  const parentId = this.addForm.getFieldValue('parentId')
         const categoryName = this.addForm.getFieldValue('categoryName')
         const result = await reqAddCategory(parentId, categoryName)
         if (result.status === 0) {
             if (parentId === this.state.parentId) {
                 this.getCategorys()
             } else if (parentId === '0') {
                 this.getCategorys('0')
             }
         }
         this.addForm.resetFields()
         this.setState({ showStatus: 0 })
  */

        this.addForm.validateFields().then(async (values) => {
            //const parentId = this.addForm.getFieldValue('parentId')
           // const categoryName = this.addForm.getFieldValue('categoryName')
            const parentId = values.parentId;
            const categoryName = values.categoryName;
            const result = await reqAddCategory(parentId, categoryName)
            if (result.status === 0) {
                if (parentId === this.state.parentId) {
                    this.getCategorys()
                } else if (parentId === '0') {
                    this.getCategorys('0')
                }
            }
            this.addForm.resetFields()
            this.setState({ showStatus: 0 })
        })

    }
    updateCategory = async () => {
        /*   const categoryId = this.category._id
          const categoryName = this.form.getFieldValue('note')
          const result = await reqUpdateCategory(categoryId,categoryName)
          if(result.status===0){
              this.getCategorys()
          }
          //this.form.resetFields()
          this.setState({showStatus:0}) */
        this.form.validateFields().then(async (values) => {
            //console.log(values)
            const categoryId = this.category._id
            const categoryName = values.note
            const result = await reqUpdateCategory(categoryId, categoryName)
            if (result.status === 0) {
                this.getCategorys()
            }
            //this.form.resetFields()
            this.setState({ showStatus: 0 })
        })

    }
    componentDidMount() {
        this.initColumns();
        this.getCategorys();
    }

    initColumns = () => {
        this.columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width: '30%',
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.getSubCategorys(category)}>查看子分类</LinkButton> : ''}
                    </span>
                )
            },
        ];
    }
    render() {
        const { categorys, subCategorys, parentId, loading, parentName, showStatus } = this.state
        this.category = this.category || {}
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.firstList}>一级分类列表</LinkButton>
                <ArrowRightOutlined />&nbsp;
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} /* style={{position:'none !important'}} */>
                <Table bordered rowKey='_id' dataSource={parentId === '0' ? categorys : subCategorys} columns={this.columns}
                    loading={loading}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />
                <Modal title="添加分类" visible={showStatus === 1} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <AddForm setForm={form => this.addForm = form} categorys={categorys} parentId={parentId}></AddForm>
                </Modal>
                <Modal title="更新分类" visible={showStatus === 2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm categoryName={this.category.name} setForm={form => { this.form = form }}></UpdateForm>
                </Modal>
            </Card>
        )
    }
}
