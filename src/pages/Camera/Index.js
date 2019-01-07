import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {Row, Col, Form, Card, Select, List, Modal,Divider,Spin,message,  Drawer,Tooltip,Icon} from 'antd';
import Trend from '@/components/Trend';
import TagSelect from '@/components/TagSelect';
import AvatarList from '@/components/AvatarList';
import { MiniArea } from '@/components/Charts';
import Ellipsis from '@/components/Ellipsis';
import StandardFormRow from '@/components/StandardFormRow';
import styles from './Index.less';
import numeral from "numeral";
import ReactHLS from 'react-hls';

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
    gasData: [{"x": "2018-12-20", "y": 50}, {"x": "2018-12-21", "y": 5}, {
      "x": "2018-12-22",
      "y": 4
    }, {"x": "2018-12-23", "y": 2}, {"x": "2018-12-24", "y": 4}, {"x": "2018-12-25", "y": 7}, {
      "x": "2018-12-26",
      "y": 5
    }, {"x": "2018-12-27", "y": 6}, {"x": "2018-12-28", "y": 5}, {"x": "2018-12-29", "y": 9}, {
      "x": "2018-12-30",
      "y": 6
    }, {"x": "2018-12-31", "y": 3}, {"x": "2019-01-01", "y": 1}, {"x": "2019-01-02", "y": 5}, {
      "x": "2019-01-03",
      "y": 3
    }, {"x": "2019-01-04", "y": 6}, {"x": "2019-01-05", "y": 5}]
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
      callback:(a)=>{console.log(JSON.stringify(a))},
    });
  }

  playVideo=(record)=>{
    const { dispatch } = this.props;
    this.setState({fuckingNowPlayCameraId:record.deviceCameras[0].cameraId,restroomName:record.restRoomName,fuckingPushLoading:true});
    if(record.deviceCameras.length>0){
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
    }
    this.setState({
      fuckingPushLoading: false,
      fuckingLiveUrl: undefined,
      autoplay: true,
      paused:false,
    });
    this.setModal1Visible(true);
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

    console.log(`fuck=====${JSON.stringify(list)}`);
    const content=list.data===undefined?[]:list.data.content;
    console.log(`fuck=====${JSON.stringify(content)}`);

    const cardList = content ? (
      <List
        rowKey="restRoomId"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={content}
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
                    <Trend flag="down">
                      气体指数
                      <span className={styles.trendText}>11%</span>
                    </Trend>
                    <Trend flag="up" style={{ marginRight: 16,marginTop:-10 }}>
                      客流量:
                      <span className={styles.trendText}>{numeral(12423).format('0,0')}</span>
                    </Trend>
                  </div>
                  <MiniArea line height={55} data={this.state.gasData} />
                  <Divider style={{marginTop: "4px"}} />
                  <div className={styles.cardItemContent}>
                    <span>{`更新时间:${moment("2018-12-20 23:10:34").fromNow()}`}  责任人: 张红艳</span>
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
