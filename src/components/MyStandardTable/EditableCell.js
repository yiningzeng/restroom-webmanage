import React, { PureComponent } from 'react';
import { Form, Input, InputNumber,message } from 'antd';

export const EditableContext = React.createContext();


const FormItem = Form.Item;

export const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
export const EditableFormRow = Form.create()(EditableRow);


class EditableCell extends React.Component {
  getInput = () => {
    // if(this.props.dataIndex==='carModels'){
    //    // alert(this.props.carModels);
    //    return <Select mode="multiple" style={{ width: '100%' }}>{carModels}</Select>
    //  }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem
                  style={{ margin: 0 }}
                >
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `${title}必填`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
export default EditableCell;
