import { Input, Button } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { Row, Col, Spacer, Text } from '@nextui-org/react';
import { Deployment } from '@mini_faas_worker/types';

interface IProps {
  deployment: Deployment;
}

export default function Preview({ deployment }: IProps) {
  const { id: deploymentId } = deployment || {};
  const defaultTriggerUrl = `http://localhost:3006/${deploymentId}`;

  const triggerUrlInputRef = useRef(defaultTriggerUrl);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    triggerUrlInputRef.current = defaultTriggerUrl;
  }, [defaultTriggerUrl, triggerUrlInputRef]);

  const refresh = async () => {
    if (iframeRef.current) {
      iframeRef.current.src = triggerUrlInputRef.current;
    }
  };

  const onTriggerUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      triggerUrlInputRef.current = e.target.value;
    },
    [triggerUrlInputRef]
  );

  return deployment ? (
    <Col
      css={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '600px',
      }}
    >
      <Row align="center">
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 200px)' }}
            defaultValue={defaultTriggerUrl}
            onChange={onTriggerUrlChange}
          />
          <Button type="primary" onClick={refresh}>
            刷新
          </Button>
        </Input.Group>
      </Row>

      <Spacer></Spacer>

      <Row css={{ flexGrow: 1 }}>
        <iframe
          ref={iframeRef}
          src={triggerUrlInputRef.current}
          width="100%"
          height="500px"
          frameBorder={0}
        ></iframe>
      </Row>
    </Col>
  ) : (
    <Text>请先部署函数</Text>
  );
}
