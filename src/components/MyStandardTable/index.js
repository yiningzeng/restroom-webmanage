import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data,
      // data: {
        // content,
        // numberOfElements,
        // totalElements,
        // size,
        // number,
      // }, // { data, pagination },
      loading,
      columns,
      rowKey,
      components,
      onRow,
      scroll,
      noPagination,
      rowClassName,
    } = this.props;

    console.log(this.props.data);
    let paginationProps;
    if(noPagination===undefined){
      paginationProps= {
        showSizeChanger: true,
        showQuickJumper: true,
        current: data===undefined?undefined:data.number+1,
        pageSize: data===undefined?undefined:data.size,
        total: data===undefined?undefined:data.totalElements,
      };
    }

    // alert(JSON.stringify(content));
    console.log('selectedRowKeys');
    console.log(selectedRowKeys);
    const rowSelection = {

      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({

        disabled: (record.online===0),
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          {selectedRowKeys.length > 0 && (

            <Alert
              message={

                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          )}

        </div>
        <Table
          ref="table"
          onRow={onRow}
          rowClassName="editable-row,ant-table"
          components={components}
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={data===undefined?undefined:data.content===undefined?[]:data.content}
          scroll={scroll}
          columns={columns}
          pagination={paginationProps===undefined?undefined:paginationProps}
          onChange={this.handleTableChange}
          expandedRowRender={this.props.expandedRowRender}
        />
      </div>
    );
  }
}

export default StandardTable;
