import React from 'react';
import { Layout, Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function EmailNotVerified() {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-green-500">
            <main className="w-100 h-auto shadow-xl p-0">
                <Layout className="h-full bg-gray-100">
                  <Result
                    status="warning"
                    title="You email has not been verified. Please check your email."
                    extra={
                      <Button type="primary">
                        <Link to="/">
                          Back to home
                        </Link>
                      </Button>
                    }
                  />
                </Layout>
            </main>
        </div>
    );
}
