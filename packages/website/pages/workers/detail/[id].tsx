import React, { useCallback, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Spacer,
  Loading,
  Card,
  Text,
} from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRequest } from 'ahooks';
import { Func } from '@mini_faas_worker/types';
import Layout from 'components/layout';
import { getData } from 'libs/fetchData';

async function getFunctionDetail(funcId: string) {
  return getData('/functionDetail', { id: funcId });
}

export default function WorkerDetail() {
  const router = useRouter();
  const funcId = router.query.id;

  const {
    data: funcDetail,
    error,
    loading,
  } = useRequest<Func, (string | string[])[]>(getFunctionDetail, {
    defaultParams: [funcId],
  });

  const { name, deployments = [], domains = [] } = funcDetail || {};

  return (
    <Layout>
      <Col
        className="worker-detail"
        css={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Card css={{ mw: '330px' }}>
          <Card.Header>
            <Text>函数名：</Text>
            <Text b>{name}</Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: '$10' }}>
            <Text>
              函数部署信息：{deployments.length > 0 ? '' : '暂无部署信息'}
            </Text>
            <Spacer></Spacer>
            {deployments.map((deployment, index) => (
              <>
                <Text b>部署{index + 1}:</Text>
                <Text as={'span'}>
                  触发类型: <Text b>{deployment.trigger}</Text>
                </Text>
              </>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Layout>
  );
}

// TODO getInitialProps ?
