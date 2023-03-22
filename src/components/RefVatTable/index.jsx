import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { Button, Input, Form, Table, InputNumber, message, Popconfirm, Typography, Modal, DatePicker, AutoComplete } from 'antd';
import Api from '../../api';
import { ReloadOutlined, PlusCircleOutlined } from '@ant-design/icons';

// editing
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};



const RefVatTable = () => {
    // state of requests
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // edit state
    const [form] = Form.useForm();
    const formRef = useRef(null);
    const [componentDisabled, setComponentDisabled] = useState(false);


    const [editingId, setEditingId] = useState('');
    const isEditing = (record) => record.id === editingId;

    // fiilters and form autocomplete component data

    const [isPopup, setPopup] = useState(false);

    const { RangePicker } = DatePicker;


    const edit = (record) => {
        form.setFieldsValue({
            startdate: '',
            enddate: '',
            vatdate: '',
            ...record,
        });
        setEditingId(record.id);
    };

    const cancel = () => {
        setEditingId('');
    };

    // save editing changes
    const save = async (id) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                api.editRefVat({ id: newData[index].id, startdate: newData[index].startdate, enddate: newData[index].enddate, vatrate: newData[index].vatrate }).then(res => res.json()).then(data => {
                    console.log(data);
                })

                setData(newData);
                setEditingId('');
            } else {
                newData.push(row);

                setData(newData);
                setEditingId('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // delete item
    const handleDelete = (id) => {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);

        data.forEach((item) => {
            item.id === id && api.deleteRefVat({ id: item.id }).then(res => res.json()).then(data => {
                console.log(data);
            })
        })
    };


    // data messages
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'RefVat updated',
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Something went wrong ):',
        });
    };

    // api
    const api = new Api();

    const fetchData = () => {
        setLoading(true);
        api.getRefVat()
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setData(data);
                    setLoading(false);
                    success();
                } else {
                    error();
                }
            })
    };

    useEffect(() => {
        fetchData();
    }, []);


    const columns = [

        {
            title: 'startDate',
            dataIndex: 'startdate',
            key: 'startdate',
            sorter: (a, b) => {
                return new Date(a.startdate) - new Date(b.startdate)
            },
            editable: true,
        },
        {
            title: 'endDate',
            dataIndex: 'enddate',
            key: 'enddate',
            sorter: (a, b) => {
                return new Date(a.enddate) - new Date(b.enddate)
            },
            editable: true,
        },
        {
            title: 'vatRate',
            dataIndex: 'vatrate',
            key: 'vatrate',
            sorter: (a, b) => a.vatrate - b.vatrate,
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.id)}
                            style={{
                                marginRight: 8,
                                color: '#000000',
                                textDecoration: 'underline'
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a style={{
                                color: '#000000',
                                textDecoration: 'underline'
                            }}>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div>
                        <Typography.Link style={{
                            color: '#000000',
                            textDecoration: 'underline',
                            marginRight: 8
                        }} disabled={editingId !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                            <a style={{
                                color: '#000000',
                                textDecoration: 'underline'
                            }} >Delete</a>
                        </Popconfirm>
                    </div>

                );
            },
        },
    ];


    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'vatRate' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };


    // create item
    const onFinish = (values) => {
        console.log(values);
        const startdate = `${values.dates[0].$y}-${values.dates[0].$d.getMonth().toString().length > 1 ? '' : '0'}${values.dates[0].$d.getMonth() + 1}-${values.dates[0].$D} ${values.dates[0].$H}:${values.dates[0].$m}:${values.dates[0].$s}`;
        const enddate = `${values.dates[1].$y}-${values.dates[1].$d.getMonth().toString().length > 1 ? '' : '0'}${values.dates[1].$d.getMonth() + 1}-${values.dates[1].$D} ${values.dates[1].$H}:${values.dates[1].$m}:${values.dates[1].$s}`;
        setComponentDisabled(true);
        api.createRefVat({ startdate: startdate, enddate: enddate, vatrate: values.vatrate }).then(res => res.json()).then(data => {
            console.log(data);
            if (data === 1) {
                setPopup(false);
                fetchData();
                formRef.current?.resetFields();
                setComponentDisabled(false);
            }
        })
    };

    return (
        <div className='table-block'>
            {contextHolder}
            <Button
                type="primary"
                onClick={() => fetchData()}
                icon={<ReloadOutlined />}
                size="middle"
                className='table-block__button'
                style={{ marginRight: 10 }}
            >
                Update
            </Button>
            <Button
                type="primary"
                onClick={() => {
                    setPopup(!isPopup);
                }}
                icon={<PlusCircleOutlined />}
                size="middle"
                className='table-block__button'
            >
                Add refVat
            </Button>

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="table-block__table editable-row"
                    loading={loading}
                    onChange={onChange}
                    size="small"
                    className='table-refac__table'
                    rowKey={() => {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }}
                />
            </Form>
            <Modal title="Add the refVat" open={isPopup} footer={null} closable={true} onCancel={() => setPopup(false)} >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    autoComplete="off"
                    onFinish={onFinish}
                    ref={formRef}
                    disabled={componentDisabled}
                >
                    <Form.Item label="Start date/end dat" labelCol={{ span: 7, offset: 0 }} labelAlign='left' name="dates" rules={[{ required: true, message: 'Please choose dates!' }]}>
                        <RangePicker
                            showTime={{
                                format: 'HH:mm',
                            }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={onChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="vatRate"
                        labelAlign='left'
                        labelCol={{ span: 4, offset: 0 }}
                        name="vatrate"
                        rules={[{ required: true, message: 'Please input vatRate!' }]}
                    >
                        <InputNumber placeholder="vatRate" />
                    </Form.Item>


                    <Form.Item wrapperCol={{ offset: 0, span: 12 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default RefVatTable;
