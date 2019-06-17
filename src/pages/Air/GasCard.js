import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker,message } from 'antd';
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
import moment from './Index';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;


const cols = {
  month: {
    range: [0, 1]
  }
};



const SalesCard = memo(
  ({ rangePickerValue, salesData, isActive, handleRangePickerChange, tabOnClick, loading, selectDate }) => (
    <div>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{ width: 220 }}
              />
            </div>
          }
          onTabClick={(v)=>tabOnClick(v)}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab="气体数据"
            key="gas-1"
          >
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      {(salesData !==undefined) && (<Chart height={300} data={salesData} scale={cols} forceFit>
                        <Legend/>
                        <Axis name="update_time"/>
                        <Axis
                          name="temperature"
                          label={{
                            formatter: val => `${val}`
                          }}
                        />
                        <Tooltip
                          crosshairs={{
                            type: "y"
                          }}
                        />
                        <Geom
                          type="line"
                          position="update_time*temperature"
                          size={2}
                          color="city"
                        />
                        <Geom
                          type="point"
                          position="update_time*temperature"
                          size={4}
                          shape="circle"
                          color="city"
                          style={{
                            stroke: "#fff",
                            lineWidth: 1
                          }}
                        />
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
