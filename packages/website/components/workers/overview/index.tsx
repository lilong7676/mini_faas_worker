import {
  Input,
  Spacer,
  Button,
  Col,
  Container,
  Row,
  Card,
  Text,
  Loading,
} from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRequest } from 'ahooks';
import { Func } from '@mini_faas_worker/types';
import { useCallback } from 'react';
import { getData } from 'libs/fetchData';

async function listFunction() {
  return getData('/listFunction');
}

export default function WorkersOverview() {
  const { data, error, loading } = useRequest<Func[], undefined>(listFunction);
  const router = useRouter();

  const pushToWorkerDetail = useCallback((func: Func) => {
    router.push(`/workers/detail/${func.id}`);
  }, []);

  return (
    <Container
      className="workers-overview"
      display="flex"
      css={{
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Row css={{ height: '100%' }}>
        <Col css={{ height: '100%', width: '30vw', overflowY: 'auto' }}>
          <Col>
            <Spacer />
            <Row align="center">
              <Input
                aria-label="搜索函数"
                placeholder="搜索函数"
                type="search"
              />
              <Button
                aria-label="搜索"
                auto
                size={'xs'}
                rounded
                css={{ marginLeft: '1rem' }}
              >
                搜索
              </Button>
            </Row>
            <Spacer />
            <Link href="/workers/creator">创建函数</Link>
          </Col>
          <Col>
            <Spacer></Spacer>
            <h4>函数列表</h4>
            {loading ? <Loading></Loading> : ''}
            {error ? <div>{error.message}</div> : ''}
            {data
              ? data.map(func => (
                  <Card
                    isPressable
                    isHoverable
                    variant="bordered"
                    css={{ mw: '25vw', marginTop: '0.5rem' }}
                    key={func.id}
                    onPress={() => pushToWorkerDetail(func)}
                  >
                    <Card.Body>
                      <Text>{func.name}</Text>
                    </Card.Body>
                  </Card>
                ))
              : ''}
          </Col>
        </Col>

        <Col>
          <div></div>
        </Col>
      </Row>
    </Container>
  );
}
