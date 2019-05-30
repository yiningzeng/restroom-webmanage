import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { getTimeDistance } from '@/utils/utils';
import { Row, Col, Card, Form, Badge, List, Avatar,Icon, message } from 'antd';
import DataSet from "@antv/data-set";
// import StandardTable from '@/components/StandardTable';
import MyStandardTable from '@/components/MyStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';
import fuckStyles from './Analysis.less';
import { Map,Marker,InfoWindow } from "react-amap";
import InfiniteScroll from 'react-infinite-scroller';
import { TimelineChart } from '@/components/Charts';


const SalesCard = React.lazy(() => import('./SalesCard'));
//高德地图组件使用方法 https://elemefe.github.io/react-amap/components/infowindow
/* eslint react/no-multi-comp:0 */
@connect(({ restroom,device, loading }) => ({
  restroom,
  device,
  loading: loading.effects['restroom/fetch'],
  loadingDevice: loading.effects['device/fetch']
}))
@Form.create()
class Index extends PureComponent {
  state = {
    rangePickerValue: getTimeDistance('day'),
    restRoomId: 1,
    isActive: "today",

    gasFlow:undefined,
    weatherInfo: undefined,
    map:{
      center:[121.554074,29.834609],
    },
    infoWindow:{
      position:[121.554074,29.834609],
      visible:false,
      name:undefined,
      status:'processing',
      statusText:'公厕开放',
      videoStatus:'default',
      videoStatusTest:'视频正常',
      gasStatus:'success',//
      gasStatusText:'气味正常',//
      boardStatus:'success',
      boardStatusText:'公告正常',
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;

    this.setState({
      ...this.state,
      rangePickerValue: [moment().subtract(1, "days"),moment(new Date())]
    });
    sessionStorage.setItem("select", "today");
    sessionStorage.setItem("startTime", getTimeDistance("today")[0]);
    sessionStorage.setItem("endTime", getTimeDistance("today")[1]);
    dispatch({
      type: 'restroom/weather',
      payload: {
        page:0,
        size:1000,
      },
      callback:(a)=>{this.setState({...this.state,weatherInfo:a})},
    });
    const startTime=moment(sessionStorage.getItem("startTime")).format('YYYY-MM-DD 06:00:00');
    const endTime = moment(sessionStorage.getItem("endTime")).format('YYYY-MM-DD 22:00:00');
    // message.success("fuckckckckck"+JSON.stringify(this.state.rangePickerValue));
    dispatch({
      type: 'restroom/fetch',
      payload: {
        page:0,
        size:1000,
      },
      callback:(a)=>{
        dispatch({
          type: 'restroom/getFuckFlow',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: 1,
            startTm: startTime,//moment().subtract(1, "days").format('YYYY-MM-DD 00:00:00'),
            endTm: endTime,//moment(new Date()).format('YYYY-MM-DD 00:00:00'),
          },
          callback:(a)=>{
            // this.setState(gasFlow: a.)
            // message.success(`${JSON.stringify(this.state.gasFlow)}`);
          },
        });
      },
    });

  }

  searchData = (activeKey,searchType) =>{
    // message.error(activeKey+" "+searchType);
    const { dispatch } = this.props;
    this.setState({
      ...this.state,
      restRoomId: activeKey
    });
    let startformat='YYYY-MM-DD 06:00:00';
    let endformat='YYYY-MM-DD 22:00:00';
    if(searchType === 1){
      startformat='YYYY-MM-DD 00:00:00';
      endformat='YYYY-MM-DD 23:59:59';
    }
    const startTime = moment(sessionStorage.getItem("startTime")).format(startformat);
    const endTime = moment(sessionStorage.getItem("endTime")).format(endformat);
    // message.success("malegebi"+JSON.stringify(startTime)+" "+JSON.stringify(endTime));
    try
    {
      dispatch({
        type: 'restroom/getFuckFlow',
        payload: {//1?endTm=1557368198&startTm=1557281798
          restRoomId: activeKey,
          startTm: startTime,//Math.round([0].valueOf()/1000),//Math.round(moment().subtract(1, "days").valueOf()/1000),
          endTm: endTime,//Math.round(this.state.rangePickerValue[1].valueOf()/1000),//Math.round(new Date().getTime()/1000),
          type: searchType,
        },
        callback:(a)=>{
          // this.setState(gasFlow: a.)
          // message.success(`${JSON.stringify(this.state.gasFlow)}`);
        },
      });
    }
    catch (e) {
    }
  }

