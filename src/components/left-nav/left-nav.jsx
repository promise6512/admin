import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import memoryUtils from '../../utils/memoryUtils';
import {
    PieChartOutlined,
    MailOutlined,
} from '@ant-design/icons';

import './left-nav.less'
import logo from '../../assets/images/logo.png'
//引入配置
import menuList from '../../config/menuConfig'

class LeftNav extends Component {
    getMenuNodes = (menuList) => {
        const { SubMenu } = Menu;
        return (
            menuList.map(parent => {
                if (!parent.children) {
                    return (
                        <Menu.Item key={parent.key} icon={<PieChartOutlined />}>
                            <Link to={parent.key}>{parent.title}</Link>
                        </Menu.Item>
                    )
                } else {
                    return (
                        <SubMenu key={parent.key} icon={<MailOutlined />} title={parent.title}>
                            {
                                this.getMenuNodes(parent.children)
                            }
                        </SubMenu>
                    )
                }
            })
        )
    }
    
    //判断当前登录用户对Item是否有权限
    hasAuth = (cur) => {
        const {key,isPublic} = cur;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        //如果当前元素的某个子元素的key与menus中的key匹配
        }else if(cur.children) {
            return !! cur.children.find(child => menus.indexOf(child.key)!==-1)
        }else{
            return false
        }
    }
    getMenuNodesReduce = (menuList) => {
        const path =  this.props.location.pathname;
        const { SubMenu } = Menu;
        //console.log(menuList)
        return (
            menuList.reduce((acc,cur)=>{
                //console.log('acc',acc)
                if(this.hasAuth(cur)){
                    if(!cur.children){
                        acc.push((
                            <Menu.Item key={cur.key} icon={<PieChartOutlined />}>
                                <Link to={cur.key}>{cur.title}</Link>
                            </Menu.Item>
                        ))
                    }else{
                        const curChild = cur.children.find(element=>path.indexOf(element.key)===0)
                        if (curChild){
                            this.openkey=cur.key
                        }
                        acc.push((
                            <SubMenu key={cur.key} icon={<MailOutlined />} title={cur.title}>
                                {
                                    this.getMenuNodesReduce(cur.children)
                                }
                            </SubMenu>
                        ))
                    }
                }
                return acc
            },[])
        )
    }
    /*  */
    UNSAFE_componentWillMount (){
        /* 在组件挂载之前调用 组件更新不调用 */
        /* 手动刷新时会重新挂载组件 会在调用一次 */
        this.getMenuNodesReduce(menuList)
    }
    render() {
        //得到当前请求的路由路径
        //console.log(this.props)
        let path =  this.props.location.pathname
        if(path.indexOf('/product') === 0){
            path = '/product'
        }
        return (
            <div  className='left-nav'>
                <Link className='left-nav-header' to='/'>
                    <img src={logo} alt="" />
                    <h2>后台系统</h2>
                </Link>

                <div className='left-nav-list'>
                    <Menu
                        mode="inline"
                        theme="dark"
                        //选中的key
                        selectedKeys={[path]}
                        /* 默认属性只会指定一次 在手动刷新页面时会重新指定默认属性 */
                        defaultOpenKeys={[this.openkey]}
                    >
                        {
                            this.getMenuNodesReduce(menuList)
                        }
                    </Menu>
                </div>
            </div>
        )
    }
}
/* 
   withRouter高阶组件:
    包装非路由组件 返回一个新的组件
    新的组件向非路由组件传递三个属性:history/location/match
*/
export default withRouter(LeftNav)