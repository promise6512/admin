import React, { Component } from 'react'
import { Switch,Route ,Redirect} from 'react-router-dom'
import ProductHome from './home';
import ProductDetail from './detail';
import ProductAddUpdate from './addUpdate';
import './product.less'
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact></Route>
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Redirect to='/product'></Redirect>
            </Switch>
        )
    }
}
