import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
export default class RichTextEditor extends Component {
   /*  state = {
        editorState: EditorState.createEmpty() //初始化:创建一个没有内容的编辑对象
    } */
    static propTypes = {
        detail:PropTypes.string
    }
    constructor(props){
        super(props)
        //console.log(props)
        //console.log(htmlToDraft(props.detail))
        if(props.detail){
            const contentBlock = htmlToDraft(props.detail);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState:editorState
            }
        }else{
            //如果没有传入初始属性 则创建一个没有内容的编辑对象
            this.state = {
                editorState:EditorState.createEmpty()
            }
        }
        
    }
    //输入过程实时调用该方法--->受控组件
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    //定义方法用于获取文本内容
    getTextContent = () => {
        const {editorState} = this.state;
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }
    uploadImageCallBack = (file) =>{
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');  //指定服务器地址
            const data = new FormData();
            data.append('image', file);  //指定post请求参数
            xhr.send(data);
            //绑定成功的监听
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText); //将JSON解析为JavaScript的值/对象
              const url = response.data.url //得到图片的url
              resolve({data: {link: url}})
            });
            //绑定失败的监听
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }
    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{ border: '1px black solid', minHeight: '200px', padding: '0 10px' }}
                onEditorStateChange={this.onEditorStateChange}//绑定监听:实时更新state，并重新渲染界面
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
        );
    }
}