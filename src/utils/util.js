
// 格式化日期
export const formatDate = date => {
    return date
}
import wxp from './wechat'
import Api from '../service/index'

// 关注
export const follow = ({ self, app, userId } = {}) => {
    const { userInfo } = app.globalData
    if (!userInfo) return
    const { userId: followUserId, userType } = userInfo
    if (followUserId === userId) {
        return console.log('interface-关注用户--follow', '关注人与被关注人是同一人')
    }
    return new Promise(resolve => {
        const params = { userId, followUserId, userType } // 接口参数
        Api.follow(params).then(({ data: { code, data, message } }) => {
            if (code === '0101') {
                resolve(data)
            } else {
                resolve('stop')
                console.log('interface-关注用户--follow', code, message)
                wxp.showToast({ title: message, icon: 'none' })
            }
        }).catch(e => {
            console.log('interface-关注用户--follow', e)
        })
    })
}

// 取消关注
export const unFollow = ({ self, app, userId } = {}) => {
    const { userInfo } = app.globalData
    if (!userInfo) return
    const { userId: followUserId, userType } = userInfo
    if (followUserId === userId) {
        return console.log('interface-取消关注用户--unfollow', '关注人与被关注人是同一人')
    }
    return new Promise(resolve => {
        wxp.showModal({
            title: '提示',
            cancelColor: '#999999',
            confirmColor: '#333333',
            content: '确定不再关注TA了？',
        }).then(({ confirm, cancel }) => {
            if (confirm) {
                const params = { userId, followUserId, userType } // 接口参数
                return Api.unFollow(params)
            } else if (cancel) {
                return 'cancel'
            }
        }).then(res => {
            if (res === 'cancel') return resolve('stop')
            const { data: { code, data, message } } = res
            if (code === '0101') {
                resolve(data)
            } else {
                resolve('stop')
                console.log('interface-取消关注用户--unfollow', code, message)
            }
        }).catch(e => {
            console.log('interface-取消关注用户--unfollow', e)
        })
    })
}

// 动态(照片)点赞
export const dyPraise = ({ self, app, userId, dynamicId } = {}) => {
    return new Promise(resolve => {
        const params = { userId, dynamicId }
        const { userInfo } = app.globalData
        if (userInfo) {
            Object.assign(params, { praiseUserId: userInfo.userId, userType: userInfo.userType })
        }
        Api.addFoundNewDetailPraise(params).then(({ data: { code, data, message } }) => {
            if (code === '0101') {
                resolve(data)
            } else {
                resolve('stop')
                console.log('interface-动态(照片)点赞--addFoundNewDetailPraise', code, message)
            }
        })
    })
}

// 取消动态(照片)点赞
export const cancelDyPraise = ({ self, app, userId, dynamicId } = {}) => {
    return new Promise(resolve => {
        const params = { userId, dynamicId }
        const { userInfo } = app.globalData
        if (userInfo) {
            Object.assign(params, { praiseUserId: userInfo.userId, userType: userInfo.userType })
        }
        Api.deleFoundNewDetailPraise(params).then(({ data: { code, data, message } }) => {
            if (code === '0101') {
                resolve(data)
            } else {
                resolve('stop')
                console.log('interface-取消动态(照片)点赞--deleFoundNewDetailPraise', code, message)
            }
        })
    })
}

// 获取推荐用户列表
export const getUserRecommendList = ({ self, app, pageSize = 50 } = {}) => {
    return new Promise(resolve => {
        const params = {}
        const { userInfo } = app.globalData
        if (userInfo) Object.assign(params, { userId: userInfo.userId, pageSize })
        Api.getUserRecommendList(params).then(({ data: { code, data, message } }) => {
            if (code === '0101') {
                resolve(data)
            } else {
                resolve('stop')
                console.log('interface-获取推荐用户列表--getUserRecommendList', code, message)
            }
        })
    })
}

