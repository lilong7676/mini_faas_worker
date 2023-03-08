import { Input, Button } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { Row, Col, Spacer, Text } from '@nextui-org/react';
import { Deployment } from '@mini_faas_worker/types';
import { ServerlessPort } from '@mini_faas_worker/common';

interface IProps {
  deployment: Deployment;
}
const IS_DEV = process.env.NODE_ENV !== 'production';

export default function Preview({ deployment }: IProps) {
  const { id: deploymentId } = deployment || {};

  const defaultTriggerUrl = IS_DEV
    ? `http://localhost:${ServerlessPort}/trigger/${deploymentId}`
    : `${window.location.origin}/mini_faas_worker/serverless/trigger/${deploymentId}`; // https://lilong7676.cn/mini_faas_worker/serverless/trigger/${deploymentId}

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
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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
          height="100%"
          frameBorder={0}
        ></iframe>
      </Row>
    </Col>
  ) : (
    <Text>请先部署函数</Text>
  );
}
