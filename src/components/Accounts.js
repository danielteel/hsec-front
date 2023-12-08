import React, {useState} from 'react';
import {Layout, theme, Button, Input, Space, Typography, Radio} from 'antd';
import Login from './Login';
import CreateAccount from './CreateAccount';


const whichList = ['login', 'create'];
export default function Accounts({setAccessToken}){
    const [which, setWhich] = useState(whichList[0]);

    const {token: { colorBgContainer }} = theme.useToken();

    return (
        <Layout style={{ height: '100%' }}>
            <Layout.Content style={{ display: 'flex', flexDirection:'column', margin: '8px 6px', backgroundColor: colorBgContainer, alignItems:'center', justifyContent:'center'}}>
              <Radio.Group
                      options={whichList}
                      onChange={({ target: { value } }) => { setWhich(value) }}
                      value={which}
                      optionType="button"
                      buttonStyle="solid"
                      size='small'
                  />
              {
                which === 'login'
                ?
                  <Login setAccessToken={setAccessToken}/>
                :
                  <CreateAccount setAccessToken={setAccessToken}/>
              }
            </Layout.Content>
        </Layout>
    );
}