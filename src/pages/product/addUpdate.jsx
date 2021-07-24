import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LinkButton from '../../components/linkButton/linkButton';
import { reqCategorys, reqAddProduct, reqUpdateProduct} from '../../api';
import PictureWall from './pictureWall';
import RichTextEditor from './RichTextEditor';
export default class ProductAddUpdate extends Component {
    state = {
        options: []
    }
    constructor(props) {
        super(props)
        this.PictureWall = React.createRef() //创建容器对象
        this.RichTextEditor = React.createRef()
        //console.log(this.props.location.state)
    }
    //values为对象，其中包括各个Item的值
    onFinish = async (values) => {
        const imgs = this.PictureWall.current.getImgList()
        const detail = this.RichTextEditor.current.getTextContent()
        //  console.log(imgs,detail,values) 
        //reqAddProduct = (pCategoryId,categoryId,name,desc,price,detail,imgs)
        /* categoryId,
         ["image-1627115727929.png"] "<p>美的空调 你值得拥有</p>\n" 
         {productName: "美的", productDesc: "美的空调 节能又不冷", productPrice: "998", productCategory: Array(2)}
        */
         //console.log(this.props.location.state)
        const { productName, productDesc, productPrice, productCategory } = values;
        if (this.isUpdate) {
            const {currentPageNum,searchName,searchType} = this.props.location.state;
            const result = await reqUpdateProduct(this.product._id,productCategory[0], productCategory[1], productName, productDesc,
                productPrice, detail, imgs
            )
            if(result.status === 0) {
                message.success('修改商品成功')
            }
            this.props.history.push('/product',{currentPageNum,searchName,searchType})
        } else {
           // console.log('add@@@')
            const {searchName,searchType,total} = this.props.location.state
            const result = await reqAddProduct(productCategory[0], productCategory[1], productName, productDesc,
                productPrice, detail, imgs
            )
            //console.log(result)
            if (result.status === 0) {
               // console.log('add@@@')
                message.success('添加商品成功')
                this.props.history.push('/product',{searchName,searchType,total})
            }
        }
        
    }
    validatePrice = (_, value) => {
        if (value * 1 < 0) {
            return Promise.reject(new Error('价格必须大于0'))

        } else {
            return Promise.resolve()
        }
    }
    initOptions = async (categorys) => {
        //categorys为分类列表
        const options = categorys.map(element => ({ value: element._id, label: element.name, isLeaf: false }))
        const { isUpdate, product } = this;
        //如果是在修改商品信息
        if (isUpdate) {
            const { pCategoryId } = product;
            //如果存在二级分类
            if (pCategoryId !== '0') {
                const subCategoryArr = await reqCategorys(pCategoryId)
                const targetOption = options.find(element => element.value === pCategoryId);
                //console.log(targetOption)
                if (subCategoryArr.status === 0) {
                    targetOption.children = subCategoryArr.data.map(element => ({
                        label: element.name,
                        value: element._id,
                        isLeaf: true
                    }))
                }
            }
        }
        this.setState({ options })
    }
    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[0];//targetOption表示选择的上一级option
        targetOption.loading = true;
        const subCategorys = await this.getCategorys(targetOption.value)
        //如果存在二级列表 则显示二级列表
        if (subCategorys && subCategorys.length > 0) {
            targetOption.loading = false;
            targetOption.children = subCategorys.map(element => ({
                label: element.name,
                value: element._id,
                isLeaf: true
            }))
            //如果不存在二级列表 
        } else {
            targetOption.loading = false;
            targetOption.isLeaf = true
        }
        //虚假更新状态以调用render更新界面
        this.setState({ options: [...this.state.options] })
    };
    //异步获取一级分类列表和二级分类列表
    /*  
         async函数的返回值是一个新的promise ，promise的结果和值有async函数决定
             规则和Promise.then()返回的一样
     */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            //如果是一级分类列表
            if (parentId === '0') {
                this.initOptions(result.data)
            } else {
                return result.data
            }
        }
    }
    UNSAFE_componentWillMount() {
        //通过逻辑运算 防止product为undefined时报错
        // const product = this.props.location.state.product || {};
        if (this.props.location.state&&this.props.location.state.product) {
            //console.log(this.props.location.state)
            this.product = this.props.location.state.product;
            //this.update用于标记时添加商品还是更新商品
            this.isUpdate = true
        } else {
            // this.isUpdate = !!{};
            this.product = {}
            this.isUpdate=false
        }
     //   this.isUpdate = !!this.props.location.state
    }
    componentDidMount() {
        this.getCategorys('0')
        //console.log(this.product)

        /*  
          this.product：
        {
             categoryId: "5fc74b650dd9b10798413162"
             desc: "????????????????????????X390???T490???????????? ????????????????????????9"
             detail: "<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">?????????????????????????????????????????????????????????????????????????????????office??????????????????????????????????????????</span></p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">?????????Lenovo?????????V110 15.6????????????????????????????????????????????????????????? ?????????E2-9010/4G/128G????????? 2G?????? ?????</span></p>\n<p></p>\n"
             imgs: ["1578588737108-index.jpg"]
             name: "??????ThinkPad ???4809"
             pCategoryId: "5e12b8bce31bb727e4b0e348"
             price: 6300
             status: 2
             __v: 0
             _id: "5e12b97de31bb727e4b0e349"
 
         } */
    }
    render() {
        const { product } = this;
        const { categoryId, pCategoryId } = product;
        const categoryIdArr = [];
        if (pCategoryId) {
            categoryIdArr.push(pCategoryId, categoryId)
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ color: "#1DA57A", fontSize: 20 }} />
                </LinkButton>&nbsp;
                <span>{this.isUpdate ? '修改商品' : '添加商品'}</span>
            </span >
        )
        return (
            <Card title={title}>
                <Form
                    labelCol={{ span: 2 }} //左侧label的宽度
                    wrapperCol={{ span: 8 }} //指定右侧包裹的宽度
                    //ref={c => this.form = c}
                    onFinish={this.onFinish} //onFinish指定的回调会在表单通过验证提交后调用
                >
                    <Form.Item label='商品名称' name='productName'
                        initialValue={product.name}
                        rules={[
                            { required: true, whitespace: true, message: '必须输入商品名称' }
                        ]}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Form.Item>
                    <Form.Item label='商品描述' name='productDesc'
                        initialValue={product.desc}
                        rules={[
                            { required: true, whitespace: true, message: '必须输入商品描述' }
                        ]}
                    >
                        <Input.TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} showCount />
                    </Form.Item>
                    <Form.Item label='商品价格' name='productPrice'
                        initialValue={product.price}
                        rules={
                            this.isUpdate ? [{ validator: this.validatePrice }] : [
                                { required: true, whitespace: true, message: '必须输入商品价格' },
                                { validator: this.validatePrice }
                            ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'/* 指定后缀 */ />
                    </Form.Item>
                    <Form.Item label='商品分类' name='productCategory'
                        initialValue={categoryIdArr}
                    >
                        <Cascader
                            placeholder='指定商品分类'
                            options={this.state.options}  //指定需要显示的列表数据
                            loadData={this.loadData}  //指定当选择某个列表项加载下一级列表的回调
                        />
                    </Form.Item>
                    <Form.Item label='商品图片'>
                        <PictureWall ref={this.PictureWall /* 将组件对象保存在容器中 */}
                            imgNameList={this.product.imgs}
                        >
                        </PictureWall>
                    </Form.Item>
                    <Form.Item label='商品详情'
                        labelCol={{
                            span: 2
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                    >
                        <RichTextEditor ref={this.RichTextEditor}
                            detail={this.product.detail}
                        >
                        </RichTextEditor>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            span: 8,
                            offset: 4
                        }}
                    >
                        <Button type="primary" htmlType="submit">{/* 必须指定 htmlType="submit"才能配合onFinish使用*/}
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}
