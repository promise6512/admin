import React, { Component } from 'react'
import './linkButton.less'
/* 
   一个外形像链接的按钮
*/
export default class LinkButton extends Component {
    render() {
        return (
            <button {...this.props} className='link-button'></button>
        )
    }
}
