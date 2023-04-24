import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { Button, Form, Input } from 'antd';
import Api from '../../api';
import browserHistory from "../../browser-history.js";

const api = new Api();

function SignUp({isAuth, setAuth}) {

    useEffect(() => {
        if (isAuth) {
            browserHistory.push('/audits');
        }
    }, [isAuth])

    const onFinish = (values) => {
        console.log('Success:', values);
        api.signUp({ fullname: values.fullname, email: values.email, password: values.password })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                console.log(data.access_token);
                localStorage.setItem('accessToken', data.access_token);
                setAuth(localStorage.getItem('accessToken'));
                browserHistory.push('/audits');
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <section className='signin'>
            <h1>Sign up</h1>
            <Form
                name="basic"
                style={{ width: '60%' }}
                size="middle"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Fullname"
                    name="fullname"
                    rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Link to="/">Sign In</Link>
        </section>
    );
}

export default SignUp;
