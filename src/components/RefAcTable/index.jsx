import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { Button, Input, Form, Table, InputNumber, message, Popconfirm, Typography } from 'antd';
import Api from '../../api';
import { SearchOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';


// приходят данные с сервера без уникальных полей, чтобы реализовать редактирование, пришлось добавить айдишки на фронте

// при изменении одного поля - BK_SourceMediumCode создается новый ряд в таблице, при изменении acRate все отрабатывает корректно

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
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            BK_SourceMediumCode: '',
            startDate: '',
            endDate: '',
            acRate: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    // save editing changes
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });


                api.createRefAc({ BK_SourceMediumCode: newData[index].BK_SourceMediumCode, startDate: newData[index].startDate, endDate: newData[index].endDate, acRate: newData[index].acRate }).then(res => res.json()).then(data => {
                    console.log(data);
                })

                setData(newData);
                console.log(newData[index]);


                setEditingKey('');
            } else {
                newData.push(row);

                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // delete item
    const handleDelete = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);

        data.forEach((item) => {
            item.key === key && api.deleteRefAc({ BK_SourceMediumCode: item.BK_SourceMediumCode, startDate: item.startDate, endDate: item.endDate }).then(res => res.json()).then(data => {
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
                console.log(data);
                if (data) {
                    data.map((item) => {
                        item.key = Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    })
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
            title: 'BK_SourceMediumCode',
            dataIndex: 'BK_SourceMediumCode',
            key: 'BK_SourceMediumCode',
            editable: true,
        },
        {
            title: 'startDate',
            dataIndex: 'startDate',
            key: 'startDate',
            sorter: (a, b) => {
                return new Date(a.startDate) - new Date(b.startDate)
            },
            editable: true,
        },
        {
            title: 'endDate',
            dataIndex: 'endDate',
            key: 'endDate',
            sorter: (a, b) => {
                return new Date(a.endDate) - new Date(b.endDate)
            },
            editable: true,
        },
        {
            title: 'acRate',
            dataIndex: 'acRate',
            key: 'acRate',
            sorter: (a, b) => a.acRate - b.acRate,
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
                            onClick={() => save(record.key)}
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
                        }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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


    return (
        <div className='table-block'>
            {contextHolder}
            <Button
                type="primary"
                onClick={() => fetchData()}
                icon={<ReloadOutlined />}
                size="middle"
                className='table-block__button'
            >
                Update audits
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
        </div>
    );
}

export default RefAcTable;
