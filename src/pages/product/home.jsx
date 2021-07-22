import React, { Component } from 'react'
import { Card, Select, Input, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/linkButton/linkButton';
import { reqProducts,reqSearchProducts } from '../../api';
export default class ProductHome extends Component {
    state = {
        total:0,
        products: [],
        loading:false,
        searchName:'',
        searchType:'productName'
    }
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: () => (
                    <span>
                        <Button type='primary'>下架</Button><br />
                        <span>在售</span>
                    </span>
                )
            },
            {
                title: '操作',
                key: 'address',
                render: (products) => (
                    <span>
                        <LinkButton onClick={()=>this.props.history.push('/product/detail',{products})}>详情</LinkButton>
                        <LinkButton>修改</LinkButton>
                    </span>
                )
            },
        ];
    }
    //获取指定商品分页列表
    getProducts = async (pageNum) => {
        this.setState({loading:true})
        const result = await reqProducts(pageNum,3)
      //  console.log(result)
        //console.log(result.status===0)
        if(result.status===0){
            //console.log(result)
            const {total,list} = result.data;
            this.setState({total,products:list,loading:false})
        }
    }
    searchProducts = async () => {
        this.setState({loading:true})
        const {searchName,searchType} = this.state;
        const result = await reqSearchProducts(1,3,searchName,searchType)
        //console.log(result)
        if(result.status===0){
            const {total,list} = result.data;
            this.setState({total,products:list,loading:false})
        }
    }
    UNSAFE_componentWillMount () {
        this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    render() {
        const { Option } = Select;
        const {products,total,loading,searchType,searchName} = this.state
        const title = (
            <span>
                <Select 
                //受控组件
                //组件状态实时更新
                    value={searchType}
                    onChange= {(value)=>this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }}
                    onChange={(event)=>{this.setState({searchName:event.target.value})}}
                ></Input>
                <Button type='primary' onClick={this.searchProducts}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary'>
                <PlusOutlined />
                添加
            </Button>
        )
        return (
            //<Card title={title} extra={extra}></Card>    
            <Card title={title} extra={extra} style={{ width: '100%' }}>
                <Table dataSource={products} columns={this.columns} bordered
                    rowKey='_id' loading={loading}
                    pagination={{
                        defaultPageSize:3,
                        total,
                        showQuickJumper:true,
                        onChange:searchName? this.searchProducts:this.getProducts
                    }}
                >
                </Table>
            </Card>
        )
    }
}
