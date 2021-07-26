import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
//定义递归
const menuListToTreeDate = (menuList) => {
    return menuList.map(element=>{
        if(element.children){
            return {
                title:element.title,
                key:element.key,
                children:menuListToTreeDate(element.children)
            }
        }else{
            return {
                title:element.title,
                key:element.key
            }
        }
    })
}
const treeData = [{
    title:'平台权限',
    key:'00',
    children:[]
}]
treeData[0].children = menuListToTreeDate(menuList);
//const treeData = menuListToTreeDate(menuList);
//console.log(treeData)
export default class SetAuthForm extends Component {
    static propTypes = {
        role: PropTypes.object
    }
    constructor(props){
        super(props)
        const {role} = props;
        this.state = {
            checkedKeys:role.menus  //储存被选中的权限key值
        } 
    }
    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
    }
    getMenus = () => this.state.checkedKeys

    shouldComponentUpdate(nextProps){
        const {role} = nextProps;
        //console.log(role.menus)
        //this.setState({checkedKeys:role.menus})
        this.state.checkedKeys = role.menus;
        return true
    }


    render() {
        const { role } = this.props
        const {checkedKeys} = this.state
        return (
            <div>
                <Form.Item
                    label='角色名称'
                    labelCol={{ span: 4 }} // 左侧label的宽度
                    wrapperCol={{ span: 15 }} // 右侧包裹的宽度
                >
                    <Input disabled value={role.name} ></Input>
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll
                   /*  defaultExpandedKeys={['0-0-0', '0-0-1']}
                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                    defaultCheckedKeys={['0-0-0', '0-0-1']}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck} */
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                    onCheck={this.onCheck}
                >
                </Tree>
            </div >
        )
    }
}
