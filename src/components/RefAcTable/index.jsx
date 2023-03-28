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



const RefAcTable = () => {
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
    let filters = [];
    let selectValues = [];
    const [filterValues, setFilterValue] = useState([]);
    const [formSelectValues, setFormSelectValues] = useState([]);


    const [isPopup, setPopup] = useState(false);

    const { RangePicker } = DatePicker;


    const edit = (record) => {
        form.setFieldsValue({
            bk_sourcemediumcode: '',
            startdate: '',
            enddate: '',
            acrate: '',
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

                api.editRefAc({ id: newData[index].id, bk_sourcemediumcode: newData[index].bk_sourcemediumcode, startdate: newData[index].startdate, enddate: newData[index].enddate, acrate: newData[index].acrate }).then(res => res.json()).then(data => {
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
            item.id === id && api.deleteRefAc({ id: item.id }).then(res => res.json()).then(data => {
                console.log(data);
            })
        })
    };


    // data messages
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'RefAc updated',
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
        api.getRefAc()
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setData(data);

                    let arr = [];
                    data.forEach((refAc) => {
                        arr.push(refAc.bk_sourcemediumcode);
                    });
                    const unique = arr.filter((value, index, array) => array.indexOf(value) === index);

                    unique.forEach((el) => {
                        selectValues.push({
                            value: el
                        });
                    })
                    unique.forEach((el) => {
                        filters.push({
                            text: el,
                            value: el
                        });
                    })
                    setFilterValue(filters)
                    setFormSelectValues(filters);

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
            title: 'BK_SourceMediumCode',
            dataIndex: 'bk_sourcemediumcode',
            key: 'bk_sourcemediumcode',
            editable: true,
            filters: filterValues,
            onFilter: (value, record) => record.bk_sourcemediumcode.indexOf(value) === 0,
            filterSearch: true,
        },
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
            title: 'acRate',
            dataIndex: 'acrate',
            key: 'acrate',
            sorter: (a, b) => a.acrate - b.acrate,
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
                inputType: col.dataIndex === 'acRate' ? 'number' : 'text',
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
        api.createRefAc({ bk_sourcemediumcode: values.bk_sourcemediumcode, startdate: startdate, enddate: enddate, acrate: values.acrate }).then(res => res.json()).then(data => {
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
                Add refAc
            </Button>

            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    pagination={{ pageSize: 20 }} 
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
            <Modal title="Add the refAcc" open={isPopup} footer={null} closable={true} onCancel={() => setPopup(false)} >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    autoComplete="off"
                    onFinish={onFinish}
                    ref={formRef}
                    disabled={componentDisabled}
                >
                    <Form.Item
                        label="BK_SourceMediumCode"
                        labelAlign='left'
                        labelCol={{ span: 10, offset: 0 }}
                        name="bk_sourcemediumcode"
                        rules={[{ required: true, message: 'BK_SourceMediumCode!' }]}
                        style={{ display: 'flex', flexDirection: 'row' }}
                    >
                        <AutoComplete
                            placeholder="BK_SourceMediumCode"
                            options={formSelectValues}
                            style={{ width: 250 }}
                        />
                    </Form.Item>
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
                        label="acRate"
                        labelAlign='left'
                        labelCol={{ span: 4, offset: 0 }}
                        name="acrate"
                        rules={[{ required: true, message: 'Please input acRate!' }]}
                    >
                        <InputNumber placeholder="acRate" />
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

export default RefAcTable;
