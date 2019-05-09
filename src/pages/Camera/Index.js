import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {Row, Col, Form, Card, Select, List, Modal,Divider,Spin,message,  Drawer,Tooltip,Icon, Tag} from 'antd';
import Trend from '@/components/Trend';
import TagSelect from '@/components/TagSelect';
import AvatarList from '@/components/AvatarList';
import { MiniArea } from '@/components/Charts';
import numeral from "numeral";
import ReactHLS from 'react-hls';
import Iframe from 'react-iframe';
import styles from './Index.less';

const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */

@connect(({ restroom,device, loading }) => ({
  restroom,
  loading: loading.effects['restroom/fetch'],
  fuckloading: loading.effects['device/pushStream'],
}))
@Form.create({})
class CoverCardList extends PureComponent {

  state = {
    modal1Visible: false,
    restroomName: undefined,

    fuckingPushLoading: false,
    fuckingLiveUrl: undefined,
    fuckingNowPlayCameraId: undefined,
    autoplay: true,
    paused:false,

    cardListContent: [],
  }

  setModal1Visible(modal1Visible) {
    this.setState({
      fuckingPushLoading: false,
      fuckingLiveUrl: undefined,
      autoplay: true,
      paused:false,
    });
    this.setState({ modal1Visible });
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'restroom/fetch',
      callback:(a)=> {
        if (a.code === -1) return;
        const content = a.data === undefined ? [] : a.data.content;
        console.log(`所有公厕数据 ${  JSON.stringify(content)}`);
        let newContent = {};
        try
        {
          content.map(one => {
            const { dispatch } = this.props;
            dispatch({
              type: 'gasinfo/fetch',
              payload: {
                restRoomId: one.restRoomId,
                startTm:Math.round(moment().subtract(10, "minutes").valueOf()/1000),
                endTm:Math.round(new Date().getTime()/1000),
              },callback: (v) => {

                if(v.code!==-1){
                  newContent={...one,infoGases:v.data.data.items};
                }
                else {
                  newContent={...one};
                }
                console.log(`newcon${JSON.stringify(newContent)}`);
                this.setState({
                  cardListContent:[...this.state.cardListContent,newContent],
                });
              }
            });
            return 0;
          })
        }
        catch (e) {
          console.log(`马克思大家撒开多久 ${  JSON.stringify(newContent)}`);
        }


        console.log(`嘛嘛嘛吗吗吗木木木木木木木木木木木木 ${  JSON.stringify(newContent)}`);
      }
    });
  }

  playVideo=(record)=>{
    const { dispatch } = this.props;

    if(record.deviceCameras.length>0){
      this.setState({fuckingNowPlayCameraId:record.deviceCameras[0].cameraId,restroomName:record.restRoomName,fuckingPushLoading:true});
      //不能现在获取。。。因为数据没更新现在都是空的只有在pushStream之后才有数据
      //this.setState({fuckingLiveUrl:record.deviceCameras[0].liveUrl});
      dispatch({
        type: 'device/pushStream',
        payload: {
          cameraId:record.deviceCameras[0].cameraId,
        },
        callback:(v)=>{
          if(v.code===0){
            this.setState({
              fuckingLiveUrl:v.data,
              fuckingPushLoading:false,
            })
          }
          else message.error(v.msg);
        },
      });
      this.setState({
        fuckingPushLoading: false,
        fuckingLiveUrl: undefined,
        autoplay: true,
        paused:false,
      });
      this.setModal1Visible(true);
    }
    else{
      message.error("该公厕还未安装摄像头");
    }

  }

  render() {
    const {
      restroom: { list},
      loading,
      fuckloading,
      form,
    } = this.props;
    const {restroomName,autoplay,paused,fuckingPushLoading,fuckingLiveUrl}=this.state;
    const { getFieldDecorator } = form;



    console.log(`fuck=====${JSON.stringify(this.state.cardListContent)}`);

    const cardList = this.state.cardListContent ? (
      <List
        rowKey="restRoomId"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={this.state.cardListContent}
        renderItem={item => (
          <List.Item>
            <Spin spinning={fuckingPushLoading} tip="Loading...">
              <Card
                onClick={this.playVideo.bind(this,item)}
                className={styles.card}
                hoverable
                cover={<img alt={item.restRoomName} src="https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/map/pic/item/a9d3fd1f4134970a4f3e0c1398cad1c8a7865db8.jpg" />}
              >
                <Card.Meta title={item.restRoomName} />
                <div>
                  <Trend flag="up" style={{ marginRight: 16,marginTop:-10 }}>
                      客流量:
                    <span className={styles.trendText}>{numeral(12423).format('0,0')}</span>
                  </Trend>
                  <br />
                  <Trend>
                      气味:
                      男厕
                    <span className={styles.trendText}>
                      {
                          item.infoGases.length === 0 ? "-" : item.infoGases.filter(aa => aa.type === 2).map(bb => {
                              if (bb.zq >= 0 && bb.zq <= 1.5) return  <Tag color="green">优秀</Tag>;
                              if (bb.zq > 1.5 && bb.zq <= 3) return <Tag color="green">良好</Tag>;
                              if (bb.zq > 3 && bb.zq <= 5) return <Tag color="green">正常</Tag>;
                              if (bb.zq > 5 && bb.zq <= 7) return  <Tag color="orange">较差</Tag>;
                              return <Tag color="#f50">极差</Tag>;
                            }
                          )
                          // item.infoGases.filter(aa=>aa.type===3).map(bb=>{
                          //   console.log("厕所数据"+JSON.stringify(bb));
                          //   return bb.zq;
                          // })
                        }
                    </span>
                  </Trend>
                  <Trend>
                      女厕
                    <span className={styles.trendText}>{item.infoGases.length===0?"-":item.infoGases.filter(aa=>aa.type===1).map(bb=>{
                        if (bb.zq >= 0 && bb.zq <= 1.5) return  <Tag color="green">优秀</Tag>;
                        if (bb.zq > 1.5 && bb.zq <= 3) return <Tag color="green">良好</Tag>;
                        if (bb.zq > 3 && bb.zq <= 5) return <Tag color="green">正常</Tag>;
                        if (bb.zq > 5 && bb.zq <= 7) return  <Tag color="orange">较差</Tag>;
                        return <Tag color="#f50">极差</Tag>;
                        }
                      )}
                    </span>
                  </Trend>
                  <Trend>
                      大厅
                    <span className={styles.trendText}>{item.infoGases.length===0?"-":item.infoGases.filter(aa=>aa.type===0).map(bb=>{
                        if (bb.zq >= 0 && bb.zq <= 1.5) return  <Tag color="green">优秀</Tag>;
                        if (bb.zq > 1.5 && bb.zq <= 3) return <Tag color="green">良好</Tag>;
                        if (bb.zq > 3 && bb.zq <= 5) return <Tag color="green">正常</Tag>;
                        if (bb.zq > 5 && bb.zq <= 7) return  <Tag color="orange">较差</Tag>;
                        return <Tag color="#f50">极差</Tag>;
                      })}
                    </span>
                  </Trend>
                  <Trend>
                      无障碍
                    <span className={styles.trendText}>{item.infoGases.length===0?"-":item.infoGases.filter(aa=>aa.type===3).map(bb=>{
                        if (bb.zq >= 0 && bb.zq <= 1.5) return  <Tag color="green">优秀</Tag>;
                        if (bb.zq > 1.5 && bb.zq <= 3) return <Tag color="green">良好</Tag>;
                        if (bb.zq > 3 && bb.zq <= 5) return <Tag color="green">正常</Tag>;
                        if (bb.zq > 5 && bb.zq <= 7) return  <Tag color="orange">较差</Tag>;
                        return <Tag color="#f50">极差</Tag>;
                      })}
                    </span>
                  </Trend>
                </div>
                {/*<MiniArea line height={55} data={this.state.gasData} />*/}
                <Divider style={{marginTop: "4px"}} />
                <div className={styles.cardItemContent}>
                  <span>责任人: {item.cleaner===""||item.cleaner==null?'-':item.cleaner}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`更新时间:${item.updateTime===null?"-":moment(item.updateTime).fromNow()}`}</span>
                </div>
              </Card>
            </Spin>
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div className={styles.coverCardList}>
        <Modal
          title={`${restroomName}-直播`}
          width="70%"
          footer={null}
          maskClosable={false}
          style={{ top: 20,bottom:20 }}
          visible={this.state.modal1Visible}
          onCancel={() => {
            alert(window.frames["myId"].document);
            const { dispatch } = this.props;
            dispatch({
              type: 'device/stopStream',
              payload: {
                cameraId:this.state.fuckingNowPlayCameraId,
              },
              callback:(v)=>{
                if(v.code===0){
                  this.setState({
                    fuckingLiveUrl:undefined,
                    fuckingPushLoading:false,
                    autoplay:false,
                    paused:true,
                  });
                }
                else message.error(v.msg);
              },
            });
            this.setModal1Visible(false)
          }}
        >
          <Spin spinning={fuckloading} size="large" tip="视频载入中...请耐心等待">
            <ReactHLS width="100%" height="70%" controls={false} paused={this.state.paused} preload="none" poster="https://ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/map/pic/item/a9d3fd1f4134970a4f3e0c1398cad1c8a7865db8.jpg" autoplay={this.state.autoplay} url={this.state.paused?undefined:this.state.fuckingLiveUrl} />
          </Spin>
          {/*可以用iframe引用海康摄像头的sdk*/}
          {/*<iframe style={{border:0,width:"100%",height:630,}} src="http://www.baidu.com"/>*/}
          {/*<video height="500" width="100%" src="http://www.w3school.com.cn/i/movie.ogg" controls="controls">*/}
          {/*your browser does not support the video tag*/}
          {/*</video>*/}
          {/*<Iframe url="http://192.168.10.10"*/}
          {/*width="100%"*/}
          {/*height="100%"*/}
          {/*id="myId"*/}
          {/*className="myClassname"*/}
          {/*display="initial"*/}
          {/*position="relative"/>*/}

          <Iframe url="http://192.168.10.10"
                  width="100%"
                  height="450px"
                  id="myId"
                  className="myClassname"
                  display="initial"
                  position="relative"/>

        </Modal>

        {/*<Card bordered={false}>*/}
        {/*<Form layout="inline">*/}
        {/*<StandardFormRow title="所属区域" block style={{ paddingBottom: 11 }}>*/}
        {/*<FormItem>*/}
        {/*{getFieldDecorator('category')(*/}
        {/*<TagSelect expandable value={['cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6']}>*/}
        {/*<TagSelect.Option value="cat1">海曙区</TagSelect.Option>*/}
        {/*<TagSelect.Option value="cat2">鄞州区</TagSelect.Option>*/}
        {/*<TagSelect.Option value="cat3">江北区</TagSelect.Option>*/}
        {/*<TagSelect.Option value="cat4">镇海区</TagSelect.Option>*/}
        {/*<TagSelect.Option value="cat5">北仑区</TagSelect.Option>*/}
        {/*<TagSelect.Option value="cat6">奉化区</TagSelect.Option>*/}
        {/*</TagSelect>*/}
        {/*)}*/}
        {/*</FormItem>*/}
        {/*</StandardFormRow>*/}
        {/*<StandardFormRow title="其它选项" grid last>*/}
        {/*<Row gutter={16}>*/}
        {/*<Col lg={8} md={10} sm={10} xs={24}>*/}
        {/*<FormItem {...formItemLayout} label="状态">*/}
        {/*{getFieldDecorator('author', {})(*/}
        {/*<Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>*/}
        {/*<Option value="2">不限</Option>*/}
        {/*<Option value="1">开放</Option>*/}
        {/*<Option value="0">关闭</Option>*/}
        {/*</Select>*/}
        {/*)}*/}
        {/*</FormItem>*/}
        {/*</Col>*/}
        {/*</Row>*/}
        {/*</StandardFormRow>*/}
        {/*</Form>*/}
        {/*</Card>*/}
        <div className={styles.cardList}>{cardList}</div>
      </div>
    );
  }
}

export default CoverCardList;
