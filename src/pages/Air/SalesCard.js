import React, { memo } from 'react';
import { Row, Col, Card, Select, Tabs, DatePicker,message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';
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
import moment from 'moment';
const { Line } = Guide;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;


const cols = {
  show_time: {alias: '时间',},
  number: {alias: '人数',},
};



const SalesCard = memo(
  ({ rangePickerValue, salesData, allNum, isActive, handleRangePickerChange, tabOnClick, loading, onSelectHandleChange }) => (
    <div>    {/*<Card loading={loading} bordered={false} bodyStyle={{ padding: 0, background: "#f3f"}}> /!**此处可以通过bodyStyle设置card样式**!/*/}
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <Select style={{width: '100px'}} defaultValue={moment().month()+""} onChange={onSelectHandleChange}>
                <Option value="0">一月</Option>
                <Option value="1">二月</Option>
                <Option value="2">三月</Option>
                <Option value="3">四月</Option>
                <Option value="4">五月</Option>
                <Option value="5">六月</Option>
                <Option value="6">七月</Option>
                <Option value="7">八月</Option>
                <Option value="8">九月</Option>
                <Option value="9">十月</Option>
                <Option value="10">十一月</Option>
                <Option value="11">十二月</Option>
              </Select>
            </div>
          }
          onTabClick={(v)=>tabOnClick(v,sessionStorage.getItem("select")==="today"?0:1)}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab="气体数据"
            key="1"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                     <span style={{marginRight: "100px", float: "right", color: "#722ED1"}}>{
                       }</span>
                      {(salesData !==undefined) && (
                        <Chart height={280} data={salesData} scale={cols} padding={'auto'} forceFit>
                          <Axis name="show_time" title={{ offset: 38 }} label={{
                            autoRotate: false,
                            formatter: val => {
                              return `${val}`;
                              // if(val.includes(':30') || val.includes(':00')) return `${val}`
                            },

                          }}  />
                          <Axis name="score" title={{ offset: 38 }} />
                          <Tooltip
                            crosshairs={{
                              type: "y"
                            }}
                          />
                          <Geom type="line" position="show_time*score" />
                        </Chart>)
                      }
                    </div>
                  </Col>
                </div>
              </Col>

            </Row>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
);

export default SalesCard;
