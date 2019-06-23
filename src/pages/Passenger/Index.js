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
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
const SalesCard = React.lazy(() => import('./SalesCard'));
//高德地图组件使用方法 https://elemefe.github.io/react-amap/components/infowindow
/* eslint react/no-multi-comp:0 */
@connect(({ restroom,passenger, loading }) => ({
  restroom,
  passenger,
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
        // region 获取统计的数据，只有
        dispatch({
          type: 'passenger/onlyGetFuckFlow',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: 1,
          },
        });
        dispatch({
          type: 'passenger/getOnlyFuckFlowByWeek',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: 1,
          },
        });
        dispatch({
          type: 'passenger/getOnlyFuckFlowByMonth',
          payload: {//1?endTm=1557368198&startTm=1557281798
            restRoomId: 1,
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
        type: 'passenger/onlyGetFuckFlow',
        payload: {//1?endTm=1557368198&startTm=1557281798
          restRoomId: activeKey,
        },
      });
      dispatch({
        type: 'restroom/getFuckFlow',
        payload: {//1?endTm=1557368198&startTm=1557281798
          restRoomId: activeKey,
          startTm: startTime,//Math.round([0].valueOf()/1000),//Math.round(moment().subtract(1, "days").valueOf()/1000),
          endTm: endTime,//Math.round(this.state.rangePickerValue[1].valueOf()/1000),//Math.round(new Date().getTime()/1000),
          type: searchType,
        },
        callback:(a)=>{
          // console.log(this)
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
  //endregion

  //endregion
  
  render() {
    const {
      restroom: { list, fuckFlow },
      loading,
      passenger: { onlyFuckFlow, onlyFuckFlowWeek, onlyFuckFlowMonth },
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
    console.log("asssssssssssssssssssssssssssssss");

    console.log(JSON.stringify(onlyFuckFlowWeek));
    console.log(JSON.stringify(onlyFuckFlowMonth));

    // alert(dvMonth);
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
                          // region 获取统计的数据，只有
                          dispatch({
                            type: 'passenger/onlyGetFuckFlow',
                            payload: {//1?endTm=1557368198&startTm=1557281798
                              restRoomId: item.restRoomId,
                            },
                          });
                          dispatch({
                            type: 'passenger/getOnlyFuckFlowByWeek',
                            payload: {//1?endTm=1557368198&startTm=1557281798
                              restRoomId: item.restRoomId,
                            },
                          });
                          dispatch({
                            type: 'passenger/getOnlyFuckFlowByMonth',
                            payload: {//1?endTm=1557368198&startTm=1557281798
                              restRoomId: item.restRoomId,
                            },
                          });
                          //endregion
                          this.setState({
                            ...this.state,
                            infoWindow: {
                              ...this.state.infoWindow,
                              visible: true,
                              name: item.restRoomName,
                              position: [item.longitude, item.latitude],
                              videoStatus: item.deviceCameras.length > 0 && item.deviceCameras.filter(v => v.online===0).length===0 === 1 ? "success" : "error",
                              videoStatusTest: item.deviceCameras.length > 0 && item.deviceCameras.filter(v => v.online===0).length===0 === 1 ? "摄像头正常" : "摄像头离线",
                              boardStatus: item.deviceBoards.length > 0 && item.deviceBoards.filter(v => v.online===0).length>0 ? "error" : "success",
                              boardStatusText: item.deviceBoards.length > 0 && item.deviceBoards.filter(v => v.online===0).length>0 ? "公告屏离线" : "公告屏正常",
                              gasStatus: item.deviceGases.length > 0 && item.deviceGases.filter(v => v.score===0).length>0 ? "error":"success",
                              gasStatusText: item.deviceGases.length > 0 && item.deviceGases.filter(v => v.score===0).length>0 ? "测气仪离线":"测气仪正常",
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
                            {item.deviceCameras.length>0 && item.deviceCameras.filter(v => v.online===0).length===0 ?
                              <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />摄像头正常</span>:
                              <span style={{ color: "#FF0000", marginRight: 8 }}><Icon type="close-square" />摄像头离线</span>}
                            <br />
                            {item.deviceGases.length > 0 && item.deviceGases.filter(v => v.score===0).length>0 ?
                              <span style={{ color: "#FF0000", marginRight: 8 }}><Icon type="close-square" />测气仪离线</span>:
                              <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />测气仪正常</span>}
                            <br />
                            {item.deviceBoards.length > 0 && item.deviceBoards.filter(v => v.online===0).length===0 ?
                              <span style={{ color: "#66CD00", marginRight: 8 }}><Icon type="check-square" />公告屏正常</span>:
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
                        <Suspense fallback={null}>
                          <span style={{marginTop: "30px", marginLeft: "30px", float: "left", color: "#722ED1"}}>本周和上周对比图</span>
                          <span style={{marginTop: "30px", marginRight: "100px", float: "right", color: "#722ED1"}}>
                            {`上周累计人数: ${onlyFuckFlowWeek.data.lastWeek} 人`}<br />
                            {`本周累计人数: ${onlyFuckFlowWeek.data.thisWeek} 人`}
                          </span>
                          <Chart height={300} data={onlyFuckFlowWeek.data.list} forceFit>
                            <Axis name="day_of_week" />
                            <Axis name="number" />
                            <Legend />
                            <Tooltip
                              crosshairs={{
                                type: "y"
                              }}
                            />
                            <Geom
                              type="interval"
                              position="day_of_week*number"
                              color="type"
                              adjust={[
                                {
                                  type: "dodge",
                                  marginRatio: 1 / 32
                                }
                              ]}
                            />
                          </Chart>
                        </Suspense>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}
                  >
                    <div style={{background: 'whitesmoke',margin:'10px'}}>
                      <div>
                        <Suspense fallback={null}>
                          <span style={{marginTop: "30px", marginLeft: "30px", float: "left", color: "#722ED1"}}>本月和上月对比图</span>
                          <span style={{marginTop: "30px", marginRight: "100px", float: "right", color: "#722ED1"}}>
                            上月累计人数: { onlyFuckFlowMonth.data.lastMonth } 人<br />
                            本月累计人数: { onlyFuckFlowMonth.data.thisMonth } 人
                          </span>
                          <Chart height={300} data={onlyFuckFlowMonth.data.list} forceFit>
                            <Axis name="day_of_month" />
                            <Axis name="number" />
                            <Legend />
                            <Tooltip
                              crosshairs={{
                                type: "y"
                              }}
                            />
                            <Geom
                              type="interval"
                              position="day_of_month*number"
                              color="type"
                              adjust={[
                                {
                                  type: "dodge",
                                  marginRatio: 1 / 32
                                }
                              ]}
                            />
                          </Chart>
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
                  <Row>
                        <div style={{'text-align': 'right','font-size': '18px','margin': '20px 46px 20px 0'}}>数据单位：人次</div>
                      </Row>
                  <Row style={{'margin-left': '60px'}}>
                      <Col span={8}>
                        <div style={{'text-align': 'center','width': '160px','font-size': '30px','padding-top': '20px','font-weight': 'bold','height': '160px','margin': '36px 20px','border':'2px solid','border-radius': '100px'}}>
                         今日 <div style={{'margin':'20px'}}>{onlyFuckFlow.data.today===undefined?0:onlyFuckFlow.data.today}</div>
                         </div>
                      </Col>
                      <Col span={8}>
                        <div style={{'text-align': 'center','width': '160px','font-size': '30px','padding-top': '20px','font-weight': 'bold','height': '160px','margin': '36px 20px','border':'2px solid' ,'border-radius': '100px'}}> 
                        本月 <div style={{'margin':'20px'}}>{onlyFuckFlow.data.month===undefined?0:onlyFuckFlow.data.month}</div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{'text-align': 'center','width': '160px','font-size': '30px','padding-top': '20px','font-weight': 'bold','height': '160px','margin': '36px 20px','border':'2px solid','border-radius': '100px'}}> 
                        总计 <div style={{'margin':'20px'}}>{onlyFuckFlow.data.all===undefined?0:onlyFuckFlow.data.all}</div>
                        </div>
                      </Col>
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
