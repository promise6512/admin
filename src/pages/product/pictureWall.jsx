import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import React from 'react'
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../api'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {
    static propTypes = {
        imgNameList:PropTypes.array
    }
    //初始化状态
    constructor(props) {
        //props就是this.props
        super(props)
        let fileList = [];
        if (props.imgNameList && props.imgNameList.length > 0) {
            fileList = props.imgNameList.map((element, index) => ({
                uid: -index, //每个file有自己唯一的id
                name: element, 
                status: 'done',  //图片的状态 
                url: 'http://localhost:5000/upload' + element,//图片地址--->用于获取图片
            }))
        }
       //注意:在构造器中不能使用setState初始化状态
        this.state={
            previewVisible: false, 
            previewImage: '',  
            fileList
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = async ({ file, fileList }) => {
        //fileList表示所有已上传的图片数组
        //file 表示当前上传的图片
        //一旦上传成功
        //console.log(file.status)
        if (file.status === 'done') {
            // console.log(file)
            const result = file.response //{status:0, data:{name:'xx',url:"http://localhost:5000/upload/image-1627103673828.png"}}
            if (result.status === 0) {
                // console.log('@@@')
                message.success('上传图片成功')
                const { name, url } = result.data;
                //  file = fileList[fileList.length-1]
                file.name = name;
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') {
            console.log(file.name)
            const result = await reqDeleteImg(file.name);
            if (result.status === 0) { message.success('删除图片成功') }
        }
        // console.log(fileList,file)
        this.setState({ fileList })
    };
    //定义一个用于获取图片列表的方法
    getImgList = () => {
        return this.state.fileList.map(element => (element.name))
    }
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    accept='image/*' //只接收图片
                    action="/manage/img/upload" /* 图片上传接口地址 */
                    name='image'  /* http请求的请求参数名，而参数值就是文件本身 */
                    listType="picture-card" //图片的显示方式
                    fileList={fileList}
                    onPreview={this.handlePreview} //绑定监听 点击后可显示大图
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton} {/* 图片大于8张后UpLoad消失 */}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
