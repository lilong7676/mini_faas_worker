import { NextPage } from 'next';
import { Row, Col, Spacer, Card, Text, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { Func } from '@mini_faas_worker/types';
import Layout from 'components/layout';
import { getData } from 'libs/fetchData';

interface Props {
  funcDetail: Func;
}

async function getFunctionDetail(funcId: string) {
  return getData('/functionDetail', { id: funcId });
}

const WorkerDetail: NextPage<Props> = ({ funcDetail }) => {
  const { name, deployments, domains } = funcDetail;
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Layout>
      <Col
        className="worker-detail"
        css={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Card css={{ mw: '330px' }}>
          <Card.Header>
            <Text>
              函数名：<Text b>{name}</Text>
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body css={{ py: '$10' }}>
            <Text>
              函数部署信息：{deployments.length > 0 ? '' : '暂无部署信息'}
            </Text>
            <Spacer></Spacer>
            {deployments.map((deployment, index) => (
              <Col key={deployment.id}>
                <Row>
                  <Text b>部署 {index + 1}:</Text>
                </Row>
                <Row>
                  <Text as={'span'}>
                    触发器类型: <Text b>{deployment.trigger}</Text>
                  </Text>
                </Row>
                <Row>
                  <Text as={'span'}>
                    部署时间: <Text b>{deployment.updatedAt}</Text>
                  </Text>
                </Row>
              </Col>
            ))}
          </Card.Body>
          <Card.Divider></Card.Divider>
          <Card.Footer>
            <Row justify="flex-end">
              <Button
                size={'xs'}
                onPress={() => {
                  router.push(`editor/${id}`);
                }}
              >
                编辑函数
              </Button>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </Layout>
  );
};

WorkerDetail.getInitialProps = async ({ query }) => {
  const funcId = query.id as string;
  const funcDetail = await getFunctionDetail(funcId);
  return { funcDetail };
};

export default WorkerDetail;
