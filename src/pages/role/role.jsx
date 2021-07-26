import React, { Component } from 'react'
import { Card, Button, Table, Modal,message} from 'antd'
import { reqGetRoles,reqAddRole,reqUpdateRole } from '../../api'
import AddForm from './AddForm';
import SetAuthForm from './SetAuthForm';
import memoryUtils from '../../utils/memoryUtils';
import formateDate from '../../utils/dateUtils'
export default class Role extends Component {
    //构造器中无法调用组件的方法
    constructor(props) {
        super(props)
        this.state = {
            showAdd:false,
            showSetAuth:false,
            roles:[], //所有角色
            selectedRole:{} //选中的对象
            //#region
            /* 
            roles结构
              [{ "menus": [
                    "/home",
                    "/products",
                    "/category",
                    "/product",
                    "/role"
                ],
                "_id": "5ca9eac0b49ef916541160d5",
                "name": "角色1",
                "create_time": 1554639552758,
                "__v": 0,
                "auth_time": 1557630307021,
                "auth_name": "admin"}]
            */
           //#endregion
        }
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:create_time =>  formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:auth_time => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
        ];
        //创建ref容器储存【设置权限】组件
        this.setAuthForm = React.createRef()
    }
    showAddModal = () => {
        this.setState({showAdd:!this.state.showAdd})
    }
    addRole = async () => {  
        this.addForm.validateFields().then(async values=>{
            // console.log(values)
             const {roleName} = values;
             const result = await reqAddRole(roleName);
             if(result.status === 0){
                 this.getRoles()
                 message.success('添加角色成功')
             }
             this.addForm.resetFields()
             this.setState({showAdd:false});
        })
    }
    handleCancel = () => {
        this.addForm.resetFields()
        this.setState({showAdd:false})
        
    }
    showSetAuthModal = () => {
        this.setState({showSetAuth:true})
    }
    setAuth = async () => {
        const role = this.state.selectedRole
        const menus = this.setAuthForm.current.getMenus();
        role.menus = menus
        //指定授权人
        role.auth_name = memoryUtils.user.username;
        const result = await reqUpdateRole(role);
        if(result.status === 0){
            message.success('更新角色成功')
            //对象role时roles数组的一个元素  当role的值改变时，roles也随之变化
            //即【变量role】保存的地址和【roles数组】中保存的地址指向相同的对象
            this.setState({showSetAuth:false,role:[...this.state.roles]})
        }
    }
    onRow = (role) =>{
        //role为触发事件的表格行对象
        return {
            //event为事件对象
            onClick: event => {
                this.setState({selectedRole:role})
            },
        }
    }
    getRoles = async () => {
        const result = await reqGetRoles();
        if(result.status === 0){
            this.setState({roles:result.data})
        }
    }
    componentDidMount(){
        this.getRoles()
        
    }
    render() {
        const { roles,selectedRole,showAdd,showSetAuth } = this.state
        const title = (
            <span>
                <Button type='primary' style={{ marginRight: 10 }} onClick={this.showAddModal}>创建角色</Button>
                <Button type='primary' disabled={!selectedRole._id} onClick={this.showSetAuthModal}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    onRow={this.onRow}
                    bordere
                    rowKey='_id'   //指定每一行的id
                    rowSelection={{
                        type:"radio",
                        selectedRowKeys:[selectedRole._id], //根据每一行的id指定被选中的行
                        onSelect:(record)=>{
                            this.setState({selectedRole:record})
                        }//点击选择小圆圈的回调，record表示被点击的行对象 这一回调可以实现点击圆圈选中行的功能
                    }} 
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 3}}
                ></Table>
                <Modal title='添加角色' visible={showAdd} onOk={this.addRole} onCancel={this.handleCancel}>
                    <AddForm setForm={form  => this.addForm = form }/>
                </Modal>
                <Modal title='设置权限' visible={showSetAuth} onOk={this.setAuth} 
                    onCancel={()=>{
                        this.setState({showSetAuth:false,})
                    }}>
                    <SetAuthForm role={selectedRole} ref={this.setAuthForm}/>
                </Modal>
            </Card>
        )
    }
}
