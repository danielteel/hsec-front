import React, {useEffect, useRef, useState} from 'react';
import { Button, Divider, List, Typography, Row, Col, Form, Spin } from 'antd';
import { manageUserRole, manageUsers } from '../api/manage';

export default function ManageUsers(){
    const [unverifiedUsers, setUnverifiedUsers] = useState(null);
    const [reload, setReload] = useState({});
    const [error, setError] = useState(null);
    useEffect(()=>{
        async function loadUnverifiedUsers(){
            setUnverifiedUsers(await manageUsers());
        }
        setUnverifiedUsers(null);
        loadUnverifiedUsers();
    }, [reload]);

    return <div style={{width: '100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Typography.Title level={3}>Users</Typography.Title>
        {
            !unverifiedUsers?
                <Spin/>
            :
                <List>
                    {error?<Typography.Text type="danger">{error}</Typography.Text>:null}
                    {
                        unverifiedUsers?.length?
                            unverifiedUsers.map(unverifiedUser => (
                                <List.Item style={{borderWidth: 1, borderStyle:'solid', padding: 2, borderRadius: 5}}>
                                    <Typography.Text strong style={{padding:'2px'}}>{unverifiedUser.email}</Typography.Text>
                                </List.Item>
                            ))
                        :
                            <Typography.Text>No users found</Typography.Text>
                    }
                </List>
        }
    </div>
}