  selectDate = type => {
    sessionStorage.setItem("startTime", getTimeDistance(type)[0]);
    sessionStorage.setItem("endTime", getTimeDistance(type)[1]);
    sessionStorage.setItem("select", type);
    this.setState({
      isActive: type,
      rangePickerValue: [...getTimeDistance(type)],
    });
    if(type !== "today") this.searchData(this.state.restRoomId,1);
    else this.searchData(this.state.restRoomId, 0);

    // this.searchData(this.state.restRoomId);
  };


  handleRangePickerChange = rangePickerValue => {
    sessionStorage.setItem("startTime", rangePickerValue[0]);
    sessionStorage.setItem("endTime", rangePickerValue[1]);
    // message.success("handleRangePickerChange"+JSON.stringify(rangePickerValue));
    this.setState({
      rangePickerValue: [...rangePickerValue],
    });
    this.searchData(this.state.restRoomId);
    // this.searchData(this.state.restRoomId);
    // dispatch({
    //   type: 'chart/fetchSalesData',
    // });
  };

  isActive = type => {
    if(sessionStorage.getItem("select") === type)return fuckStyles.currentDate;
    return '';
  };

  render() {
    const {
      restroom: { list, fuckFlow },
      loading,
      dispatch
    } = this.props;


    // message.success(JSON.stringify(list));
    const styleA = {
      position: 'absolute',
      top: '10px',
      left: '10px',
      padding: '5px 10px',
      border: '1px solid #d3d3d3',
      backgroundColor: '#f9f9f9'
    }
    const styleB = {
      position: 'absolute',
      right: '10px',
      bottom: '10px',
      padding: '10px',
      color: '#fff',
      backgroundColor: '#000'
    }
    let yourFuckFlow=[{"number": 0,"show_time":""}];
    try
    {
      yourFuckFlow= fuckFlow.data;
    }
    catch (e) {
      
    }
    // message.error(JSON.stringify(yourFuckFlow));
    // message.error("fffffffff"+JSON.stringify(this.state.rangePickerValue));Math.round([0].valueOf()/1000),//Math.round(moment().subtract(1, "days").valueOf()/1000),

    const  fuckTime =[moment(sessionStorage.getItem("startTime")),moment(sessionStorage.getItem("endTime"))];


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row>
            <Col span={4}>
              <div className={styles.infinite}>
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!this.state.loading && this.state.hasMore}
                  useWindow={false}
                >
                  <List
                    size="large"
                    rowKey="id"
                    loading={loading}
                    dataSource={list===undefined?[]:list.data===undefined?[]:list.data.content}
                    renderItem={item => (
                      <List.Item onClick={()=>{
                        try {
                          this.searchData(item.restRoomId,sessionStorage.getItem("select")==="today"?0:1);

                          this.setState({
                            ...this.state,
                            infoWindow: {
                              ...this.state.infoWindow,
                              visible: true,
                              name: item.restRoomName,
                              position: [item.longitude, item.latitude],
                              videoStatus: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "success" : "error",
                              videoStatusTest: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "摄像正常" : "摄像头离线",
                              boardStatus: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "success" : "error",
                              boardStatusText: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "公告正常" : "公告屏离线",
                              // gasStatus:
                            }
                          });
                        }
                        catch (e) {
                        }
                        console.log("点点:"+JSON.stringify(item));
                        console.log("点点:"+JSON.stringify(this.state.infoWindow));

                      }}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.img} shape="square" size="large" />}
                          title={item.restRoomName}
                          description={<div>
                            {item.deviceCameras.length>0 && item.deviceCameras[0].online === 1 ?
                              <span>
                              <Icon type="check-square" style={{ color: '#66CD00', marginRight: 8 }} /> 摄像正常
                            </span>:
                              <span>
                              <Icon type="close-square" style={{ color: '#FF0000', marginRight: 8 }} /> 摄像头离线
                            </span>}

                            <br />
                            <span>
                              <Icon type="check-square" style={{ color: '#66CD00', marginRight: 8 }} />     {this.state.infoWindow.gasStatusText}
                            </span>
                            <br />
                            {item.deviceCameras.length>0 && item.deviceCameras[0].online === 1 ?
                              <span>
                              <Icon type="check-square" style={{ color: '#66CD00', marginRight: 8 }} /> 公告正常
                            </span>:
                              <span>
                              <Icon type="close-square" style={{ color: '#FF0000', marginRight: 8 }} /> 公告屏离线
                            </span>}
                          </div>}
                        />

