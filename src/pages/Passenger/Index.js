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

    rangePickerValueGas: getTimeDistance('day'),
    restRoomIdGas: 1,
    isActiveGas: "today",

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
        // region 获取气体数据
        dispatch({
          type: 'device/queryHomeGasList',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: 1,
            startTm: startTime,
            endTm: endTime,
          },
          callback:(a)=>{
            console.log("v2最新气体数据:"+JSON.stringify(a));
            // this.setState(gasFlow: a.)
            // message.success(`${JSON.stringify(this.state.gasFlow)}`);
          },
        });
        //endregion
      },
    });

  }

  //region 客流
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
          console.log(this)
          // this.setState(gasFlow: a.)
          message.success(`${JSON.stringify(this.state.gasFlow)}`);
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
  //endregion

  //endregion
  
  render() {
    const {
      restroom: { list, fuckFlow },
      loading,
      device: {gasFlow},
      dispatch
    } = this.props;


    // message.success(JSON.stringify(list));
    const styleA = {
      position: 'absolute',
      top: '10px',
      left: '10px',
      padding: '5px 10px',
      border: '1px solid #d3d3d3',
      backgroundColor: '#92c0ff',
      opacity: '0.4',
      border:'4px solid #2bccff',
      // border-radius: '20px',
    }
    const styleB = {
      position: 'absolute',
      right: '10px',
      bottom: '10px',
      padding: '10px',
      color: '#fff',
      backgroundColor: 'red'
    }
    const styleColorwhite={
      color:"white"
    }
    let yourFuckFlow=[{"number": 0,"show_time":""}];
    try
    {
      // console.log(this)
      yourFuckFlow= fuckFlow.data;
    }
    catch (e) {

    }
    // message.error(JSON.stringify(yourFuckFlow));
    // message.error("fffffffff"+JSON.stringify(this.state.rangePickerValue));Math.round([0].valueOf()/1000),//Math.round(moment().subtract(1, "days").valueOf()/1000),

    const  fuckTime =[moment(sessionStorage.getItem("startTime")),moment(sessionStorage.getItem("endTime"))];

    return (
      <PageHeaderWrapper>
        <Card
          style={{ padding: '0' }}
          bordered={false}
          className="colortransparent"
        >
          <Row>

            <Col span={4} id="dazhu">
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
                    color="white!important"
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
                        console.log("点点:",(item));
                        console.log("点点:",(this.state.infoWindow));

                      }}
                      >
                        <List.Item.Meta
                          title={item.restRoomName}
                          description={<div class="mineclassone">
                          {item.deviceCameras.length>0 && item.deviceCameras[0].online === 1 ?
                          <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />摄像正常</span>:
                          <span style={{ color: "#FF0000", marginRight: 8 }}><Icon type="close-square" />摄像头离线</span>}
                          <br />
                          <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />{this.state.infoWindow.gasStatusText}</span>
                          <br />
                          {item.deviceCameras.length>0 && item.deviceCameras[0].online === 1 ?
                          <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />公告正常</span>:
                          <span style={{ color: '#FF0000', marginRight: 8 }}><Icon type="close-square" />公告屏离线</span>}
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
              <Row>
              <Col span={12}
                  >
                    <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <div>
                      这里放本日客流量
                        <Suspense fallback={null}>
                          <SalesCard
                            className={styles.chartInfinite}
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
                    </div>
                  </Col>
                  <Col span={12}
                  >
                    <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <div>
                      这里放本日客流量
                        <Suspense fallback={null}>
                          <SalesCard
                            className={styles.chartInfinite}
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
                    </div>
                  </Col>
             </Row>
              <Row>
              <Col span={12}
                  >
                    <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <div>
                      这里放本日客流量
                        <Suspense fallback={null}>
                          <SalesCard
                            className={styles.chartInfinite}
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
                    </div>
                  </Col>
                  <Col span={12} id="wo">
                  
                  <Row style={{'margin': '50px 0 0 30px '}}>
                  这里是死数据，你放动态数据进去
                      <Col span={8}>
                        <div style={{'text-align': 'center','width': '200px','font-size': '36px','font-weight': 'bold','height': '200px','margin': '36px 20px','border':'2px solid','border-radius': '100px'}}>
                         今日 <div style={{'margin':'20px'}}>123</div>
                         </div>
                      </Col>
                      <Col span={8}>
                        <div style={{'text-align': 'center','width': '200px','color': 'rgb(43, 204, 255)','font-size': '36px','font-weight': 'bold','height': '200px','margin': '36px 20px','border':'2px solid rgb(43, 204, 255)','border-radius': '100px'}}> 
                        本周 <div style={{'margin':'20px'}}>523</div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{'text-align': 'center','width': '200px','color': 'red','font-size': '36px','font-weight': 'bold','height': '200px','margin': '36px 20px','border':'2px solid red','border-radius': '100px'}}> 
                        本月 <div style={{'margin':'20px'}}>1251</div>
                        </div>
                      </Col>
                      </Row>
                      <Row>
                        <div style={{'text-align': 'center','font-size': '28px'}}>数据单位：人次</div>
                      </Row>
                    </Col>
              </Row>
            </Col>
          </Row>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Index;
