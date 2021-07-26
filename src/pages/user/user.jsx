import React, { Component } from 'react'
import { Card, Button, Table, Modal,message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../../components/linkButton/linkButton';
import UserForm from './UserForm';
import { reqGetUsers,reqDeleteUser,reqAddUser,reqUpdateUser } from '../../api';
import formateDate from '../../utils/dateUtils'
export default class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            roles: [],
            isShow: false

        }
    }
    getUsers = async () => {
        const result = await reqGetUsers();
        if (result.status === 0) {
            //console.log(result)
            this.setState({ users: result.data.users, roles: result.data.roles })
            this.initRolesIdToName()
        }
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render:create_time =>formateDate(create_time)
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => {
                    //console.log(this)
                    //console.log(this.rolesIdToName)
                    // console.log('rolesIdToName' in this)
                    return this.state.roles.find(element => element._id === role_id).name
                    //return this.rolesIdToName[role_id]
                }
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }
    deleteUser = (user) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: `确定删除${user.username}吗`,
            okText: '确认',
            cancelText: '取消',
            onOk:async ()=>{
                const result = await reqDeleteUser(user._id);
                if(result.status === 0)
                message.success(`成功删除${user.username}`)
                this.getUsers()
            }
        });
    }
    showAdd = () => {
        this.user = {}
        this.setState({isShow:true})
    }
    showUpdate = (user) => {
        this.user = user
        this.setState({isShow:true})
    }
    addOrUpdateUser = async () => {
        //console.log(this.form)
        if(this.user._id){
            const user  = this.form.getFieldsValue(true);
          //  console.log(user)
            user._id = this.user._id;
            const result = await reqUpdateUser(user);
          //  console.log(result)
            if(result.status === 0){
                message.success('修改用户成功')
            }
        }else{
           // console.log(this.form)
            const user  = this.form.getFieldsValue(true)
           // console.log(user)
            const result = await reqAddUser(user)
            if(result.status === 0){
                message.success('添加用户成功')
            }
        }
        this.getUsers()
        //this.form.resetFields()
        this.setState({isShow:false})
    }
    //根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
    initRolesIdToName = () => {
        // console.log(this.state.roles)
        this.rolesIdToName = this.state.roles.reduce((acc, cur) => {
            //console.log(acc,cur)
            acc[cur._id] = cur.name
            return acc
        }, {})
        //console.log(this.rolesIdToName)
    }
    componentDidMount() {
        this.getUsers()
        //console.log(this.state)
        //this.initRolesIdToName()
        this.initColumns()
    }
    render() {
        const { users, isShow,roles } = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    bordere
                    rowKey='_id'   //指定每一行的id
                    dataSource={users}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 3 }}
                ></Table>
                <Modal
                    title={user._id?'修改用户':'创建用户'}
                    visible={isShow}
                     onOk={this.addOrUpdateUser} 
                    onCancel={() => {
                        this.setState({ isShow: false, })
                       //this.form.resetFields()
                    }}>
                    <UserForm roles={roles} user={{...this.user}} setForm={ form => this.form = form }></UserForm>
                </Modal>
            </Card>
        )
    }
}
