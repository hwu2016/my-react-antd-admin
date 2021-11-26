import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default class RichText extends Component {
    static propTypes = {
        detail: PropTypes.string
      }


    state = {
        editorState: EditorState.createEmpty(),
    };

    constructor(props) {
        super(props)
        const html = this.props.detail
        if (html) { // 如果有值, 根据html格式字符串创建一个对应的编辑对象
          const contentBlock = htmlToDraft(html)
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          const editorState = EditorState.createWithContent(contentState)
          this.state = {
            editorState,
          }
        } else {
          this.state = {
            editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
          }
        }
    
      }
    

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        })
    }

    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state;
        return (
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorStyle={{border: '1px solid lightgray', minHeight: 150, textIndent: '1em',}}
                    onEditorStateChange={this.onEditorStateChange}
                />
        );
    }
}
