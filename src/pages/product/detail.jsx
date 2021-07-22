import React, { Component } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {nanoid} from 'nanoid'
import LinkButton from '../../components/linkButton/linkButton';
const {Item} = List;
export default class ProductDetail extends Component {
    render() {
        const {products} = this.props.location.state;
        const {name,desc,price,imgs,detail} = products
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
                        <span className='right'>联想</span>
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
