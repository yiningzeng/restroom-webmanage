import React, { PureComponent, Fragment } from 'react';
import EditableCell from 'components/MyStandardTable/EditableCell';
import { Table, Alert, Input, InputNumber, Popconfirm, Form } from 'antd';
import styles from './index.less';


const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

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
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: {
        content,
        totalElements,
        size,
        number,
      }, // { data, pagination },
      loading,
      columns,
      rowKey,
    } = this.props;

    console.log(this.props.data);
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: number+1,
      pageSize: size,
      total: totalElements,
    };
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
          // components={components}
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={content}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          expandedRowRender={this.props.expandedRowRender}
        />
      </div>
    );
  }
}

export default StandardTable;