                        {/*<ListContent data={item} />*/}
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>

            </Col>
            <Col span={20}>
              <div className={styles.home}>
                <Map center={this.state.map.center} zoom={13} plugins={['ToolBar']} zoomEnable amapkey="9859d68e8038928bd46f12fafc6f263c">
                  {
                    list!==undefined&&list.data!==undefined&&list.data.content!==undefined&&
                    list.data.content.map((item, i) => (
                      <Marker
                        position={[item.longitude,item.latitude]}
                        clickable
                        events={{
                        created: (instance) => {
                          console.log('Marker 实例创建成功；如果你需要对原生实例进行操作，可以从这里开始；');
                          console.log(instance);
                        },
                        click: (e) => {
                          this.setState({
                            ...this.state,
                            infoWindow:{
                            ...this.state.infoWindow,
                              visible:true,
                              name:item.restRoomName,
                              position:[item.longitude, item.latitude],
                              videoStatus: item.deviceCameras.length>0&& item.deviceCameras[0].online === 1 ?"success":"error",
                              videoStatusTest: item.deviceCameras.length>0&& item.deviceCameras[0].online === 1 ?"摄像正常":"摄像头离线",
                              boardStatus: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "success" : "error",
                              boardStatusText: item.deviceCameras.length > 0 && item.deviceCameras[0].online === 1 ? "公告正常" : "公告屏离线",
                          }});
                          console.log(`你点击了这个图标；调用参数为：${item.restRoomName}`);
                          console.log(e);
                        },
                        dblclick: (e) => {
                          // this.setState({infoWindowVisible:true});
                          console.log(`你刚刚双击了这个图标；调用参数为：${item.restRoomName}`);
                          console.log(e);
                        },
                        // ... 支持绑定所有原生的高德 Marker 事件
                      }}
                      />
                    ))
                  }
                  <InfoWindow
                    position={this.state.infoWindow.position}
                    visible={this.state.infoWindow.visible}
                    isCustom
                  >
                    <h3>{this.state.infoWindow.name}</h3>
                    <Badge status={this.state.infoWindow.status} text={this.state.infoWindow.statusText} />
                    <br />
                    <Badge status={this.state.infoWindow.videoStatus} text={this.state.infoWindow.videoStatusTest} />
                    <br />
                    <Badge status={this.state.infoWindow.gasStatus} text={this.state.infoWindow.gasStatusText} />
                    <br />
                    <Badge status={this.state.infoWindow.boardStatus} text={this.state.infoWindow.boardStatusText} />
                    <br />
                    <button onClick={() => {this.setState({...this.state,infoWindow:{...this.state.infoWindow,visible:false}})}}>关闭</button>
                  </InfoWindow>
                  <Card className="customLayer" style={styleA}>
                    <Card.Meta
                      title={this.state.weatherInfo===undefined?'获取失败':this.state.weatherInfo.weather===undefined?'获取失败':`宁波 ${this.state.weatherInfo.weather.info} ${this.state.weatherInfo.weather.temperature}℃`}
                      description={this.state.weatherInfo===undefined?undefined:moment(this.state.weatherInfo.publish_time).fromNow()}
                    />
                  </Card>
                  {/*<div className="customLayer" style={styleA}>*/}
                  {/*<h4>宁波</h4>*/}
                  {/*<p>{this.state.weatherInfo===undefined?undefined:moment(this.state.weatherInfo.time).fromNow()}</p>*/}
                  {/*</div>*/}
                  {/*<div className="customLayer" style={styleB}>*/}
                  {/*<p> Another Custom Layer</p>*/}
                  {/*<Button onClick={()=>{alert('You Clicked!')}}>An Ant Design Button</Button>*/}
                  {/*</div>*/}
                </Map>
              </div>
              <div style={{ padding: '0 24px' }}>
                <Suspense fallback={null}>
                  <SalesCard
                    rangePickerValue={fuckTime}
                    allNum={fuckFlow.status}
                    salesData={yourFuckFlow}
                    isActive={this.isActive}
                    handleRangePickerChange={this.handleRangePickerChange}
                    loading={loading}
                    selectDate={this.selectDate}
                    tabOnClick={this.searchData}
                  />
                </Suspense>
              </div>
            </Col>
          </Row>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
