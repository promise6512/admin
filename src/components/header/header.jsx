import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
//antd UI 组件库
import { Modal} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import './header.less'
import {reqWeather} from '../../api/index'
import formateDate from '../../utils/dateUtils'
import menuList from '../../config/menuConfig';

import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';

import LinkButton from '../linkButton/linkButton';
class Header extends Component {
    state = {
        city:'北京',
        weather:'晴',
        currentTime : formateDate(Date.now())
    }
    getWeather = async () => {
        const {weather,city} = await reqWeather('北京')
       // console.log(weather)
        this.setState({weather,city})
    }
    getTime = () => {
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getTitle = (menuList) => {
        //console.log('header',this.props.location.pathname)
        const {pathname} = this.props.location;
        let title;
        menuList.forEach(parent=>{
            if(!parent.children){
                /* if(parent.key === pathname){
                    title = parent.title
                   //console.log(title)
                    return
                } */
                if(pathname.indexOf(parent.key) === 0){
                    title = parent.title
                   //console.log(title)
                    return
                }
            }else{
               //const result = parent.children.find(children => pathname === children.key)
               const result = parent.children.find(children => pathname.indexOf(children.key) === 0)
               if(result){
                   title = result.title;
                   return;
               }
            }
        })
        return title 
    }
    
    confirm = ()=> {
        Modal.confirm({
          title: 'Confirm',
          icon: <ExclamationCircleOutlined />,
          content: '你确定要退出登录吗？',
          okText: '确认',
          cancelText: '取消',
          onOk:()=>{
              storageUtils.removeUser()
              memoryUtils.user = {}
              this.props.history.replace('/login')
          }
        });
      }
    
    componentDidMount(){
        this.getWeather();
        this.getTime();
    }
    //退出登录后会卸载组件 
    //卸载组件前将定时器关闭
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render() {
        //console.log('header')
        const title = this.getTitle(menuList)
        const {weather,currentTime,city} = this.state
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎,{ memoryUtils.user.username}</span>
                    <LinkButton onClick={this.confirm}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span className='span-time'>{currentTime}</span>
                        <span className="span-city">{city}</span>                      
                        <span className='span-weather'>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)