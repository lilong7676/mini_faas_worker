import { Dropdown, Menu, Space, Input, Button } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Col, Spacer, Text } from '@nextui-org/react';
import { Deployment } from '@mini_faas_worker/types';

interface IProps {
  deployment: Deployment;
  debuggerSessionId: string;
}

const menuItems = [
  {
    key: 'GET',
    label: 'GET',
  },
  {
    key: 'POST',
    label: 'POST',
  },
];

export default function HttpTriggerRunner({
  deployment,
  debuggerSessionId,
}: IProps) {
  const { id: deploymentId } = deployment || {};
  const defaultTriggerUrl = `http://localhost:3006/${deploymentId}`;

  const triggerUrlInputRef = useRef(defaultTriggerUrl);

  const [httpMethod, setHttpMethod] = useState('GET');

  const [respResult, setRespResult] = useState('');

  useEffect(() => {
    triggerUrlInputRef.current = defaultTriggerUrl;
  }, [defaultTriggerUrl, triggerUrlInputRef]);

  const onHttpMethodClick: MenuProps['onClick'] = ({ key }) => {
    setHttpMethod(key);
  };

  const runHttpTrigger = async () => {
    const resp = await fetch(triggerUrlInputRef.current, {
      method: httpMethod,
      headers: {
        'X-debugger-session-id': debuggerSessionId,
      },
    });
    const result = await resp.text();
    setRespResult(result);
  };

  const onTriggerUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      triggerUrlInputRef.current = e.target.value;
    },
    [triggerUrlInputRef]
  );

  return deployment ? (
    <Col>
      <Row align="center">
        <Dropdown
          overlay={<Menu onClick={onHttpMethodClick} items={menuItems} />}
        >
          <a onClick={e => e.preventDefault()}>
            <Space>
              {httpMethod}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 200px)' }}
            defaultValue={defaultTriggerUrl}
            onChange={onTriggerUrlChange}
          />
          <Button type="primary" onClick={runHttpTrigger}>
            运行
          </Button>
        </Input.Group>
      </Row>

      <Spacer></Spacer>

      <Row>
        <Col>
          Response:
          <Text>{respResult}</Text>
        </Col>
      </Row>
    </Col>
  ) : (
    <Text>请先部署函数</Text>
  );
}
