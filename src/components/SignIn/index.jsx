import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import { Button, Checkbox, Form, Input } from 'antd';
import browserHistory from "../../browser-history.js";
import Api from '../../api';

const api = new Api();

function SignIn({ isAuth, setAuth }) {

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            browserHistory.push('/audits');
        }
    }, [])

    const onFinish = (values) => {
        console.log('Success:', values);
        api.signIn({ email: values.email, password: values.password })
            .then(res => res.json())
            .then(data => {
                if (data.access_token) {
                    console.log(data);
                    localStorage.setItem('accessToken', data.access_token);
                    setAuth(localStorage.getItem('accessToken'));
                    browserHistory.push('/audits');
                } else {
                    alert('Error');
                }
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <section className='signin'>
            <h1>Sign in</h1>
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
            <Link to="/signup">Sign Up</Link>
        </section>
    );
}

export default SignIn;