// 批量关注用户
export const batchFollow = ({ self, app, beFollowUserIds } = {}) => {
    const { userInfo } = app.globalData
    if (!userInfo) return console.error('interface-批量关注用户--batchFollow', '请获取当前用户userId')
    return new Promise(resolve => {
        const params = { beFollowUserIds }
        Object.assign(params, { userId: userInfo.userId, userType: userInfo.userType })
        Api.batchFollow(params).then(({ data: { code, data, message } }) => {
            if (code === '0101') {
                resolve(data)
            } else {
                resolve('stop')
                console.log('interface-批量关注用户--batchFollow', code, message)
            }
        })
    })
}

// 发布动态(照片)
export const dyPublish = ({ app, uploadInfo } = {}) => {
    let { url, userId, imageList, tagIdList, content, imgInfoList } = app.uploadParam
    return new Promise((resolve, reject) => {
        app.statusCache.isUploadAll = false
        app.statusCache.isPublishSuccess = false
        // 图片上传
        wxp.uploadImgPromise({ url, userId, imageList }).then(res => {
            const obj = res.filter(v => v.code === '0002')
            let title = null
            if (obj.length) title = v.message
            // 判断图片上传是否成功
            if (title) {
                wx.showToast({ title, icon: 'none' })
                return
            } else {
                return res
            }
        }).then(res => {
            if (!res) return
            // 发布动态-参数
            const imageList = imgInfoList.map((o, index) => ({ width: o.width, height: o.height, path: res[index].data }))
            if (tagIdList && tagIdList.length) tagIdList = tagIdList.map(item => Number(item))
            const publishParam = { userId, content, tagIdList, imageList }
            // 发布内容
            return Api.getPublishAlbum(publishParam)
        }).then(res => {
            if (!res) return
            const { data: { code, data, message } } = res // 上一个方法return数据
            if (code === '0101') {
                uploadInfo.uploadState = false
                wx.showToast({
                    title: '发布成功',
                    icon: 'none'
                })
                app.statusCache.isUploadAll = true
                app.statusCache.isPublishSuccess = false
                app.statusCache.cropperImage = null
                app.statusCache.cropperType = null
                app.statusCache.isFirstIn = true
                app.uploadParam = {
                    url: null,
                    userId: null,
                    imageList: null,
                    tagIdList: null,
                    content: null,
                    imgInfoList: null
                }
            } else if (code === '0103') {
                wx.showToast({ title: '发布失败', icon: 'none' })
                uploadInfo.uploadState = false
                app.statusCache.isUploadAll = true
            } else if (code === '0401') {
                wx.showToast({ title: message, icon: 'none' })
                uploadInfo.uploadState = false
                app.statusCache.isUploadAll = true
            }
            resolve()
        }).catch(res => {
            console.log('图片上传失败', res)
            wx.showToast({ title: '图片上传失败', icon: 'none' })
            uploadInfo.uploadState = false
            app.statusCache.isUploadAll = true
            // this.setData({ uploadInfo })
            reject(`图片上传失败::${res}`)
        })
    })
}

// 授权失败处理
export const checkSettingStatus = (scopes) => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                if (Object.keys(res.authSetting).length === 0) {
                    // 首次授权（授权列表为空）
                } else {
                    // 不是首次授权
                    let title = '请允许以下权限'
                    let contents = ''
                    // 拿到被用户拒绝授权的（注意：不是从未授权的）
                    for (let [index, elem] of Object.entries(scopes)) {
                        if (elem in res.authSetting && res.authSetting[elem] == false) {
                            contents += `【${index}】\n`
                        }
                    }
                    // 未授权提醒
                    if (contents != '') {
                        wx.showModal({
                            title: title,
                            content: contents,
                            showCancel: false,
                            success: res => {
                                if (res.confirm) {
                                    wx.openSetting({
                                        success: res => {
                                            let result = false
                                            console.log(res)
                                            // 拿到被用户拒绝授权的（注意：不是从未授权的）
                                            for (let [index, elem] of Object.entries(scopes)) {
                                                if (res.authSetting[elem] == false) {
                                                    result = false
                                                } else {
                                                    result = true
                                                }
                                            }
                                            resolve(result)
                                        },
                                        fail: (err) => {
                                            reject(err)
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            }
        })
    })
}

