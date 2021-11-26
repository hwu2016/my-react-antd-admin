import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { reqDeleteImg } from '../../../../../api';
import { BASE_IMG_URL } from '../../../../../utils/constant';

export default class PicUpload extends Component {
    constructor(props) {
        super(props)
        let fileList = []
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList
        }
    }

    static propTypes = {
        imgs: PropTypes.array
    }

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleChange = async ({ file, fileList }) => {
        if (file.status === 'done') {
            const res = file.response
            if (res.status === 0) {
                const { name, url } = res.data
                file.name = name
                file.url = url
                message.success('图片上传成功')
            } else {
                message.error('图片上传失败')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.data.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList  } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="http://localhost:3000/api/manage/img/upload"
                    listType="picture-card"
                    accept='image/*'
                    name='image'
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
