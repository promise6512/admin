import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import Header from '../../components/header/header';
import LeftNav from '../../components/left-nav/left-nav';
//引入二级路由组件
import Home from '../home/home'
import Category from '../category/category';
import Product from '../product/product';
import User from '../user/user';
import Role from '../role/role'
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie'
import { Layout } from 'antd';
const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        const { user } = memoryUtils
        if (!user || !user._id) {
            return (
                <Redirect to='/login'></Redirect>
            )
        }
        return (
            <Layout style={{ height: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ background: '#fff',margin:'20px' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home' /> 
                           {/*  <Redirect
                                to={{
                                    pathname: "/home",
                                    state: { referrer: '/home'}
                                }}
                            /> */}

                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#AAA' }}>
                        推荐使用谷歌浏览器,可以获得最佳页面操作体验
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}
