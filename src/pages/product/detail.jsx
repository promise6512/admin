import React, { Component } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {nanoid} from 'nanoid'
import LinkButton from '../../components/linkButton/linkButton';
import { reqDetailCategory } from '../../api';
const {Item} = List;
export default class ProductDetail extends Component {
    state = {
        categoryName1:'',  //所属一级分类名字
        categoryName2:''  //所属二级分类名字
    }
    //点击"详情" 显示detail路由 组件挂载
    async componentWillMount(){
        //console.log('DidMount') 
        //显示所属分类
        const {pCategoryId,categoryId} = this.props.location.state.product;
        if(pCategoryId === '0'){
            const result = await reqDetailCategory(categoryId);
            if(result.status === 0){
                this.setState({categoryName1:result.data.name})
            }
        }else{
            const result = await Promise.all([reqDetailCategory(pCategoryId),reqDetailCategory(categoryId)])
            if(result[0].status=== 0 || result[1].status === 0){
                this.setState({
                    categoryName1:result[0].data.name,
                    categoryName2:result[1].data.name
                })
            }
        }
    }
    //点击"返回" 路由组件卸载
   /*  componentWillUnmount(){
        console.log('WillUnmount')
    } */
    render() {
        const {product} = this.props.location.state;
        const {name,desc,price,imgs,detail} = product
        const {categoryName1,categoryName2} = this.state
        const title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                <ArrowLeftOutlined style={{color:"#1DA57A",fontSize:20}}/>
                </LinkButton>&nbsp;
                <span>商品详情</span>
            </span >
        )
        return (
            <Card title={title} className='product-detail'>
                <List bordered>
                    <Item className='item'>
                        <span className='left'>商品名称:</span>
                        <span className='right'>{name}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品描述:</span>
                        <span className='right'>{desc}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品价格:</span>
                        <span className='right'>{price}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>所属分类:</span>
                        <span className='right'>{categoryName1}{categoryName2?'-->'+categoryName2:''}</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品图片:</span>
                        <span className='right'>
                            {
                                imgs.map(e=>(
                                    <img className='product-img' src={'http://localhost:5000/upload/'+e} alt='' key={nanoid()}/>
                                ))
                            }
                        </span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品详情:</span>
                        <span className='right' dangerouslySetInnerHTML={{__html:detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
