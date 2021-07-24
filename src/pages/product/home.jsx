import React, { Component } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/linkButton/linkButton';
import { reqProducts, reqSearchProducts, reqChangeProductStatus } from '../../api';
export default class ProductHome extends Component {
    state = {
        total: 0,
        products: [],
        loading: false,
        searchName: '',
        searchType: 'productName',
        currentPageNum: 1
    }
    getProductStatus = () => {

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
                //dataIndex: 'status',
                key: 'status',
                render: (product) => {
                    const { status, _id } = product;
                    return (
                        <span>
                            <Button type='primary' onClick={this.changeProductStatus(_id, status === 1 ? 2 : 1)}>{status === 1 ? '下架' : '上架'}</Button><br />
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                key: 'address',
                render: (product) => {
                    //console.log(this)
                    const {currentPageNum,searchName,searchType} = this.state
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', { product, currentPageNum/* :this.state.currentPageNum */, searchName, searchType })}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }
    //更新商品上架/下架状态
    changeProductStatus = (productId, status) => {
        return async () => {
            const result = await reqChangeProductStatus(productId, status)
            // console.log(result)
            if (result.status === 0) {
                const { searchName, currentPageNum } = this.state;
                searchName ? this.searchProducts(currentPageNum) : this.getProducts(currentPageNum);
                message.success('商品更新成功')

            }
        }
    }
    //获取指定商品分页列表
    getProducts = async (pageNum) => {
        //  console.log(pageNum)
        this.setState({ loading: true })
        const result = await reqProducts(pageNum, 3)
        if (result.status === 0) {
            const { total, list } = result.data;
            this.setState({ total, products: list, loading: false, currentPageNum: pageNum })
        }
    }
    searchProducts = async (pageNum,_,searchName,searchType) => {
        //console.log(pageNum,typeof pageNum)
        /* if ((typeof pageNum) != 'Number') {
            pageNum = 1
        } */
       // pageNum = pageNum || 1
        this.setState({ loading: true })
        //let { searchName, searchType } = this.state;
        const newSearchName = searchName || this.state.searchName;
        const newSearchType = searchType || this.state.searchType
       // const result = await reqSearchProducts(pageNum, 3, searchName, searchType)
        const result = await reqSearchProducts(pageNum, 3, newSearchName, newSearchType)
        //console.log(result)
        if (result.status === 0) {
            const { total, list } = result.data;
            this.setState({ total, products: list, loading: false,currentPageNum:pageNum,
                searchName:newSearchName,
                searchType:newSearchType
            })
        }
    }
    UNSAFE_componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        if (this.props.location.state) {
            //console.log(this.props.location.state)
            const { currentPageNum,searchName,searchType,total} = this.props.location.state
            //修改商品&&搜索状态
            if (searchName&&currentPageNum) {
                this.searchProducts(currentPageNum,'',searchName,searchType)
            //修改商品&&非搜索状态
            }else if(currentPageNum){
                this.getProducts(currentPageNum)
            //添加商品
            }else{
                //跳转到最后一页
                //console.log(total)
                this.getProducts(parseInt((total+1)/3)+1)
            }
        } else {
            //console.log(1)
            this.getProducts(1)
        }

    }
    render() {
        const { Option } = Select;
        const { products, total, loading, searchType, searchName } = this.state
        const title = (
            <span>
                <Select
                    //受控组件
                    //组件状态实时更新
                    value={searchType}
                    onChange={(value) => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }}
                    onChange={(event) => { this.setState({ searchName: event.target.value }) }}
                ></Input>
                <Button type='primary' onClick={()=>this.searchProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate',{total})}>
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
                        defaultPageSize: 3,
                        total,
                        showQuickJumper: true,
                        onChange: searchName ? this.searchProducts : this.getProducts,
                        current: this.state.currentPageNum
                    }}
                >
                </Table>
            </Card>
        )
    }
}
